// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in get_processes: ", req.body)
    try{
        const processes = await prisma.processes.findMany({
            where: {sub_category: req.query.sub_category},
            include:{specs: true}
        })
        console.log("processes fetched: ", processes)
        res.status(200).json(processes)
    }
    catch(error){
        console.log("error in getting processes: ", error)
    }
}