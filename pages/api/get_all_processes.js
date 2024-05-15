import prisma from "../../client"

export default async function handler(req, res){
    console.log("req.query in get_all_processes: ", req.query)
    try{
        const sub_cats = await prisma.sub_Categories.findMany({
            where: {category: req.query.category}
        })
        console.log("sub_cats fetched: ", sub_cats)

        let sub_cat_ids = []
        sub_cat_ids = sub_cats.map((sub_cat) => (sub_cat.id))

        const processes = await prisma.processes.findMany({
            where: {sub_category: {in: sub_cat_ids}},
            include: {specs: true}
        })
        console.log("processes fetched: ", processes)
        res.status(200).json(processes)
    }
    catch(error){
        console.log("error in get_all_processes: ", error)
    }
}