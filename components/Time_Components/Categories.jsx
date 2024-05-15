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

    // const [user, setUser] = useState({} as User)
    // const router = useRouter()
    // async function get_token(){
    //     try{
    //         const res = await axios.get("/api/checktoken")
    //         console.log("res.data: ", res.data)
    //         setUser(res.data)
    //     }
    //     catch(error){
    //         if(error.response.status === 401){
    //             router.push("/login")
    //         }
    //         console.log("error in get_token: ", error)
    //     }
    // }
    // useEffect(() => {
    //     get_token()
    // }, [])


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

    function editCat(index){
        setIndex(index)
        setCurrent_Cat(categories[index])
        setEdit(true)
        toggleModel()
    }

    return(
        <div className="h-full bg-[#161616]">
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
                    <div key={index} className="max-w-40 max-h-48 min-h-48 flex flex-col items-center justify-center px-5 py-3 space-y-5 rounded bg-[#1D1D22] hover:bg-[#26262D]">
                        <div className="flex flex-row space-x-2 self-end">
                            <button onClick={() => editCat(index)}><MdEdit className="hover:text-[#3E5EFF]"/></button>
                            <button onClick={() => deleteCat(index)}><MdDelete className="text-red-600 hover:text-red-500"/></button>
                        </div>
                        <Link href={`/time_components/sub_categories/${category.id}`} className="w-full text-sm flex flex-col items-center justify-center space-y-5">
                            <FaScrewdriverWrench className="w-20 h-20 text-[#E3E4E8]"/>
                            <h1 className="font-bold text-center">{category.name}</h1>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}