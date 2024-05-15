import { FaPrint } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react";
import Category_Link from "./Category_Link";
import axios from "axios";
import { useRouter } from "next/router"

// type User = {
//     username?: string;
//     level?: string;
// };

// type Estimate = {
//     id?: string,
//     estimate_no?: number,
//     name?: string;
//     quantity?: number,
//     item_no?: number,
//     created_by?: string,
//     created_at?: string,
//     creating_user?: {username: string}
// };


export default function Estimate({estimate}){
    const session = useSession()
    const router = useRouter()

    // const [user, setUser] = useState({})
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

    const [estimate_info, setEstimate_info] = useState({})
    const [categories_Link, setCategories_Link] = useState([])
    const [complex, setComplex] = useState("NC")
    const [engineering, setEngineering] = useState({cd: 0, r: 0, sd: 0, ai: 0})

    function handleEngineering(event){
        // console.log("event.target: ", event.target)
        setEngineering(prevEng => {return {...prevEng, [event.target.id]: parseInt(event.target.value)}})
    }

    function handleComplex(event){
        setComplex(event.target.value)
    }

    async function set_categories_Link(){
        try{
            const res = await axios.get(`/api/get_categories`)
            console.log("categories: ", res.data)
            let temp_cats = res.data
            temp_cats = temp_cats.map((cat) => ({category: cat, processes: [], time_info: {setup: 0, misc: 0, total: 0}}))
            console.log("temp_cats: ", temp_cats)
            setCategories_Link(temp_cats)
        }
        catch(error){
            console.log("error in set_categories_Link: ", error)
        }
    }

    function handleSetUpChange(event){
        console.log("event.target: ", event.target)
        let temp_cat_links = [...categories_Link]
        temp_cat_links[event.target.id].time_info.setup = event.target.value
        temp_cat_links[event.target.id].time_info.total = temp_cat_links[event.target.id].processes.map((process) => (parseInt(process.quantity) * parseInt(process.process.time_per_unit))).reduce((a, b) => a + b, 0) + parseInt(temp_cat_links[event.target.id].time_info.setup) + parseInt(temp_cat_links[event.target.id].time_info.misc)
        console.log("total: ", temp_cat_links[event.target.id].time_info.total)
        setCategories_Link(temp_cat_links)
    }

    function handleMiscChange(event){
        console.log("event.target: ", event.target)
        let temp_cat_links = [...categories_Link]
        temp_cat_links[event.target.id].time_info.misc = event.target.value
        temp_cat_links[event.target.id].time_info.total = temp_cat_links[event.target.id].processes.map((process) => (parseInt(process.quantity) * parseInt(process.process.time_per_unit))).reduce((a, b) => a + b, 0) + parseInt(temp_cat_links[event.target.id].time_info.setup) + parseInt(temp_cat_links[event.target.id].time_info.misc)
        console.log("total: ", temp_cat_links[event.target.id].time_info.total)
        setCategories_Link(temp_cat_links)
    }

    function format_date(date_input){
        let date = new Date(date_input)

        let day = date.getDate(); // Get the day
        let month = date.getMonth() + 1; // Get the month (getMonth() returns month from 0-11)
        let year = date.getFullYear(); // Get the year
        let time = date.toLocaleTimeString(); // Get the time

        let formattedDate = `${day}/${month}/${year} ${time}`;
        return formattedDate
    }

    async function get_estimate_info(){
        try{
            const res = await axios.get(`/api/get_estimate_info`, {
                params: {estimate_id: estimate}
            })
            // console.log("res.data: ", res.data)
            let temp_info = res.data
            temp_info = {...temp_info, "created_at": format_date(temp_info.created_at)}
            console.log("temp_info: ", temp_info)
            setEstimate_info(temp_info)
        }
        catch(error){
            console.log("error in get_estimate_info: ", error)
        }
    }

    useEffect(() => {
        get_estimate_info()
        set_categories_Link()
    }, [])

    function sum_all_total(){
        let total = categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai
        if(complex === "C"){
            total = total + total*5/100
        }
        else if(complex === "VC"){
            total = total + total*10/100
        }
        return total
    }

    function sum_total(){
        let total = categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai
        let complex_value;
        if(complex === "C"){
            complex_value = total*5/100
        }
        else if(complex === "VC"){
            complex_value = total*10/100
        }
        else if(complex === "NC"){
            return total
        }
        return `${total} + ${complex_value} = ${total + complex_value}`
    }

    async function handleSaveReport(){
        const estimate_Link = {estimate_id: estimate_info.id, time_per_unit: sum_all_total(), categories_Link: categories_Link, engineering: engineering, complex: complex}
        console.log("estimate_Link: ", estimate_Link)
        try{
            const res = await axios.post(`/api/add_estimate_link`,{
                estimate_Link: estimate_Link
            })
            console.log("res.data in handleSaveReport: ", res.data)
            router.push("/")
        }
        catch(error){
            console.log("error in handleSaveReport: ", error)
        }
    }

    async function handlePrintReport(){
        // try{
        //     const res = await axios.post(`/api/save_puppet_PDF`)
        //     console.log("res.data in handlePrintReport: ", res.data)
        // }
        // catch(error){
        //     console.log("error in handlePrintReport: ", error)
        // }
    }

    return(
        <div className="flex flex-col font-poppins">
            <div className="flex flex-row items-start space-x-6 font-poppins px-5">
                {session.data?.user?.level === "admin" && 
                <button onClick={handlePrintReport} className="flex flex-row items-center space-x-1.5">
                    <FaPrint className="h-5 w-5"/>
                    <h1 className="italic text-sm">Print</h1>
                </button>}
                {session.data?.user?.level === "admin" && 
                <button onClick={handleSaveReport} className="flex flex-row items-center space-x-1.5">
                    <FaSave className="h-5 w-5"/>
                    <h1 className="italic text-sm">Save</h1>
                </button>}
            </div>
            <div className="flex flex-col w-7/12 mb-5 bg-[#1D1D22] rounded px-4 py-4 space-y-3 self-center items-center">
                <div className="flex flex-row justify-between items-center w-full">
                    <img src="/images/logo.png" alt="logo" className="h-10"/>
                    <div className="flex flex-col">
                        <p className="text-xs">Created by: {estimate_info?.creating_user?.username}</p>
                        <p className="text-xs">Created at: {estimate_info?.created_at}</p>
                    </div>
                </div>
                <div className="flex flex-col space-y-1 w-full bg-[#26262D] rounded px-3 py-2">
                    <div className="flex flex-row">
                        <h1 className="text-sm font-semibold w-1/3">Estiamte # {estimate_info?.estimate_no}</h1>
                        <h1 className="text-sm font-semibold w-2/3">Project Name: {estimate_info?.name}</h1>
                    </div>
                    <div className="flex flex-row">
                        <h1 className="text-sm font-semibold w-1/3">Item # {estimate_info?.item_no}</h1>
                        <h1 className="text-sm font-semibold w-2/3">Quantity: {estimate_info?.quantity}</h1>
                    </div>
                </div>
                <div className="flex flex-col w-full space-y-3">
                    <div className="w-full bg-[#26262D] rounded px-3 py-2">
                        <div className="w-full flex flex-col space-y-2 text-sm">
                            <h1 className="font-bold">Engineering</h1>
                            <table className="text-xs bg-[#1D1D22] rounded">
                                <tr className="border-b-2 border-[#26262D]">
                                    <th className="px-3 py-2 font-semibold w-5/6 text-start">Process</th>
                                    <th className="px-3 py-2 font-semibold w-1/6 text-end">Time (mins)</th>
                                </tr>
                                <tr className="">
                                    <td className="px-3">Customer Drawing</td>
                                    <td className="flex flex-row justify-end pr-2"><input value={engineering.cd} onChange={handleEngineering} id="cd" type="number" min={0} className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                                <tr className="">
                                    <td className="px-3">Revision</td>
                                    <td className="flex flex-row justify-end pr-2"><input value={engineering.r} onChange={handleEngineering} id="r" type="number" min={0} className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                                <tr className="">
                                    <td className="px-3">Shop Drawing</td>
                                    <td className="flex flex-row justify-end pr-2"><input value={engineering.sd} onChange={handleEngineering} id="sd" type="number" min={0} className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                                <tr className="">
                                    <td className="px-3">Assembly Instructions</td>
                                    <td className="mb-2 flex flex-row justify-end pr-2"><input value={engineering.ai} onChange={handleEngineering} id="ai" type="number" min={0} className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                            </table>
                            <div className="flex flex-col w-fit self-end">
                                <table className="text-xs border-separate border-spacing-x-2">
                                    <tr className="">
                                        <td>Total Engineering Time/EA: </td>
                                        <td><p className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">{engineering.sd + engineering.r + engineering.cd + engineering.ai}</p></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    {categories_Link?.map((category, index) => (
                        <div key={index} className="w-full bg-[#26262D] rounded px-3 py-2">
                            <Category_Link index={index} categories_Link={categories_Link} setCategories_Link={setCategories_Link} handleSetUpChange={handleSetUpChange} handleMiscChange={handleMiscChange}/>
                        </div>
                    ))}
                    
                    <table className="w-fit border-separate border-spacing-y-1">
                        <tr className="">
                            <td className="text-xs pr-2">Total time for qty of {estimate_info?.quantity}: </td>
                            <td className="w-18 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">
                                {/* {categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai}
                                {complex === "C" && " + " + ((categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai)*5/100).toFixed(2)}
                                {complex === "VC" && " + " + ((categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai)*10/100).toFixed(2)} */}
                                {sum_total()}
                            </td>
                        </tr>
                        <tr className="">
                            <td className="text-xs pr-2">Total time for each: </td>
                            <td className="w-18 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">
                                {(sum_all_total()/estimate_info?.quantity).toFixed(4)}
                                {/* {((categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai)/estimate_info?.quantity).toFixed(4)} */}
                            </td>
                        </tr>
                    </table>

                    <div className="flex flex-row space-x-5 justify-center items-center pt-6">
                        <h1 className="text-xs font-semibold">Complexity Factor:</h1>
                        <div className="flex flex-col items-center space-y-2">
                            <input onChange={handleComplex} type="checkbox" id="NC" value={"NC"} checked={complex === "NC"} className="w-6 h-6 focus:outline-none border-0 outline-0"/>
                            <label htmlFor="NC" className="text-xs">Not Complex</label>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <input onChange={handleComplex} type="checkbox" id="C" value={"C"} checked={complex === "C"} className="w-6 h-6 focus:outline-none border-0 outline-0"/>
                            <label htmlFor="c" className="text-xs">Complex</label>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <input onChange={handleComplex} type="checkbox" id="VC" value={"VC"} checked={complex === "VC"} className="w-6 h-6 focus:outline-none border-0 outline-0"/>
                            <label htmlFor="VC" className="text-xs">Very Complex</label>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}