import { useEffect, useState } from "react"
import axios from "axios";

export default function Set_Time_Form({toggleModel, process}){
    const [combinations, setCombinations] = useState([])
    const [times, setTimes] = useState([])

    function make_pairs(specs, pair, combinations, index){
        if(specs.length === 0){
            console.log("specs.lenght == 0")
            return
        }
        if(pair.length === specs.length){
            console.log("in termination condition")
            combinations.push(pair)
        }
        else{
            for(let i = 0; i < specs[index].options.length; i++){
                let pair_up = [...pair, specs[index].options[i]]
                // console.log("pair_up: ", pair_up)
                make_pairs(specs, pair_up, combinations, index + 1)
            }
        }
    }

    function make_options_data(){
        let combinations = []
        make_pairs(process.specs, [], combinations, 0)
        console.log("combinations: ", combinations)
        setCombinations(combinations)
        let temp_times = new Array(combinations.length).fill(0)
        setTimes(temp_times)
    }

    useEffect(() => {
        make_options_data()
    }, [])

    function handleChange(event){
        console.log("event.target.value: ", event.target.value)
        console.log("event.target.id: ", event.target.id)
        let temp_times = [...times]
        temp_times[event.target.id] = event.target.value
        setTimes(temp_times)
    }

    async function handleSubmit(event){
        event.preventDefault()
        let check = false
        if(times.length === combinations.length){
            for(let i = 0; i < times.length; i++){
                if(times[i] >= 0){
                    check = false
                }
                else{
                    check = true
                }
            }
            if(!check){
                try{
                    const res = await axios.post("/api/set_time", {combinations: combinations, times: times, process: process.id})
                    console.log("res.data in set time: ", res.data)
                }
                catch(error){
                    console.log("error in time_pairs: ", error)
                }
            }
        }
    }

    function cancelForm(){
        toggleModel()
    }

    return(
        <div className="w-screen h-screen inset-0 fixed bg-black/70 text-[#E3E4E8] dark:text-[#17181C] flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="w-3/6 h-5/6 overflow-y-scroll overscroll-contain scrollbar scrollbar-thumb-[#26262D] scrollbar-track-[#1D1D22] dark:scrollbar-thumb-[#F0F2FF] scrollbar-track-[#F7F9FC] rounded flex flex-col justify-center items-center font-poppins bg-[#26262D] dark:bg-[#F7F9FC]">
                <div className="w-full h-full pr-5 pl-9 py-7 flex flex-col space-y-7">
                    <table className="text-sm">
                        <thead>
                            <tr>
                                {process?.specs.map((spec, index) => (
                                    <th key={index} className="text-start px-3 py-2 px-2 border border-[#31313A] dark:border-[#E0E6FF] font-semibold">{spec.description}</th>
                                ))}
                                <th className="text-start px-3 py-2 px-2 border border-[#31313A] dark:border-[#E0E6FF] font-semibold">Time</th>                             
                            </tr>
                        </thead>
                        <tbody className="font-light">
                            {combinations.map((pair, index) => (
                                <tr key={index}>
                                    {pair.map((val, index_2) => (
                                        <td key={index_2} className="px-3 py-1 border border-[#31313A] dark:border-[#E0E6FF]">{val}</td>
                                    ))}
                                    <td className="px-1 py-1 border border-[#31313A] dark:border-[#E0E6FF]">
                                        <input id={index} value={times[index]} onChange={handleChange} type="number" step="0.1" min={0} className="bg-[#26262D] dark:bg-[#F0F2FF] py-1 px-2 rounded-sm focus:outline-none w-full"/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="w-full flex flex-row space-x-5 justify-end pb-7">
                        <button onClick={cancelForm} type="button" className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]">Cancel</button>
                        <button type="submit" className="rounded-sm focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] dark:text-[#F9FAFF] text-xs px-8 py-3 text-lg">Update Time</button>
                    </div>
                </div>
            </form>
        </div>
    )
}