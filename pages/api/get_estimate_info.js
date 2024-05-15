import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.query in get_estimate_info: ", req.query)
    try{
        const estimate = await prisma.estimate.findFirst({
            where: {id: req.query.estimate_id},
            include: {creating_user: {select: {username: true}}}
        })
        console.log("estimate fetched: ", estimate)
        res.status(200).json(estimate)
    }
    catch(error){
        console.log("error in get_estimate_info: ", error)
    }
}