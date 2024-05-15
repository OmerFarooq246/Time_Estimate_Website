import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"
// import { PrismaClient } from '@prisma/client'
import prisma from "../../../client"

export default async function handler(req, res){
    
    // const prisma = new PrismaClient()

    const configuration = {
        providers: [
            CredentialsProvider({
                name: "credentials",
                credentials:{},
                async authorize(credentials, req){
                    console.log("req.body in auth: ", req.body)

                    //check if email registered or not
                    try{
                        const user = await prisma.users.findUnique({
                            where:{
                                username: req.body.username
                            }
                        })
                        if (user === null){
                            console.log("email not in db")
                            throw new Error('No user found')
                        }
                        console.log("email in db")
                        console.log("user: ", user)

                        let matchPassword
                        try{
                            matchPassword = await bcryptjs.compare(req.body.password, user.password)
                        }
                        catch(error){
                            console.log("error in pass compare: ", error)
                        }
                        console.log("matchPassword: ", matchPassword)
                        if(matchPassword){
                            // return {email: user.email, username: user.username}
                            return user
                        }
                        else{
                            console.log("invalid password")
                            throw new Error('invalid password')
                        }
                    }
                    catch(error){
                        console.log(error)
                    }
                }
            })
        ],
        secret: process.env.NEXTAUTH_SECRET,
        session: {
            strategy: 'jwt'
        },
        pages:{
            signIn: "/login"
        },
        callbacks: {
            async jwt({ token, user }){
                if(user){
                    token.user = user
                }
                return token
            },
            async session({ session, token}) {
              session.user.username = token.user.username
              session.user.level = token.user.level
              session.user.id = token.user.id
              return session
            }
        }
    }
    return NextAuth(req, res, configuration)
}