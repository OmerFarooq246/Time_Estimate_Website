import prisma from "../../client"
import bcryptjs from "bcryptjs"

export default async function handler(req, res) {
    console.log("req.body in adduser: ", req.body)

    const user = await prisma.users.findUnique({where: {username: req.body.userData.username}})
    if(user !== null){
        return res.status(400).json(user)
    }
    
    const password = req.body.userData.password
    const hashedPassword = await bcryptjs.hash(password, 10) //salt = 10
    try{
        const user = await prisma.users.create({
        data: {
            username: req.body.userData.username,
            password: hashedPassword,
            level: req.body.userData.level
        }
        })
        console.log("user added: ", user)
        res.status(200).json(user)
    }
    catch(error){
        console.error("error message:", error.message)
        res.status(500).json({ error });
    }
}
