import prisma from "../../client"
import fs from 'fs';
import path from 'path';

export default async function handler(req, res){
    console.log("req.body in savePDF: ", req.body)
    try{
        const buffer = Buffer.from(req.body)

        // Save the PDF to a file
        fs.writeFileSync(path.join("C:/Users/Traveler/Downloads", '/TestPDF.pdf'), buffer);

        console.log("pdf created")
        res.status(200).json({message: "pdf created"})
    }
    catch(error){
        console.log("error in creating category: ", error)
    }
}