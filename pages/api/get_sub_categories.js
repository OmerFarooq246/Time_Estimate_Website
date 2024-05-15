// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in get_sub_categories: ", req.body)
    console.log("req.query in get_sub_categories: ", req.query)
    try{
        const sub_categories = await prisma.sub_Categories.findMany({
            where: {category: req.query.category}
        })
        console.log("sub_categories fetched: ", sub_categories)
        res.status(200).json(sub_categories)
    }
    catch(error){
        console.log("error in getting sub_category: ", error)
    }
}