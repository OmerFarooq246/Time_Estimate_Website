import multer from 'multer'
import cloudinary from 'cloudinary'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from "fs"

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SCERET
});

export const config = {
    api: {
      bodyParser: false, // Disabling Next.js' built-in body parser allows multer to work
    },
};

const storage = multer.diskStorage({
    filename: function(req, file, cb){
        // cb(null, uuidv4() + path.extname(file.originalname)) // append the original file extension
        cb(null, uuidv4())
    }
})

const upload = multer({ storage: storage })

export default async function handler(req, res){
    upload.single('file')(req, res, async (err) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }

        // Upload image to cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            public_id: req.file.filename,
            folder: 'uploads'
        });

        console.log("Image uploaded, secure_url: ", result.secure_url)
        console.log("Image uploaded, public_id: ", result.public_id)
        // remove file from server
        fs.unlinkSync(req.file.path)

        // return image details
        res.json({ secure_url: result.secure_url, public_id: result.public_id });
    })
}



// import path from "path"
// import multer from "multer"

// const storage = multer.diskStorage({
//     destination: function(req, res, cb){
//         cb(null, path.join(process.cwd(), "/renderer/public/images/"))
//         // cb(null, "/public/images/",)
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname)
//     }
// })

// export const config = {
//     api: {
//       bodyParser: false, // Disabling Next.js' built-in body parser allows multer to work
//     },
// };

// const upload = multer({storage: storage})

// export default async function handler(req, res){
//     console.log("req.keys in img_upload: ", Object.keys(req))
//     console.log("req.file: " + req.file)

//     try{
//         upload.single("file")(req, res, (error) => {
//             if (error) {console.log("error in multer cb: ", error)}
            
//             console.log("img saved at: " + req.file)
//             res.status(200).json("img saved at: " + req.file)
//         })
//     }
//     catch(error){
//         console.log("error in img_upload: ", error)
//     }
// }