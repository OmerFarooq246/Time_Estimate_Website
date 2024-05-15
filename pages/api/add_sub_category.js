// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_sub_category: ", req.body)
    try{
        const sub_category = await prisma.sub_Categories.create({
            data: {
                name: req.body.sub_categoryData.name,
                img_source: req.body.sub_categoryData.img_source,
                category: req.body.sub_categoryData.category,
            }
        })
        console.log("sub_category created: ", sub_category)
        res.status(200).json(sub_category)
    }
    catch(error){
        console.log("error in creating sub_category: ", error)
        if(error.code === "P2002"){
            res.status(500).json({error: error.message, code: error.code})
        }
    }
}