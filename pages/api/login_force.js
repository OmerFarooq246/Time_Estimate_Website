// import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res){
    try{
        // const loginData = await req.body.loginData
        console.log("req.body in login:", JSON.parse(req.body))
        const data = JSON.parse(req.body)

        const user = await prisma.users.findFirst({where: {username: data.username}})
        if (user !== null){
            const matchPassword = await bcryptjs.compare(data.password, user.password)
            if(matchPassword){
                console.log("user: ", user)
                const tokenData = {
                    id: user.id,
                    username: user.username,
                    level: user.level
                }
                const token = await jwt.sign(tokenData, process.env.NEXTAUTH_SECRET, {expiresIn: "1d"})
                res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}`)
                // const response = res.json({message: "user validated", status: 200})
                // response.cookies.set("token", token, {httpOnly: true})
                console.log("user token cookie in login: ", req.cookies);
                // console.log("user token cookie in login: ", req.cookies.token);
                // return res.status(200).json({message: "user validated"})
                res.status(200).json({message: "user validated"})
            }
            else{
                return res.json({message: "incorrect password", status: 401})
            }
        }
        else{
            return res.json({message: "user is not registered", status: 401})
        }
    }
    catch (error){
        console.error("error message:", error.message)
    }
}