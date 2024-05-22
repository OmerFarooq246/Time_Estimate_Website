import { useEffect, useState } from "react"
import Add_Process_Form from "./AddProcessForm"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export default function Category_Link({index, categories_Link, setCategories_Link, handleSetUpChange, handleMiscChange}){
    const [active, setActive] = useState(false) //if true, model shown
    const [current_process, setCurrent_process] = useState({})
    const [index_process, setIndex_process] = useState(null)
    const [edit, setEdit] = useState(false)
    
    function toggleModel(){
        setActive(!active)
    }

    async function deleteProcess(index_p){
            let temp_cat_links = [...categories_Link]
            temp_cat_links[index].processes.splice(index_p, 1)
            console.log("temp_cat_links: ", temp_cat_links)
            setCategories_Link(temp_cat_links)

        // if(!categories_Link[index].processes[index_p].id){
        //     let temp_cat_links = [...categories_Link]
        //     temp_cat_links[index].processes.splice(index_p, 1)
        //     console.log("temp_cat_links: ", temp_cat_links)
        //     setCategories_Link(temp_cat_links)
        // }
        // else{
        //     try{
        //         const res = await axios.post(`/api/delete_process_of_link`, {
        //             process_link_id: categories_Link[index].processes[index_p].id
        //         })
        //         console.log("res.data in del process_link: ", res.data)
        //         let temp_cats = [...categories_Link]
        //         temp_cats[index].processes.splice(index_p, 1)
        //         setCategories_Link(temp_cats)
        //     }
        //     catch(error){
        //         console.log("error in delete process_link: ", error)
        //     }
        // }
    }

    function editProcess(index_p){
        setIndex_process(index_p)
        setCurrent_process(categories_Link[index].processes[index_p])
        setEdit(true)
        toggleModel()
    }

    return(
        <div className="w-full flex flex-col space-y-2 text-sm">
            {active && <Add_Process_Form toggleModel={toggleModel} index={index} categories_Link={categories_Link} setCategories_Link={setCategories_Link} edit={edit} setEdit={setEdit} index_process={index_process} current_process={current_process}/>}
            <h1 className="font-bold">{categories_Link[index].category.name}</h1>
            <table className="text-xs bg-[#1D1D22] rounded">
                <tr>
                    <th className="px-3 py-2 px-2 border border-[#31313A] font-semibold w-7/12 text-start">Process</th>
                    <th className="px-3 py-2 px-2 border border-[#31313A] font-semibold w-2/12 text-center">Time (mins)</th>
                    <th className="px-3 py-2 px-2 border border-[#31313A] font-semibold w-1/12">Qty</th>
                    <th className="px-3 py-2 px-2 border border-[#31313A] font-semibold w-1/12">Edit</th>
                    <th className="px-3 py-2 px-2 border border-[#31313A] font-semibold w-1/12">Delete</th>
                </tr>
                {categories_Link[index].processes.map((process, index) => (
                    <tr key={index} className="">
                        <td className="px-3 py-1 border border-[#31313A]">{process.process.name} {process.specs_info.map(spec => (" - " + spec.option))}</td>
                        <td className="px-3 py-1 border border-[#31313A] text-center">{process.quantity * process.specs_info.map((spec) => (spec.time)).reduce((a, b) => a + b, 0)}</td>
                        <td className="px-3 py-1 border border-[#31313A] text-center">{process.quantity}</td>
                        <td className="px-3 py-1 border border-[#31313A] text-center"><button onClick={() => editProcess(index)}><MdEdit className="hover:text-[#3E5EFF]"/></button></td>
                        <td className="px-3 py-1 border border-[#31313A] text-center"><button onClick={() => deleteProcess(index)}><MdDelete className="text-red-600"/></button></td>
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
                        <td><p className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">{categories_Link[index].processes.map((process) => (parseInt(process.quantity) * (process.specs_info.map((spec) => (spec.time)).reduce((a, b) => a + b, 0)))).reduce((a, b) => a + b, 0) + parseInt(categories_Link[index].time_info.setup) + parseInt(categories_Link[index].time_info.misc)}</p></td>
                        {/* <td><p className="w-16 px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">hello</p></td> */}
                    </tr>
                </table>
            </div>
        </div>
    )
}