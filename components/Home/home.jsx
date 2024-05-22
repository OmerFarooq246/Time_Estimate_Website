import { LuClipboardEdit } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineGroupWork } from "react-icons/md";
import Link from "next/link";
import New_Estimate_Form from "../Estimate/New_Estimate_Form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";

// type User = {
//     username?: string;
//     level?: string;
// };

export default function Home(){
    const [active, setActive] = useState(false)
    const session = useSession()
    // const [user, setUser] = useState({})

    // useEffect(() => {
    //     setUser(session?.data?.user)
    //     console.log("session?.data?.user: ", session?.data?.user)
    // }, [session?.data?.user])
    
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

    function toggleModel(){
        console.log("session?.data?.user?.level: ", session?.data?.user?.level)
        setActive(!active)
        // if(session?.data?.user?.level === "read only"){
        //     // alert
        //     return
        // }
        // else{
        //     setActive(!active)
        // }
    }

    return(
        <div className="h-full">
            {active && <New_Estimate_Form toggleModel={toggleModel} user={session.data?.user}/>}
            <div className="h-1/5"></div>
            <div className="h-3/5 flex flex-row font-poppins justify-center space-x-20">
                <button disabled={session?.data?.user?.level === "read only"} onClick={toggleModel} className={`h-4/6 w-1/6 px-7 bg-[#1D1D22] dark:bg-[#F7F9FC] flex flex-col justify-center items-center rounded hover:bg-[#26262D] hover:dark:bg-[#F0F2FF]`}>
                    <LuClipboardEdit className="w-24 h-24 text-[#E3E4E8] dark:text-[#000C47]"/>
                    <h1 className="font-bold mt-8">New Estimate</h1>
                </button>
                <Link href="/project_estimates" className="h-4/6 w-1/6 px-7 bg-[#1D1D22] dark:bg-[#F7F9FC] flex flex-col justify-center items-center rounded hover:bg-[#26262D] hover:dark:bg-[#F0F2FF]">
                    <TbReportSearch className="w-24 h-24 text-[#E3E4E8] dark:text-[#000C47]"/>
                    <h1 className="font-bold mt-8">Project Estimates</h1>
                </Link>
                <Link href="/time_components/categories" className="h-4/6 w-1/6 px-7 bg-[#1D1D22] dark:bg-[#F7F9FC] flex flex-col justify-center items-center rounded hover:bg-[#26262D] hover:dark:bg-[#F0F2FF]">
                    <MdOutlineGroupWork className="w-24 h-24 text-[#E3E4E8] dark:text-[#000C47]"/>
                    <h1 className="font-bold mt-8">Time Components</h1>
                </Link>
            </div>
            <div className="h-1/5"></div>
        </div>
    )
}