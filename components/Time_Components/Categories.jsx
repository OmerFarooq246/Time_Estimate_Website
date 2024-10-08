import { PiPlusSquareThin } from "react-icons/pi";
import Category_Form from "./Category_Form";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

// type User = {
//     username?: string;
//     level?: string;
// };

export default function Categories(){
    const [active, setActive] = useState(false) //if true, model shown
    const [categories, setCategories] = useState([])
    const [current_Cat, setCurrent_Cat] = useState({})
    const [edit, setEdit] = useState(false)
    const [index, setIndex] = useState(null)
    const session = useSession()

    async function get_categories(){
        try{
            const res = await axios.get(`/api/get_categories`)
            console.log("categories: ", res.data)
            setCategories(res.data)
        }
        catch(error){
            console.log("error in get_categories: ", error)
        }
    }

    async function add_dumy_data(){
        try{
            const res = await axios.get(`/api/add_dumy_data`)
            console.log("dumy_data: ", res.data)
            setCategories(res.data)
        }
        catch(error){
            console.log("error in add_dumy_data: ", error)
        }
    }

    useEffect(() => {
        get_categories()
    }, [])

    function toggleModel(){
        console.log("inside toggle")
        setActive(!active)
    }

    async function deleteCat(index){
        const confirm = window.confirm("Are you sure you want to delete this category?")
        if(confirm){
            try{
                const res = await axios.post(`/api/delete_category`, {
                    category_id: categories[index].id
                })
                console.log("res.data in del cat: ", res.data)
                let temp_cats = [...categories]
                temp_cats.splice(index, 1)
                setCategories(temp_cats)
            }
            catch(error){
                console.log("error in delete categories: ", error)
            }
        }
        else{
            return
        }
    }

    function editCat(index){
        setIndex(index)
        setCurrent_Cat(categories[index])
        setEdit(true)
        toggleModel()
    }

    return(
        <div className="h-full bg-[#161616] dark:bg-[#FFFFFF]">
            {active && <Category_Form toggleModel={toggleModel} categories={categories} setCategories={setCategories} index={index} current_Cat={current_Cat} edit={edit} setEdit={setEdit}/>}
            <div className="flex flex-row items-start space-x-5 font-poppins px-5">
                {session.data?.user?.level === "admin" && 
                <button onClick={toggleModel} className="flex flex-row items-center space-x-2">
                    <PiPlusSquareThin className="h-6 w-6"/>
                    <h1 className="italic text-sm">New Category</h1>
                </button>}
                {/* {session.data?.user?.level === "admin" && <button onClick={add_dumy_data}>add_dumy_data</button>} */}
            </div>
            <div className="px-24 py-10 grid gap-x-5 gap-y-10 grid-cols-5 justify-center font-poppins">
                {categories.map((category, index) => (
                    <div key={index} className="max-w-44 min-h-48 flex flex-col items-center justify-center px-5 py-3 space-y-4 rounded bg-[#1D1D22] hover:bg-[#26262D] dark:bg-[#F0F2FF] hover:dark:bg-[#F7F9FC]">
                        {session.data?.user?.level === "admin" && 
                        <div className="flex flex-row space-x-2 self-end">
                            <button onClick={() => editCat(index)}><MdEdit className="hover:text-[#3E5EFF]"/></button>
                            <button onClick={() => deleteCat(index)}><MdDelete className="text-red-600 hover:text-red-500"/></button>
                        </div>}
                        <Link href={`/time_components/sub_categories/${category.id}`} className="text-sm flex flex-col items-center justify-center space-y-4">
                            {/* <FaScrewdriverWrench className="w-20 h-20 text-[#E3E4E8]"/> */}
                            {category?.img_source !== ""
                            ? <img src={category?.img_source} alt="Category Image" className="rounded-sm h-32"/>
                            : <img src="/images/placeholder.jpg" alt="Category Image" className="rounded-sm h-32"/>}
                            
                            <h1 className="font-bold text-center">{category.name}</h1>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}