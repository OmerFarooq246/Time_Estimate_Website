import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in del_process: ", req.body)
    try{
        const process = await prisma.processes.delete({where: {id: req.body.process_id}})
        console.log("process deleted: ", process)
        res.status(200).json(process)
    }
    catch(error){
        console.log("error in del process: ", error)
    }
}