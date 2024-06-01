// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_process: ", req.body)
    try{
        const process = await prisma.processes.create({
            data: {
                name: req.body.processData.name,
                // time_per_unit: parseInt(req.body.processData.time_per_unit),
                specs: {
                    create: req.body.processData.specs.map((spec) => (
                        {
                            description: spec.description,
                            options: spec.options.join(','),
                            // time_inc: spec.time_inc.join(','),
                            // process: {connect: {id: process.id}}
                        }
                    ))
                },
                sub_category: req.body.processData.sub_category,
                img_source: req.body.processData.img_source
            }
        })
        console.log("process created: ", process)
        res.status(200).json(process)
    }
    catch(error){
        console.log("error in creating process: ", error)
        if(error.code === "P2002"){
            res.status(500).json({error: error.message, code: error.code})
        }
    }
}