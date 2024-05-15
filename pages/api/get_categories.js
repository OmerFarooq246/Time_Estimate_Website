// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in get_categories: ", req.body)
    try{
        const categories = await prisma.categories.findMany({})
        console.log("categories fetched: ", categories)
        res.status(200).json(categories)
    }
    catch(error){
        console.log("error in getting category: ", error)
    }
}