import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in del_category: ", req.body)
    try{
        const category = await prisma.categories.delete({where: {id: req.body.category_id}})
        console.log("category deleted: ", category)
        res.status(200).json(category)
    }
    catch(error){
        console.log("error in del category: ", error)
    }
}