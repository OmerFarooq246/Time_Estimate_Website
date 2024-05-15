import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in del_user: ", req.body)
    try{
        const user = await prisma.users.delete({where: {id: req.body.user_id}})
        console.log("user deleted: ", user)
        res.status(200).json(user)
    }
    catch(error){
        console.log("error in del user: ", error)
    }
}