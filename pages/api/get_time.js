import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in get_time: ", req.body)
    try{
        let times = []
        for(let i = 0; i < req.body.combinations.length; i++){
            // console.log("req.body.combinations[i].join(","): ", req.body.combinations[i].join(","))
            const time = await prisma.time_Pairs.findFirst({
                where: {
                    process: req.body.process,
                    options: req.body.combinations[i].join(",")
                },
                select: {time: true}
            })
            if(time === null){
                times[i] = {time: 0}
            }
            else{
                times[i] = time
            }
        }
        console.log("times in get_time: ", times)
        res.status(200).json(times)
    }
    catch(error){
        console.log("error in get_time: ", error)
    }
}