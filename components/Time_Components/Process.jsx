import axios from "axios"
import { useState, useEffect } from "react"

// type User = {
//     username?: string;
//     level?: string;
// };

// type Process = {
//     id?: string,
//     name?: string;
//     time_per_unit?: number;
//     specs: [Spec],
//     img_source?: string
// };

// type Spec = {
//     id?: string,
//     description?: string,
//     options?: [string],
// };

export default function Process({process_id}){
    const [process_i, setProcesses] = useState({})

    async function get_process_info(){
        try{
            const res = await axios.get(`/api/get_process_info`, {
                params: {process_id: process_id}
            })
            let temp_process = res.data
            console.log("temp_process: ", temp_process)
            temp_process.specs.map((spec) => {
                spec.options = spec.options.split(",")
                spec.time_inc = spec.time_inc.split(",")
            })
            console.log("temp_process: ", temp_process)
            setProcesses(temp_process)
        }
        catch(error){
            console.log("error in get_process_info: ", error)
        }
    }

    useEffect(() => {
        get_process_info()
    }, [])

    return(
        <div className="flex flex-row space-x-3 font-poppins px-14 py-10">
            <div className="w-2/5 flex justify-center items-center px-6 py-9 bg-[#1D1D22] dark:bg-[#F0F2FF] rounded">
                {/* <img src="/images/process.jpg" width={300} alt="Process Image" className="rounded-sm"/> */}
                {process_i?.img_source !== ""
                ? <img src={process_i?.img_source} width={300} alt="Process Image" className="rounded-sm"/>
                : <img src="/images/placeholder.jpg" width={300} alt="Process Image" className="rounded-sm"/>}
            </div>
            <div className="w-3/5 bg-[#1D1D22] dark:bg-[#F0F2FF] flex flex-col space-y-3 px-6 py-5 rounded">
                <h1 className="font-semibold px-3 py-2 bg-[#26262D] dark:bg-[#F7F9FC] rounded w-fit">{process_i?.name}</h1>
                {/* <h1 className="text-xs font-medium">Time Per Unit: <span className="font-light">{process_i?.time_per_unit} mins</span></h1> */}
                <div className="flex flex-col space-y-5">
                    {process_i?.specs?.map((spec, index) => (
                        <div key={index} className="flex flex-col mt-5 space-y-2">
                            <h3 className="text-xs">{spec.description}</h3>
                            <div className="flex flex-row space-x-2">
                                {spec.options.map((option, index_2) => (
                                    <div key={index_2}>
                                        <p key={index_2} className="text-xs px-2 py-1 rounded bg-[#26262D] dark:bg-[#F7F9FC]">{option}</p>
                                        <p key={index_2} className="text-xs px-2 py-1 rounded bg-[#26262D] dark:bg-[#F7F9FC]">+ {spec.time_inc[index_2]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}