import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in get_users: ", req.body)
    try{
        const users = await prisma.users.findMany({})
        console.log("users fetched: ", users)
        res.status(200).json(users)
    }
    catch(error){
        console.log("error in getting users: ", error)
    }
}