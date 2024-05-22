import { PiPlusSquareThin } from "react-icons/pi";
import Sub_Category_Form from "./Sub_Category_Form";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { GiBoxUnpacking } from "react-icons/gi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

// type User = {
//     username?: string;
//     level?: string;
// };

export default function Sub_Categories({category}){
    const [active, setActive] = useState(false) //if true, model shown
    const [sub_categories, setSub_Categories] = useState([])
    const [current_sub_cat, setCurrent_sub_cat] = useState({})
    const [edit, setEdit] = useState(false)
    const [index, setIndex] = useState(null)
    const session = useSession()

    async function get_sub_categories(){
        try{
            const res = await axios.get(`/api/get_sub_categories`, {
                params: {
                    category: category
                }
            })
            console.log("sub_categories: ", res.data)
            setSub_Categories(res.data)
        }
        catch(error){
            console.log("error in get_sub_categories: ", error)
        }
    }

    async function add_dumy_data(){
        try{
            const res = await axios.post(`/api/add_dumy_data`, {category: category})
            console.log("dumy_data: ", res.data)
            setSub_Categories(res.data)
        }
        catch(error){
            console.log("error in add_dumy_data: ", error)
        }
    }

    useEffect(() => {
        console.log("category in useEffect: ", category)
        if(category){
            get_sub_categories()
        }
    }, [category])

    function toggleModel(){
        console.log("inside toggle")
        setActive(!active)
    }

    async function delete_SubCat(index){
        const confirm = window.confirm("Are you sure you want to delete this sub_category?")
        if(confirm){
            try{
                const res = await axios.post(`/api/delete_sub_category`, {
                    sub_category_id: sub_categories[index].id
                })
                console.log("res.data in del sub_cat: ", res.data)
                let temp_sub_cats = [...sub_categories]
                temp_sub_cats.splice(index, 1)
                setSub_Categories(temp_sub_cats)
            }
            catch(error){
                console.log("error in delete sub_categories: ", error)
            }
        }
        else{
            return
        }
    }

    function editSubCat(index){
        setIndex(index)
        setCurrent_sub_cat(sub_categories[index])
        setEdit(true)
        toggleModel()
    }

    return(
        <div className="h-full flex flex-col">
            {active && <Sub_Category_Form toggleModel={toggleModel} category={category} sub_categories={sub_categories} setSub_Categories={setSub_Categories} index={index} current_sub_cat={current_sub_cat} edit={edit} setEdit={setEdit}/>}
            <div className="flex flex-row items-start space-x-5 font-poppins px-5">
                {session.data?.user?.level === "admin" && 
                <button onClick={toggleModel} className="flex flex-row items-center space-x-2">
                    <PiPlusSquareThin className="h-6 w-6"/>
                    <h1 className="italic text-sm">New Sub-Category</h1>
                </button>}
                {/* {session.data?.user?.level === "admin" && <button onClick={add_dumy_data}>add_dumy_data</button>} */}
            </div>
            <div className="flex flex-col">
                <div className="px-24 py-10 grid gap-x-5 gap-y-10 grid-cols-5 justify-center font-poppins">
                    {sub_categories.map((sub_category, index) => (
                        <div key={index} className="max-w-44 min-h-48 flex flex-col items-center justify-center px-5 py-3 space-y-4 rounded bg-[#1D1D22] hover:bg-[#26262D] dark:bg-[#F0F2FF] hover:dark:bg-[#F7F9FC]">
                            {session.data?.user?.level === "admin" && <div className="flex flex-row space-x-2 self-end">
                                <button onClick={() => editSubCat(index)}><MdEdit className="hover:text-[#3E5EFF]"/></button>
                                <button onClick={() => delete_SubCat(index)}><MdDelete className="text-red-600 hover:text-red-500"/></button>
                            </div>}
                            <Link href={`/time_components/processes/${sub_category.id}`} className="flex flex-col items-center justify-center space-y-4 text-sm">
                                {/* <GiBoxUnpacking className="w-20 h-20 text-[#E3E4E8]"/> */}
                                {sub_category?.img_source !== ""
                                ? <img src={sub_category?.img_source} alt="Sub_Category Image" className="rounded-sm h-32"/>
                                : <img src="/images/placeholder.jpg" alt="Sub_Category Image" className="rounded-sm h-32"/>}
                                
                                <h1 className="font-bold text-center">{sub_category.name}</h1>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="h-1/6"></div> */}
        </div>
    )
}