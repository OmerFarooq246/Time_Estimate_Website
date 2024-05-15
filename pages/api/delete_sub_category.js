import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in del_sub_category: ", req.body)
    try{
        const sub_category = await prisma.sub_Categories.delete({where: {id: req.body.sub_category_id}})
        console.log("sub_category deleted: ", sub_category)
        res.status(200).json(sub_category)
    }
    catch(error){
        console.log("error in del sub_category: ", error)
    }
}