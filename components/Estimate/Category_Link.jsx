import { useEffect, useState } from "react"
import Add_Process_Form from "./AddProcessForm"

export default function Category_Link({index, categories_Link, setCategories_Link, handleSetUpChange, handleMiscChange}){
    const [active, setActive] = useState(false) //if true, model shown
    
    function toggleModel(){
        setActive(!active)
    }

    return(
        <div className="w-full flex flex-col space-y-2 text-sm">
            {active && <Add_Process_Form toggleModel={toggleModel} index={index} categories_Link={categories_Link} setCategories_Link={setCategories_Link}/>}
            <h1 className="font-bold">{categories_Link[index].category.name}</h1>
            <table className="text-xs bg-[#1D1D22] rounded">
                <tr>
                    <th className="px-3 py-2 px-2 font-semibold w-4/6 text-start">Process</th>
                    <th className="px-3 py-2 px-2 font-semibold w-1/6">Qty</th>
                    <th className="px-3 py-2 px-2 font-semibold w-1/6 text-end">Time (mins)</th>
                </tr>
                {categories_Link[index].processes.map((process, index) => (
                    <tr key={index} className="">
                        <td className="px-3 py-1 border border-[#26262D]">{process.process.name} {process.specs_info.map(spec => (" - " + spec.option))}</td>
                        <td className="px-3 py-1 border border-[#26262D] text-center">{process.quantity}</td>
                        <td className="px-3 py-1 border border-[#26262D] text-center">{process.quantity * process.process.time_per_unit}</td>
                    </tr>
                ))}
            </table>
            <button onClick={toggleModel} className="w-fit text-xs rounded-sm focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs mx-1 px-3 py-1.5">Add Process</button>
            <div className="flex flex-col w-fit self-end">
                <table className="text-xs border-separate border-spacing-x-2">
                    <tr className="">
                        <td>Manufacturing Set Up Time/QTY: </td>
                        <td><input id={index} value={categories_Link[index].time_info.setup} onChange={handleSetUpChange} type="number" min={0} className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none"/></td>
                    </tr>
                    <tr className="">
                        <td>Manufacturing Misc. Time/EA: </td>
                        <td><input id={index} value={categories_Link[index].time_info.misc} onChange={handleMiscChange} type="number" min={0} className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none"/></td>
                    </tr>
                    <tr className="">
                        <td>Total Manufacturing Time/EA: </td>
                        <td><p className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">{categories_Link[index].processes.map((process) => (parseInt(process.quantity) * parseInt(process.process.time_per_unit))).reduce((a, b) => a + b, 0) + parseInt(categories_Link[index].time_info.setup) + parseInt(categories_Link[index].time_info.misc)}</p></td>
                        {/* <td><p className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">hello</p></td> */}
                    </tr>
                </table>
            </div>
        </div>
    )
}