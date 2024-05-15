import prisma from "../../client"
import bcryptjs from "bcryptjs"

export default async function handler(req, res) {
    console.log("req.body in edit user: ", req.body)

    const user = await prisma.users.findUnique({where: {username: req.body.userData.username}})
    
    let hashedPassword;
    if(req.body.userData.password === user.password){
        hashedPassword = user.password
    }
    else{
        const password = req.body.userData.password
        hashedPassword = await bcryptjs.hash(password, 10) //salt = 10
    }
    try{
        const user = await prisma.users.update({
            where:{
                username: req.body.userData.username
            },
            data: {
                password: hashedPassword,
                level: req.body.userData.level
            }
        })
        console.log("user edited: ", user)
        res.status(200).json(user)
    }
    catch(error){
        console.error("error message in edit user:", error.message)
        res.status(500).json({ error });
    }
}
