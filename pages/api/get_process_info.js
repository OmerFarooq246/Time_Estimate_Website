// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.query in get_process_info: ", req.query)
    try{
        const process = await prisma.processes.findFirst({
            where: {id: req.query.process_id},
            include:{
                specs: true
            }
        })
        console.log("process fetched: ", process)
        res.status(200).json(process)
    }
    catch(error){
        console.log("error in get_process_info: ", error)
    }
}