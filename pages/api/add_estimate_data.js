import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_estimate_data: ", req.body)
    try{
        const estimate = await prisma.estimate.create({
            data: {
                estimate_no: parseInt(req.body.new_estimteData.estimate_no),
                name: req.body.new_estimteData.name,
                quantity: parseInt(req.body.new_estimteData.quantity),
                item_no: parseInt(req.body.new_estimteData.item_no),
                created_by: req.body.new_estimteData.created_by_id,
            }
        })
        console.log("estimate created: ", estimate)
        res.status(200).json(estimate)
    }
    catch(error){
        console.log("error in creating estimate: ", error)
    }
}