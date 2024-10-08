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
import Set_Time_Form from "./Set_Time_Form";

// type User = {
//     username?: string;
//     level?: string;
// };

export default function Processes({sub_category}){
    const [active, setActive] = useState(false) //if true, model shown
    // const [active_2, setActive_2] = useState(false) //if true, set time form shown
    const [processes, setProcesses] = useState([])
    const [current_Process, setCurrent_Process] = useState({})
    const [current_img, set_Current_img] = useState(null)
    const [edit, setEdit] = useState(false)
    const [index, setIndex] = useState(null)
    const session = useSession()

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
        if(sub_category){
            get_processes()
        }
    }, [sub_category, edit])

    function toggleModel(){
        console.log("inside toggle")
        setActive(!active)
    }

    async function deleteProcess(index){
        const confirm = window.confirm("Are you sure you want to delete this process?")
        if(confirm){
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
        else{
            return
        }
    }

    function editProcess(index){
        setIndex(index)
        let temp_process = processes[index]
        temp_process.specs.map((spec) => {
            if(!Array.isArray(spec.options)){
                spec.options = spec.options.split(",")
                // spec.time_inc = spec.time_inc.split(",")
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
            {/* {active_2 && <Set_Time_Form toggleModel={toggleModel} sub_category={sub_category} processes={processes} setProcesses={setProcesses} index={index} current_Process={current_Process} edit={edit} setEdit={setEdit}/>} */}
            <div className="flex flex-row items-start space-x-5 font-poppins px-5">
                {session.data?.user?.level === "admin" && 
                <button onClick={toggleModel} className="flex flex-row items-center space-x-2">
                    <PiPlusSquareThin className="h-6 w-6"/>
                    <h1 className="italic text-sm">New Process</h1>
                </button>}
                {/* {session.data?.user?.level === "admin" && <button onClick={add_dumy_data}>add_dumy_data</button>} */}
            </div>
            <div className="flex flex-col">
                <div className="px-24 py-10 grid gap-x-5 gap-y-10 grid-cols-5 justify-center font-poppins">
                    {processes.map((process, index) => (
                        <div key={index} className="max-w-44 min-h-48 flex flex-col items-center justify-center px-5 py-3 space-y-4 rounded bg-[#1D1D22] hover:bg-[#26262D] dark:bg-[#F0F2FF] hover:dark:bg-[#F7F9FC]">
                            {session.data?.user?.level === "admin" && 
                            <div className="flex flex-row space-x-2 self-end">
                                <button onClick={() => editProcess(index)}><MdEdit className="hover:text-[#3E5EFF]"/></button>
                                <button onClick={() => deleteProcess(index)}><MdDelete className="text-red-600 hover:text-red-500"/></button>
                            </div>}
                            <Link href={`/time_components/process/${process.id}`} className="flex flex-col items-center justify-center space-y-4 text-sm">
                                {process?.img_source !== ""
                                ? <img src={process?.img_source} alt="Category Image" className="rounded-sm h-32"/>
                                : <img src="/images/placeholder.jpg" alt="Category Image" className="rounded-sm h-32"/>}
                                
                                {/* <MdSettingsInputComponent className="w-20 h-20 text-[#E3E4E8]"/> */}
                                <h1 className="font-bold text-center">{process.name}</h1>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}