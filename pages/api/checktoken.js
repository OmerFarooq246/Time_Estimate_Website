import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    try {
        // console.log("user token cookie in checktoken: ", req.cookies.token);
        if(req.cookies.token === undefined){
            return res.status(401).json({message: "unauthorized"});
        }
        else{
            const decoded = jwt.verify(req.cookies.token, process.env.NEXTAUTH_SECRET || "");
            // console.log("decoded user token cookie: ", decoded);
            return res.status(200).json(decoded);
        }
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ message: "token cookie not deleted" });
    }
}