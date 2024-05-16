import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in edit_estimate_link: ", req.body)
    try{
        const estimate_link = await prisma.estimate_Link.update({
            where: {estimate_id: req.body.estimate_Link.estimate_id},
            data: {
                cd: parseInt(req.body.estimate_Link.engineering.cd),
                r: parseInt(req.body.estimate_Link.engineering.r),
                sd: parseInt(req.body.estimate_Link.engineering.sd),
                ai: parseInt(req.body.estimate_Link.engineering.ai),
                complex: req.body.estimate_Link.complex,
                time_per_unit: parseFloat(req.body.estimate_Link.time_per_unit)
            }
        })
        console.log("updated estimate_link edit: ", estimate_link)

        req.body.estimate_Link.categories_Link.map(async (cat) => {
            console.log("category_link in edit_estimate_link: ", cat)
            const category_link = await prisma.category_Link.update({
                where: {id: cat.id},
                data: {
                    setup: parseInt(cat.time_info.setup),
                    misc: parseInt(cat.time_info.misc),
                    total: parseInt(cat.time_info.total)
                }
            })
            console.log("updated category_link in edit: ", category_link)

            const del_process_links = await prisma.process_Link.deleteMany({
                where: {category_link_id: category_link.id}
            })
            console.log("deleted process_links in edit: ", del_process_links)
            
            cat.processes.map(async (process) => {
                console.log("process in map: ", process)
                const new_process = await prisma.process_Link.create({
                    data: {
                        //process_id: process.process.id,
                        process_rel: {connect: {id: process.process.id}},
                        category_link_rel: {connect: {id: category_link.id}},
                        quantity: process.quantity,
                        specs_info: {
                            create: process.specs_info.map((spec) => ({
                                spec_id: spec.id,
                                option: spec.option
                            }))
                        }
                    }
                })
                console.log("new process_link created in edit: ", new_process)
            })
        })

        res.status(200).json(estimate_link)
    }
    catch(error){
        console.log("error in edit_estimate_link: ", error)
    }
}