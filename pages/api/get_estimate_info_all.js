import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.query in get_estimate_info_all: ", req.query)
    try{
        const estimate = await prisma.estimate.findFirst({
            where: {id: req.query.estimate_id},
            include: {
                creating_user: {select: {username: true}},
                Estimate_Link: {
                    include: {
                        category_link: {
                            include: {
                                process_link: {
                                    include: {
                                        process_rel: {
                                            select: {
                                                id: true,
                                                name: true,
                                                // time_per_unit: true,
                                                specs: true,
                                                img_source: true,
                                            }
                                        },
                                        specs_info: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        // console.log("estimate fetched in all: ", estimate)
        res.status(200).json(estimate)
    }
    catch(error){
        console.log("error in get_estimate_info_all: ", error)
    }
}