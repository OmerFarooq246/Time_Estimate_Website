// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_category: ", req.body)

    try{
        const category = await prisma.categories.create({
            data: {
                name: req.body.categoryData.name,
                img_source: req.body.categoryData.img_source,
            }
        })
        console.log("category created: ", category)
        res.status(200).json(category)
    }
    catch(error){
        console.log("error in creating category: ", error)
        if(error.code === "P2002"){
            res.status(500).json({error: error.message, code: error.code})
        }
    }
}