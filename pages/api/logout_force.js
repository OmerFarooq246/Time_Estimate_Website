export default async function handler(req, res) {
    try {
        console.log("user token cookie: ", req.cookies.token);
        res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
        return res.status(200).json({ message: "token cookie deleted" });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ message: "token cookie not deleted" });
    }
}




// import { NextResponse } from "next/server"

// export default async function handler(req, res){
//     try{
//         console.log("user token cookie: ", req.cookies.token)
//         const response = res.json({message: "token cookie deleted", status: 200})
//         console.log("clear token response: ", response.cookies.delete("token"))
//         return response
//     }
//     catch(error){
//         console.log("error: ", error)
//         return res.json({message: "token cookie not deleted", status: 500})
//     }
// }