import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in edit_category: ", req.body)
    try{
        const category = await prisma.categories.update({
            where:{id: req.body.categoryData.id},
            data: {
                name: req.body.categoryData.name,
                img_source: req.body.categoryData.img_source,
            }
        })
        console.log("category updated: ", category)
        res.status(200).json(category)
    }
    catch(error){
        console.log("error in editing category: ", error)
    }
}