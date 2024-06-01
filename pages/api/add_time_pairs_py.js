import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_time_pairs_py: ", req.body)
    try{
        const time_pairs = await prisma.time_Pairs.createMany({
            data: req.body.time_pairs
        })
        console.log("time_pairs created: ", time_pairs)
        res.status(200).json(time_pairs)
    }
    catch(error){
        console.log("error in add_time_pairs_py: ", error)
    }
}