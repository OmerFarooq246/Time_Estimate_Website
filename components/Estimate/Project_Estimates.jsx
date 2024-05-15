import axios from "axios"
import { useEffect, useState } from "react"

export default function Project_Estimates(){
    const [estimates, setEstimates] = useState([])
    const [estimate_nos, setEstimate_nos] = useState([])

    async function get_estimates(){
        try{
            // console.log("process.env.NEXT_PUBLIC_BASE_URL: ", process.env.NEXT_PUBLIC_BASE_URL)
            const res = await axios.get(`/api/get_estimates`)
            console.log("res.data in get_estimates: ", res.data)
            setEstimates(res.data)
            let uniqueEstimateNos = [...new Set(res.data.map(estiamte => estiamte.estimate_no))];
            setEstimate_nos(uniqueEstimateNos)
        }
        catch(error){
            console.log("error in get_estimates: ", error)
        }
    }

    useEffect(() => {
        get_estimates()
    }, [])

    function format_date(date_input){
        let date = new Date(date_input)

        let day = date.getDate(); // Get the day
        let month = date.getMonth() + 1; // Get the month (getMonth() returns month from 0-11)
        let year = date.getFullYear(); // Get the year
        let time = date.toLocaleTimeString(); // Get the time

        let formattedDate = `${day}/${month}/${year} ${time}`;
        return formattedDate
    }

    return(
        <div className="flex flex-col px-16 py-5 font-poppins">
            <table className="text-sm">
                <thead>
                    <tr>
                        <th className="w-1/6 bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#31313A]">Estimate #</th>
                        <th className="w-1/6 bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#31313A]">Project Name</th>
                        <th className="w-1/6 bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#31313A]">Qunatity</th>
                        <th className="w-1/6 bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#31313A]">Total Time per Unit</th>
                        <th className="w-1/6 bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#31313A]">Created by</th>
                        <th className="w-1/6 bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#31313A]">Created At</th>
                    </tr>
                </thead>
            </table>
                
                    {estimate_nos?.map((estimate_no, index) => (
                        <table key={index} className="my-5 text-sm">
                            {/* <tr className={index !== 0 && "hidden"}>
                                <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Estimate #</th>
                                <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Project Name</th>
                                <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Qunatity</th>
                                <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Total Time per Unit</th>
                                <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Created by</th>
                                <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Created At</th>
                            </tr> */}
                            {estimates?.filter((estiamte) => (
                                estiamte.estimate_no === estimate_no
                            )).map((estimate, index_2) => (
                                
                                    <tr key={index_2}>
                                        <td className="w-1/6 text-center font-light px-2 py-1.5 border border-[#31313A]">{estimate.estimate_no}</td>
                                        <td className="w-1/6 text-center font-light px-2 py-1.5 border border-[#31313A]">{estimate.name}</td>
                                        <td className="w-1/6 text-center font-light px-2 py-1.5 border border-[#31313A]">{estimate.quantity}</td>
                                        <td className="w-1/6 text-center font-light px-2 py-1.5 border border-[#31313A]">{estimate.Estimate_Link[0]?.time_per_unit}</td>
                                        <td className="w-1/6 text-center font-light px-2 py-1.5 border border-[#31313A]">{estimate.creating_user.username}</td>
                                        <td className="w-1/6 text-center font-light px-2 py-1.5 border border-[#31313A]">{format_date(estimate.created_at)}</td>
                                    </tr>
                            ))}
                        </table>
                    ))}
            
        </div>
    )
}