import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in set_time: ", req.body)
    // const search = await prisma.time_Pairs.findFirst({
    //     where: {options: '1/8"TK,1"Dia.123 '}
    // })
    // console.log("search find: ", search)
    
    let time_pairs = []
    let temp_combinations = req.body.combinations
    temp_combinations.map((comb, index) => {
        temp_combinations[index] = comb.join(",")
        time_pairs[index] = {
            options: temp_combinations[index], 
            time: parseFloat(req.body.times[index]),
            process: req.body.process
        }
    })
    console.log("time_pairs prepared: ", time_pairs)

    try{
        const del = await prisma.time_Pairs.deleteMany({
            where: {process: req.body.process}
        })
        console.log("deleted time_pairs: ", del)
    }
    catch(error){
        console.log("error in deleting time_pairs: ", error)
    }

    try{
        const time_pairs_created = await prisma.time_Pairs.createMany({
            data: time_pairs
        })
        console.log("time set successful: ", time_pairs_created)
        res.status(200).json(time_pairs_created)
    }
    catch(error){
        console.log("error in set_time: ", error)
    }
}