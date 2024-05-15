import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in edit_process: ", req.body)
    try{
        const process = await prisma.processes.update({
            where:{id: req.body.processData.id},
            data: {
                name: req.body.processData.name,
                img_source: req.body.processData.img_source,
                time_per_unit: parseInt(req.body.processData.time_per_unit)
            }
        })

        // const specs = await prisma.spec.findMany({where:{process: req.body.processData.id}})
        // if(specs.length === req.body.processData.specs.length){
        //     req.body.processData.specs.map(async (spec) => {
        //         const updated_spec = await prisma.spec.update({
        //             where: {id: spec.id},
        //             data: {
        //                 description: spec.description,
        //                 options: spec.options.join(',')
        //             }
        //         })
        //         console.log("updated_spec: ", updated_spec)
        //     })
        // }
        // else{
        //     req.body.processData.specs.map(async (spec) => {
        //     })
        // }

        req.body.processData.specs.map(async (spec) => {
            if(spec.id){
                const updated_spec = await prisma.spec.update({
                    where: {id: spec.id},
                    data: {
                        description: spec.description,
                        options: spec.options.join(',')
                    }
                })
                console.log("updated_spec: ", updated_spec)
            }
            else{
                const new_spec = await prisma.spec.create({
                    data: {
                        description: spec.description,
                        options: spec.options.join(','),
                        process: req.body.processData.id
                    }
                })
                console.log("new_spec: ", new_spec)
            }
        })

        const full_process = await prisma.processes.findFirst({
            where: {id: process.id},
            include: {specs: true}
        })
        
        console.log("full_process updated: ", full_process)
        res.status(200).json(full_process)
    }
    catch(error){
        console.log("error in editing process: ", error)
    }
}