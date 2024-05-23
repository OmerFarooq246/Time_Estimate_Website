import { FaPrint } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react";
import Category_Link from "./Category_Link";
import axios from "axios";
import { useRouter } from "next/router"
import React from 'react';
import { useRef } from 'react';

export async function getServerSideProps(context) {
    const { params } = context;
    const { estimate, edit } = params;

    try {
        const res = await axios.get(`/api/get_estimate_info_all`, {
            params: { estimate_id: estimate }
        });

        const data = res.data;

        return {
            props: {
                data,
                edit
            }
        };
    } catch (error) {
        console.error("Error fetching estimate data:", error);
        return {
            props: {
                data: null
            }
        };
    }
}

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


export default function Estimate({estimate, edit}){
// const Estimate = ({data, edit}) => {
    console.log("edit in Estiamte comp: ", edit)
    const session = useSession()
    const router = useRouter()

    const [estimate_info, setEstimate_info] = useState({})
    const [categories_Link, setCategories_Link] = useState([])
    const [complex, setComplex] = useState("NC")
    const [engineering, setEngineering] = useState({cd: 0, r: 0, sd: 0, ai: 0})
    const [total_time_qty, setTotal_time_qty] = useState("")
    const [total_time_each, setTotal_time_each] = useState(0)

    function handleEngineering(event){
        // console.log("event.target: ", event.target)
        setEngineering(prevEng => {return {...prevEng, [event.target.id]: parseFloat(event.target.value)}})
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
        // console.log("event.target: ", event.target)
        let temp_cat_links = [...categories_Link]
        temp_cat_links[event.target.id].time_info.setup = event.target.value
        temp_cat_links[event.target.id].time_info.total = temp_cat_links[event.target.id].processes.map((process) => (parseFloat(process.quantity) * (process.specs_info.map((spec) => (spec.time)).reduce((a, b) => a + b, 0)))).reduce((a, b) => a + b, 0) + parseFloat(temp_cat_links[event.target.id].time_info.setup) + parseFloat(temp_cat_links[event.target.id].time_info.misc)
        console.log("total: ", temp_cat_links[event.target.id].time_info.total)
        setCategories_Link(temp_cat_links)
    }

    function handleMiscChange(event){
        // console.log("event.target: ", event.target)
        let temp_cat_links = [...categories_Link]
        temp_cat_links[event.target.id].time_info.misc = event.target.value
        temp_cat_links[event.target.id].time_info.total = temp_cat_links[event.target.id].processes.map((process) => (parseFloat(process.quantity) * (process.specs_info.map((spec) => (spec.time)).reduce((a, b) => a + b, 0)))).reduce((a, b) => a + b, 0) + parseFloat(temp_cat_links[event.target.id].time_info.setup) + parseFloat(temp_cat_links[event.target.id].time_info.misc)
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

    async function get_estimate_info_all(){
        try{
            const res = await axios.get(`/api/get_estimate_info_all`, {
                params: {estimate_id: estimate}
            })
            console.log("res.data: ", res.data)
            let temp_cats = res.data.Estimate_Link[0].category_link.map((cat) => (
                {
                    id: cat.id,
                    category: {id: cat.category_id, name: cat.name}, 
                    processes: cat.process_link.map((process) => ({
                        id: process.id,
                        process: {
                            id: process.process_rel.id,
                            name: process.process_rel.name,
                            time_per_unit: parseFloat(process.process_rel.time_per_unit),
                            specs: process.process_rel.specs.map((spec) => ({
                                id: spec.id,
                                description: spec.description,
                                process: spec.process,
                                options: spec.options.split(","),
                                time_inc: spec.time_inc.split(",")
                            })),
                            img_source: process.process_rel.img_source
                        }, 
                        specs_info: process.specs_info, 
                        quantity: parseFloat(process.quantity)
                    })),
                    time_info: {
                        setup: parseFloat(cat.setup), 
                        misc: parseFloat(cat.misc), 
                        total: parseFloat(cat.total)
                    }}
            ))
            console.log("temp_cats: ", temp_cats)
            setCategories_Link(temp_cats)

            let temp_info = {
                id: res.data.id,
                name: res.data.name,
                item_no: res.data.item_no,
                quantity: parseFloat(res.data.quantity),
                estimate_no: res.data.estimate_no,
                creating_user: {username: res.data.creating_user.username},
                created_at: format_date(res.data.created_at)
            }
            console.log("temp_info: ", temp_info)
            setEstimate_info(temp_info)

            let temp_engineering = {
                cd: parseFloat(res.data.Estimate_Link[0].cd), 
                r: parseFloat(res.data.Estimate_Link[0].r), 
                sd: parseFloat(res.data.Estimate_Link[0].sd), 
                ai: parseFloat(res.data.Estimate_Link[0].ai)
            }
            console.log("temp_engineering: ", temp_engineering)
            setEngineering(temp_engineering)

            setComplex(res.data.Estimate_Link[0].complex)
        }
        catch(error){
            console.log("error in get_estimate_info_all: ", error)
        }
    }

    useEffect(() => {
        if(edit){
            console.log("in edit useEffect")
            get_estimate_info_all()
        }
        else{
            console.log("in non-edit useEffect")
            get_estimate_info()
            set_categories_Link()
        }
    }, [edit])

    function sum_all_total(){
        let total = categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai
        if(complex === "C"){
            total = ((total + total*5/100)/estimate_info?.quantity).toFixed(2)
            setTotal_time_each(total)
        }
        else if(complex === "VC"){
            total = ((total + total*10/100)/estimate_info?.quantity).toFixed(2)
            setTotal_time_each(total)
        }
        else{
            setTotal_time_each((total/estimate_info?.quantity).toFixed(2))
        }
        // return total
    }

    function sum_total(){
        let total = (categories_Link.map((cat) => ((cat.time_info.total)/60)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai).toFixed(2)
        let complex_value;
        if(complex === "C"){
            complex_value = (total*5/100).toFixed(2)
            setTotal_time_qty(`${total} + ${complex_value} = ${(parseFloat(total) + parseFloat(complex_value)).toFixed(2)}`)
        }
        else if(complex === "VC"){
            complex_value = (total*10/100).toFixed(2)
            setTotal_time_qty(`${total} + ${complex_value} = ${(parseFloat(total) + parseFloat(complex_value)).toFixed(2)}`)
        }
        else if(complex === "NC"){
            // return total
            setTotal_time_qty(`${total}`)
        }
        // return `${total} + ${complex_value} = ${total + complex_value}`
    }

    useEffect(() => {
        if(categories_Link && complex && engineering && estimate_info){
            sum_all_total()
            sum_total()   
        }
    }, [categories_Link, complex, engineering])

    async function handleSaveReport(){
        // const estimate_Link = {estimate_id: estimate_info.id, time_per_unit: sum_all_total(), categories_Link: categories_Link, engineering: engineering, complex: complex}        
        if(edit){
            const estimate_Link = {estimate_id: estimate_info.id, time_per_unit: total_time_each, categories_Link: categories_Link, engineering: engineering, complex: complex}
            console.log("estimate_Link: ", estimate_Link)
            try{
                const res = await axios.post(`/api/edit_estimate_link`,{
                    estimate_Link: estimate_Link
                })
                console.log("res.data in handleSaveReport: ", res.data)
                router.push("/")
            }
            catch(error){
                console.log("error in handleSaveReport: ", error)
            }
        }
        else{
            const estimate_Link = {estimate_id: estimate_info.id, time_per_unit: total_time_each, categories_Link: categories_Link, engineering: engineering, complex: complex}
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
    }

    async function handlePrintReport(){
    }

    return(
        <div id="abc123" className="flex flex-col font-poppins">
            <div className="flex flex-col items-start space-y-3 mb-7 font-poppins px-5">
                {(session.data?.user?.level === "admin" || session.data?.user?.level === "user") && 
                <button disabled onClick={handlePrintReport} className="flex flex-row items-center space-x-1.5">
                    <FaPrint className="h-5 w-5"/>
                    {/* <h1 className="italic text-sm">Print</h1> */}
                    <h1 className="italic text-sm">Press ctrl + p to generate PDF</h1>
                </button>}
                {session.data?.user?.level === "admin" && 
                <button onClick={handleSaveReport} className="flex flex-row items-center space-x-1.5">
                    <FaSave className="h-5 w-5"/>
                    <h1 className="italic text-sm">{edit ? "Save Edit" : "Save"}</h1>
                </button>}
            </div>
            {(estimate_info && categories_Link) && 
            <div className="flex flex-col w-7/12 mb-5 bg-[#1D1D22] dark:bg-[#F7F9FC] rounded px-4 py-4 space-y-3 self-center items-center">
                <div className="flex flex-row justify-between items-center w-full">
                    <img src="/images/logo.png" alt="logo" className="h-10"/>
                    <div className="flex flex-col">
                        <p className="text-xs">Created by: {estimate_info?.creating_user?.username}</p>
                        <p className="text-xs">Created at: {estimate_info?.created_at}</p>
                    </div>
                </div>
                <div className="flex flex-col space-y-1 w-full bg-[#26262D] dark:bg-[#F0F2FF] rounded px-3 py-2">
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
                    <div className="w-full bg-[#26262D] dark:bg-[#F0F2FF] rounded px-3 py-2">
                        <div className="w-full flex flex-col space-y-2 text-sm">
                            <h1 className="font-bold">Engineering</h1>
                            <table className="text-xs bg-[#1D1D22] dark:bg-[#F7F9FC] rounded">
                                <tbody>
                                <tr className="border-b-2 dark:border-b dark:border-[#E0E6FF] border-[#26262D]">
                                    <th className="px-3 py-2 font-semibold w-5/6 text-start">Process</th>
                                    <th className="px-3 py-2 font-semibold w-1/6 text-end">Time (hours)</th>
                                </tr>
                                <tr>
                                    <td className="px-3">Customer Drawing</td>
                                    <td className="flex flex-row justify-end pr-2"><input value={engineering.cd} onChange={handleEngineering} id="cd" type="number" step="0.01" min={0} className="w-16 px-2 py-1 bg-[#31313A] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                                <tr>
                                    <td className="px-3">Revision</td>
                                    <td className="flex flex-row justify-end pr-2"><input value={engineering.r} onChange={handleEngineering} id="r" type="number" step="0.01" min={0} className="w-16 px-2 py-1 bg-[#31313A] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                                <tr>
                                    <td className="px-3">Shop Drawing</td>
                                    <td className="flex flex-row justify-end pr-2"><input value={engineering.sd} onChange={handleEngineering} id="sd" type="number" step="0.01" min={0} className="w-16 px-2 py-1 bg-[#31313A] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                                <tr>
                                    <td className="px-3">Assembly Instructions</td>
                                    <td className="mb-2 flex flex-row justify-end pr-2"><input value={engineering.ai} onChange={handleEngineering} id="ai" type="number" step="0.01" min={0} className="w-16 px-2 py-1 bg-[#31313A] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none"/></td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="flex flex-col w-fit self-end">
                                <table className="text-xs border-separate border-spacing-x-2">
                                    <tbody>
                                    <tr>
                                        <td>Total Engineering Time/EA: </td>
                                        <td><p className="w-16 px-2 py-1 bg-[#31313A] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none">{((engineering.sd + engineering.r + engineering.cd + engineering.ai)/estimate_info.quantity).toFixed(2)}</p></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {Array.isArray(categories_Link) && categories_Link?.map((category, index) => (
                        <div key={index} className="w-full bg-[#26262D] dark:bg-[#F0F2FF] rounded px-3 py-2">
                            <Category_Link index={index} categories_Link={categories_Link} setCategories_Link={setCategories_Link} handleSetUpChange={handleSetUpChange} handleMiscChange={handleMiscChange}/>
                        </div>
                    ))}
                    
                    <table className="w-fit border-separate border-spacing-y-1">
                        <tbody>
                        <tr>
                            <td className="text-xs pr-2">Total time for qty of {estimate_info?.quantity}: </td>
                            <td className="w-18 px-2 py-1 bg-[#31313A] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none">
                                {/* {categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai}
                                {complex === "C" && " + " + ((categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai)*5/100).toFixed(2)}
                                {complex === "VC" && " + " + ((categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai)*10/100).toFixed(2)} */}
                                {/* {sum_total()} */}
                                {total_time_qty}
                            </td>
                            <td className="text-xs pl-1">(hours)</td>
                        </tr>
                        <tr>
                            <td className="text-xs pr-2">Total time for each: </td>
                            <td className="w-18 px-2 py-1 bg-[#31313A] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none">
                                {total_time_each}
                                {/* {(sum_all_total()/estimate_info?.quantity).toFixed(2)} */}
                                {/* {((categories_Link.map((cat) => (cat.time_info.total)).reduce((a, b) => a + b, 0) + engineering.sd + engineering.r + engineering.cd + engineering.ai)/estimate_info?.quantity).toFixed(2)} */}
                            </td>
                            <td className="text-xs pl-1">(hours)</td>
                        </tr>
                        </tbody>
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
            </div>}
        </div>
    )
}

// export default Estimate;