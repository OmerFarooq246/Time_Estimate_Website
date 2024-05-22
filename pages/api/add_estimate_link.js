import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_estimate_link: ", req.body)
    try{
        const estimate_link = await prisma.estimate_Link.create({
            data: {
                estimate_id: req.body.estimate_Link.estimate_id,
                cd: req.body.estimate_Link.engineering.cd,
                r: req.body.estimate_Link.engineering.r,
                sd: req.body.estimate_Link.engineering.sd,
                ai: req.body.estimate_Link.engineering.ai,
                complex: req.body.estimate_Link.complex,
                time_per_unit: parseFloat(req.body.estimate_Link.time_per_unit),
                category_link: {
                    create: req.body.estimate_Link.categories_Link.map(categoryLink => ({
                        name: categoryLink.category.name,
                        category_id: categoryLink.category.id,
                        setup: parseInt(categoryLink.time_info.setup),
                        misc: parseInt(categoryLink.time_info.misc),
                        total: parseInt(categoryLink.time_info.total),
                        process_link: {
                            create: categoryLink.processes.map((process) => ({
                                process_id: process.process.id,
                                quantity: process.quantity,
                                specs_info: {
                                    create: process.specs_info.map((spec) => ({
                                        spec_id: spec.id,
                                        option: spec.option,
                                        time: spec.time
                                    }))
                                }
                            }))
                        }
                        // process_id: categoryLink.process.id,
                        // quantity: categoryLink.processes.reduce((total, process) => total + process.quantity, 0),
                        // specs_info: {
                        //     create: categoryLink.processes.flatMap(process => 
                        //     process.specs_info.map(specInfo => ({
                        //         spec_id: specInfo.id,
                        //         option: specInfo.option
                        //     })))
                        // }
                    }))
              }
            }
        });

        console.log("estimate_link created: ", estimate_link)
        res.status(200).json(estimate_link)
    }
    catch(error){
        console.log("error in creating estimate_link: ", error)
    }
}