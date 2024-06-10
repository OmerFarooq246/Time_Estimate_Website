import { useEffect, useState } from "react"
import Add_User_Form from "./Add_User_Form"
import User_Table from "./User_Table"
import axios from "axios"
import { useRouter } from "next/router"

export default function Admin_Panel(){
    const [active, setActive] = useState(false) //if true, model shown
    const [edit, setEdit] = useState(false)
    const [users, setUsers] = useState([])
    const [current_user, setCurrent_user] = useState({})
    const [index, setIndex] = useState(null)

    // const router = useRouter()
    // async function get_token(){
    //     try{
    //         const res = await axios.get("/api/checktoken")
    //         console.log("res.data: ", res.data)
    //         // setUser(res.data)
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

    async function getUsers(){
        try{
            const res = await axios.get(`/api/get_users`)
            setUsers(res.data)
        }
        catch(error){
            console.log("error in getting users: ", error)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])
    
    function toggleModel(){
        setActive(!active)
    }

    return(
        <div className="flex flex-col px-10 font-poppins bg-[#161616] dark:bg-[#FFFFFF] dark:text-[#17181C]">
            <button onClick={toggleModel} className="w-fit focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] dark:text-[#F9FAFF] bg-[#3E5EFF] text-xs px-5 py-2 text-lg rounded-sm">Add User</button>
            {active && <Add_User_Form toggleModel={toggleModel} index={index} users={users} setUsers={setUsers} current_user={current_user} edit={edit} setEdit={setEdit}/>}
            <User_Table users={users} setIndex={setIndex} toggleModel={toggleModel} setUsers={setUsers} setCurrent_user={setCurrent_user} setEdit={setEdit}/>
        </div>

    )
}