// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_category: ", JSON.parse(req.body))
    const data = JSON.parse(req.body)

    try{
        const category = await prisma.categories.create({
            data: {
                name: data.categoryData.name,
                img_source: data.categoryData.img_source,
            }
        })
        console.log("category created: ", category)
        res.status(200).json(JSON.stringify(category))
    }
    catch(error){
        console.log("error in creating category: ", error)
        if(error.code === "P2002"){
            res.status(500).json({error: error.message, code: error.code})
        }
    }
}