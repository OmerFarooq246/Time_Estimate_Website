import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in delete_estimate: ", req.body)
    try{
        const estimate = await prisma.estimate.delete({where: {id: req.body.estimate_id}})
        console.log("estimate deleted: ", estimate)
        res.status(200).json(estimate)
    }
    catch(error){
        console.log("error in delete_estimate: ", error)
    }
}