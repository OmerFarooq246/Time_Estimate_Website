import { PiPlusSquareThin } from "react-icons/pi";
import Process_Form from "./Process_Form";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdSettingsInputComponent } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

// type User = {
//     username?: string;
//     level?: string;
// };

export default function Processes({sub_category}){
    const [active, setActive] = useState(false) //if true, model shown
    const [processes, setProcesses] = useState([])
    const [current_Process, setCurrent_Process] = useState({})
    const [current_img, set_Current_img] = useState(null)
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

    async function get_processes(){
        try{
            const res = await axios.get(`/api/get_processes`, {
                params: {
                    sub_category: sub_category
                }
            })
            console.log("processes: ", res.data)
            setProcesses(res.data)
        }
        catch(error){
            console.log("error in get_processes: ", error)
        }
    }

    async function add_dumy_data(){
        try{
            const res = await axios.post(`/api/add_dumy_data`, {sub_category: sub_category})
            console.log("dumy_data: ", res.data)
            setProcesses(res.data)
        }
        catch(error){
            console.log("error in add_dumy_data: ", error)
        }
    }

    useEffect(() => {
        get_processes()
    }, [])

    function toggleModel(){
        console.log("inside toggle")
        setActive(!active)
    }

    async function deleteProcess(index){
        try{
            const res = await axios.post(`/api/delete_process`, {
                process_id: processes[index].id
            })
            console.log("res.data in del process: ", res.data)
            let temp_processes = [...processes]
            temp_processes.splice(index, 1)
            setProcesses(temp_processes)
        }
        catch(error){
            console.log("error in delete processes: ", error)
        }
    }

    function editProcess(index){
        setIndex(index)
        let temp_process = processes[index]
        temp_process.specs.map((spec) => {
            if(!Array.isArray(spec.options)){
                spec.options = spec.options.split(",")
            }
            else{
                console.log("process in edit has options already in array: ", spec.options)
            }
        })
        set_Current_img(temp_process.img_source)
        setCurrent_Process(temp_process)
        console.log("current_Process: ", temp_process)
        setEdit(true)
        toggleModel()
    }

    return(
        <div className="h-full flex flex-col">
            {active && <Process_Form toggleModel={toggleModel} sub_category={sub_category} processes={processes} setProcesses={setProcesses} index={index} current_Process={current_Process} edit={edit} setEdit={setEdit}/>}
            <div className="flex flex-row items-start space-x-5 font-poppins px-5">
                {session.data?.user?.level === "admin" && 
                <button onClick={toggleModel} className="flex flex-row items-center space-x-2">
                    <PiPlusSquareThin className="h-6 w-6"/>
                    <h1 className="italic text-sm">New Process</h1>
                </button>}
                {session.data?.user?.level === "admin" && <button onClick={add_dumy_data}>add_dumy_data</button>}
            </div>
            <div className="flex flex-col">
                <div className="px-24 py-10 grid gap-x-5 gap-y-10 grid-cols-5 justify-center font-poppins">
                    {processes.map((process, index) => (
                        <div key={index} className="max-w-40 max-h-48 min-h-48 flex flex-col items-center justify-center px-5 py-3 space-y-5 rounded bg-[#1D1D22] hover:bg-[#26262D]">
                            <div className="flex flex-row space-x-2 self-end">
                                <button onClick={() => editProcess(index)}><MdEdit className="hover:text-[#3E5EFF]"/></button>
                                <button onClick={() => deleteProcess(index)}><MdDelete className="text-red-600 hover:text-red-500"/></button>
                            </div>
                            <Link href={`/time_components/process/${process.id}`} className="flex flex-col items-center justify-center space-y-5">
                                <MdSettingsInputComponent className="w-20 h-20 text-[#E3E4E8]"/>
                                <h1 className="h-1/5 font-bold">{process.name}</h1>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}