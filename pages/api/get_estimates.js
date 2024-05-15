import prisma from "../../client"

export default async function handler(req, res){
    try{
        const estimates = await prisma.estimate.findMany({
            include: {creating_user: {select: {username: true}}, Estimate_Link: true}
        })
        console.log("estimates fetched: ", estimates)
        res.status(200).json(estimates)
    }
    catch(error){
        console.log("error in get_estimates: ", error)
    }
}