import { useState, useEffect, useRef } from "react"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useRouter } from "next/router";

export default function New_Estimate_Form({toggleModel, user}){
    const [new_estimteData, setNew_estimteData] = useState({estimate_no: "", name: "", quantity: 0, item_no: "", created_by: "", created_at: "", created_by_id: null})
    const [error, setError] = useState({estimate_no: "", name: "", quantity: "", item_no: "", created_by: "", created_at: ""})
    const reference = useRef(null)
    const router = useRouter()

    function getCurrentTimeFormatted(){
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based in JavaScript
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ampm;
        
        const created_at =  month + "/" + day + "/" + year + " " + strTime;
        setNew_estimteData((prevNew_estimteData) => ({...prevNew_estimteData, ["created_at"]: created_at}))
    }
    
    useEffect(() => {
        getCurrentTimeFormatted()
        setNew_estimteData((prevNew_estimteData) => ({...prevNew_estimteData, ["created_by"]: user.username}))
        setNew_estimteData((prevNew_estimteData) => ({...prevNew_estimteData, ["created_by_id"]: user.id}))
    }, [])

    function handleChange(event){
        const {id, value} = event.target
        setNew_estimteData(prevNew_estimteData => {return {...prevNew_estimteData, [id]: value}})
    }

    function giveError(){
        Object.entries(new_estimteData).map(([key, value]) => {
            if(value === ""){
                setError((prevError) => {return {...prevError, [key]: `- ${key} is empty -`}})
            }
            else{
                setError((prevError) => {return {...prevError, [key]: ""}})
            }
        })
        if(new_estimteData.created_by_id === null || new_estimteData.created_by_id === undefined || new_estimteData.created_by_id === ""){
            setError((prevError) => {return {...prevError, ["created_by"]: "- error in loading user id -"}})
        }
    }
    
    function resetError(){
        Object.entries(error).map(([key, value]) => {
            setError((prevError) => {return {...prevError, [key]: ""}})
        })
    }

    async function handleSubmit(event){
        event.preventDefault()
        resetError()
        giveError()
        if(new_estimteData.estimate_no !== "" && new_estimteData.name !== "" && new_estimteData.quantity !== 0 && new_estimteData.item_no !== "" && new_estimteData.created_at !== "" && new_estimteData.created_by !== ""){
            try{
                console.log("new_estimteData: ", new_estimteData)
                const res = await axios.post(`/api/add_estimate_data`, {
                    new_estimteData: new_estimteData
                })
                if(res.status === 200){
                    console.log("res.data in add_estimate_data: ", res.data)
                    router.push(`/estimate/${res.data.id}`)
                }
            }
            catch(error){
                console.log("error in handleSubmit: ", error)
            }
        }
    }

    async function generatePDF(){
        const inputData = reference.current
        try{
            const canvas = await html2canvas(inputData)
            const imgData = canvas.toDataURL("image/png")

            const pdf = new jsPDF(
                {
                    orientation: "portrait",
                    unit: "px",
                    format: "a4"
                }
            )

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

            const output = pdf.output('arraybuffer');
            const res = await axios.post(`/api/savePDF`, output)
            console.log("res.data: ", res.data)

            // pdf.save("D:/VSCODEs/NEXTRON/Time_Estimation_Desktop_App/renderer/public/TestPDF.pdf")
        }
        catch(error){
            console.log("error in generatePDF: ", error)
        }
    }

    return(
        <div ref={reference} className="w-screen h-screen inset-0 fixed bg-black/70 text-[#E3E4E8] dark:text-[#17181C] flex flex-col rounded items-center justify-center">
            <form onSubmit={handleSubmit} className="w-3/6 h-5/6 rounded overflow-y-scroll overscroll-contain flex flex-col justify-center items-center font-poppins bg-[#26262D] dark:bg-[#F7F9FC]">
                <div className="w-full h-full px-7 pt-5 pb-7 flex flex-col rounded">
                    <div className="w-full flex flex-col space-y-2.5 mb-4">
                        <label htmlFor="estimate_no" className="text-xs">Estimate #</label>
                        <input onChange={handleChange} value={new_estimteData.estimate_no} type="number" min={0} id="estimate_no" className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col space-y-2.5 mb-4">
                        <label htmlFor="name" className="text-xs">Project Name</label>
                        <input onChange={handleChange} value={new_estimteData.name} type="text" id="name" className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col space-y-2.5 mb-4">
                        <label htmlFor="quantity" className="text-xs">Quantity</label>
                        <input onChange={handleChange} value={new_estimteData.quantity} type="number" min={0} id="quantity" className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col space-y-2.5 mb-4">
                        <label htmlFor="item_no" className="text-xs">Item #</label>
                        <input onChange={handleChange} value={new_estimteData.item_no} type="text" id="item_no" className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col space-y-2.5 mb-4">
                        <label htmlFor="created_by" className="text-xs">Created By</label>
                        <input onChange={handleChange} value={new_estimteData.created_by} type="text" id="created_by" className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col space-y-2.5 mb-7">
                        <label htmlFor="created_at" className="text-xs">Created At</label>
                        <input onChange={handleChange} value={new_estimteData.created_at} type="text" id="created_at" className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="mb-5 w-full">
                        {error.estimate_no !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.estimate_no}</p>}
                        {error.name !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.name}</p>}
                        {error.quantity !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.quantity}</p>}
                        {error.item_no !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.item_no}</p>}
                        {error.created_by !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.created_by}</p>}
                        {error.created_at !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.created_at}</p>}
                    </div>
                    <div className="w-full flex flex-row space-x-5 pb-7 justify-end">
                        <button onClick={toggleModel} type="button" className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]">Cancel</button>
                        <button type="submit" className="rounded-sm focus:outline-none hover:bg-[#2D44B7] dark:text-[#F9FAFF] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-8 py-3 text-lg">Create New Estimate</button>
                    </div>
                </div>
            </form>
        </div>
    )
}