import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in delete_spec: ", req.body)
    try{
        const spec = await prisma.spec.deleteMany({
            where: {id: {in: req.body.spec_ids}}
        })
        console.log("spec deleted: ", spec)
        res.status(200).json(spec)
    }
    catch(error){
        console.log("error in del spec: ", error)
    }
}