// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.body in add_category: ", req.body)
    try{
        let dumy_data = []
        let process = "Process_"
        let img_src = "img_source_"
        for(let i = 1; i < 5; i++){
            const processDB = await prisma.processes.create({
                data: {
                    name: process + i.toString(),
                    // time_per_unit: 2,
                    specs: {
                        createMany: {
                            data: [
                                    {
                                        description: "Spec_1",
                                        options: "option_1, option_2, option_3, option_4"
                                    },
                                    {
                                        description: "Spec_2",
                                        options: "option_1, option_2, option_3, option_4"
                                    }
                                    
                            ],
                            
                        }
                    },
                    sub_category: req.body.sub_category,
                    img_source: img_src + i.toString()
                }
            })
            dumy_data = [...dumy_data, processDB]
        }
        console.log("dumy_data: ", dumy_data)
        res.status(200).json(dumy_data)
    }
    catch(error){
        console.log("error in creating dumy data: ", error)
    }
}

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// export default async function handler(req, res){
//     console.log("req.body in add_category: ", req.body)
    
//     let dumy_data = []
//     let sub_cat = "Sub_Cat_"
//     let img_src = "img_source_"
//     for(let i = 1; i < 16; i++){
//         dumy_data = [...dumy_data, {name: sub_cat + i.toString(), img_source: img_src + i.toString(), category: req.body.category}]
//     }
//     console.log("dumy_data: ", dumy_data)
//     try{
//         // const categories_del_count = await prisma.categories.deleteMany({})

//         const sub_categories_count = await prisma.sub_Categories.createMany({
//             data: dumy_data
//         })
//         console.log("sub_categories created: ", sub_categories_count)
        
//         const sub_categories = await prisma.sub_Categories.findMany({})
//         res.status(200).json(sub_categories)
//     }
//     catch(error){
//         console.log("error in creating dumy data: ", error)
//     }
// }