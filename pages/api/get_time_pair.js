import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.query in get_time_pair: ", req.query)
    try{
        const time_pair = await prisma.time_Pairs.findFirst({
            where: {
                process: req.query.process,
                options: req.query.pair
            }
        })
        console.log("time_pair fetched: ", time_pair)
        res.status(200).json(time_pair)
    }
    catch(error){
        console.log("error in getting time_pair: ", error)
    }
}