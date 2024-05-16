import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in delete_process_of_link: ", req.body)
    try{
        const process = await prisma.process_Link.delete({where: {id: req.body.process_link_id}})
        console.log("process deleted: ", process)
        res.status(200).json(process)
    }
    catch(error){
        console.log("error in delete_process_of_link: ", error)
    }
}