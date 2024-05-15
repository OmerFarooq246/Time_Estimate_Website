import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in edit_sub_category: ", req.body)
    try{
        const sub_category = await prisma.sub_Categories.update({
            where:{id: req.body.sub_categoryData.id},
            data: {
                name: req.body.sub_categoryData.name,
                img_source: req.body.sub_categoryData.img_source,
            }
        })
        console.log("sub_category updated: ", sub_category)
        res.status(200).json(sub_category)
    }
    catch(error){
        console.log("error in editing sub_category: ", error)
    }
}