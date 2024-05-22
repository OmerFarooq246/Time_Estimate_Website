import { useEffect, useState } from "react"
import axios from "axios";

export default function Add_Process_Form({toggleModel, index, categories_Link, setCategories_Link, edit, setEdit, index_process, current_process}){
    const [processes, setProcesses] = useState([])
    const [selected_Process, setSelected_Process] = useState(null)
    const [specs_info, setSpec_info] = useState([])
    const [quantity, setQuantity] = useState(edit ? current_process.quantity : 1)
    // const [time_per_unit, setTime_per_unit] = useState(0)
    const [error, setError] = useState({quantity: ""})

    async function get_all_processes(){
        try{
            const res = await axios.get(`/api/get_all_processes`, {
                params: {
                    category: categories_Link[index].category.id
                }
            })
            let temp_process = res.data
            temp_process.map((process) => {
                process.specs.map((spec) => {
                    spec.options = spec.options.split(",")
                    spec.time_inc = spec.time_inc.split(",")
                })
            })
            setProcesses(temp_process)
        }
        catch(error){
            console.log("error in get_all_processes: ", error)
        }
    }

    useEffect(() => {
        get_all_processes()
    }, [])

    useEffect(() => {
        if(processes.length !== 0 && processes !== null && processes !== undefined){
            if(edit){
                setSelected_Process(current_process.process)
            }
            else{
                setSelected_Process(processes[0])
            }
            console.log("processes[0]: ", processes[0])
        }
    }, [processes])

    function set_specs_info(){
        if(edit){
            setSpec_info(current_process.specs_info)
        }
        else{
            // let temp_time_per_unit = 0
            let temp_specs_info = selected_Process?.specs?.map((spec) => {
                // temp_time_per_unit = temp_time_per_unit + parseFloat(spec.time_inc[0])
                return {id: spec.id, option: spec.options[0], time: parseFloat(spec.time_inc[0])}
            })
            // console.log("temp_time_per_unit: ", temp_time_per_unit)
            // setTime_per_unit(temp_time_per_unit)
            setSpec_info(temp_specs_info)
        }
    }

    useEffect(() => {
        set_specs_info()
    }, [selected_Process])

    function handleProcessSelectChange(event){
        console.log("event.target: ", event.target)
        setSelected_Process(processes.find(process => process.id === event.target.value))
    }

    function handleSpecOptionSelectChange(event){
        console.log(event.target.id)
        let temp_specs_info = [...specs_info]
        console.log("temp_specs_info before: ", temp_specs_info)
        temp_specs_info.map((spec, index) => {
            if(spec.id === event.target.id){
                console.log("in setting")
                temp_specs_info[index].option = event.target.value
                let index_2 = selected_Process.specs[index].options.indexOf(event.target.value)
                temp_specs_info[index].time = parseFloat(selected_Process.specs[index].time_inc[index_2])
                // console.log("selected_Process.specs[index].time_inc[index_2]: ", selected_Process.specs[index].time_inc[index_2])
            }
        })
        console.log("temp_specs_info after: ", temp_specs_info)

        setSpec_info(temp_specs_info)
    }

    // useEffect(() => {
    //     console.log("specs_info: ", specs_info)
    //     if(specs_info && selected_Process){
    //         let time_per_unit = 0
    //         specs_info.map((spec) => {
    //             console.log(spec.time)
    //             time_per_unit = time_per_unit + spec.time
    //         })
    //         console.log("time_per_unit: ", time_per_unit)
    //         let temp_process = {...selected_Process}
    //         temp_process.time_per_unit = time_per_unit
    //         setSelected_Process(temp_process)
    //     }
    // }, [specs_info])


    function handleQuantityChange(event){
        setQuantity(parseInt(event.target.value))
    }

    useEffect(() => {
        console.log("selected_Process: ", selected_Process)
    }, [selected_Process])

    function handleSubmit(event){
        event.preventDefault()

        if(quantity === 0){
            setError((prevError) => {return {...prevError, "quantity": "- quantity can't be zero -"}})
        }
        else{
            setError((prevError) => {return {...prevError, "quantity": ""}})
            if(edit){
                let temp_categories_link = categories_Link
                temp_categories_link[index].processes[index_process].quantity = quantity
                console.log("temp_categories_link: ", temp_categories_link)
                setCategories_Link(temp_categories_link)
                setEdit(false)
                toggleModel()
            }
            else{
                try{
                    let process = {process: selected_Process, specs_info: specs_info, quantity: quantity}
                    console.log("final process: ", process)
                    let temp_cat_links = [...categories_Link]
                    temp_cat_links[index].processes = [...temp_cat_links[index].processes, process]
                    // temp_cat_links[index].time_info.total = temp_cat_links[index].processes.map((process) => (parseInt(process.quantity) * parseInt(process.process.time_per_unit))).reduce((a, b) => a + b, 0) + parseInt(temp_cat_links[index].time_info.setup) + parseInt(temp_cat_links[index].time_info.misc)
                    
                    temp_cat_links[index].time_info.total = temp_cat_links[index].processes.map((process) => (
                        parseInt(process.quantity) * (process.specs_info.map((spec) => (spec.time)).reduce((a, b) => a + b, 0))
                    ))
                    .reduce((a, b) => a + b, 0) + parseInt(temp_cat_links[index].time_info.setup) + parseInt(temp_cat_links[index].time_info.misc)
                    
                    console.log("total: ", temp_cat_links[index].time_info.total)
                    setCategories_Link(temp_cat_links)
                    toggleModel()
                }
                catch(error){
                    console.log("error in handle sbmit: ", error)
                }
            }
        }
    }
    
    function cancelForm(){
        setEdit(false)
        toggleModel()
    }

    return(
        <div className="w-screen h-screen overflow-y-scroll scrollbar scrollbar-thumb-[#26262D] scrollbar-track-[#1D1D22] inset-0 fixed bg-black/70 text-[#E3E4E8] flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="w-7/12 px-7 pt-5 pb-7 rounded flex flex-col justify-center items-center font-poppins bg-[#26262D]">
                <h1 className="text-sm font-bold">{categories_Link[index].name}</h1>
                <div className="w-full flex flex-col space-y-2.5 mb-4">
                    <label htmlFor="processes" className="text-xs">Select Process</label>
                    <select disabled={edit} id="processes" value={selected_Process?.id} onChange={handleProcessSelectChange} className="px-2 py-1 bg-[#31313A] text-xs rounded-sm focus:outline-none">
                        {processes.map((process, index) => (
                            <option key={index} value={process.id}>[{process.owner_sub_category.name}] - {process.name}</option>
                        ))}
                    </select>
                </div>

                {selected_Process !== null && selected_Process !== undefined && 
                <div className="w-full flex flex-row space-x-3 font-poppins mb-3">
                    <div className="w-2/5 flex justify-center items-center px-6 py-9 bg-[#1D1D22] rounded">
                        <img src={selected_Process?.img_source} width={300} alt="Process Image" className="rounded-sm"/>
                    </div>
                    <div className="w-3/5 bg-[#1D1D22] flex flex-col space-y-3 px-6 py-5 rounded">
                        <h1 className="font-semibold px-3 py-2 bg-[#26262D] rounded w-fit">{selected_Process?.name}</h1>
                        <h1 className="text-xs font-medium">Time Per Unit: <span className="font-light">{specs_info?.map((spec) => (spec.time)).reduce((a, b) => a + b, 0)} mins</span></h1>
                        <div className="flex flex-col space-y-5">
                            {selected_Process?.specs?.map((spec, index) => (
                                <div key={index} className="flex flex-col mt-5 space-y-2">
                                    <h3 className="text-xs">{spec.description}</h3>
                                    {specs_info && 
                                    <select disabled={edit} id={spec.id} onChange={handleSpecOptionSelectChange} value={specs_info[index]?.option} className="px-2 py-1 bg-[#26262D] text-xs rounded-sm focus:outline-none">
                                        {spec.options.map((option, index_2) => (
                                            <option key={index_2} value={option}>{option} <span className="font-light">+ ({spec.time_inc[index_2]} mins)</span></option>
                                        ))}
                                    </select>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}

                <div className="flex flex-row self-end items-center space-x-3 mb-3">
                    <label htmlFor="quantity" className="text-xs">Quantity:</label>
                    <input value={quantity} onChange={handleQuantityChange} id="quantity" type="number" min={0} className="w-16 px-3 py-2 bg-[#31313A] text-xs rounded-sm focus:outline-none"/>
                </div>
                
                <div className="w-full flex flex-col space-y-1 mb-3">
                    {error.quantity !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.quantity}</p>}
                </div>

                <div className="w-full flex flex-row justify-end space-x-5">
                    <button onClick={cancelForm} type="button" className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]">Cancel</button>
                    <button type="submit" className="rounded-sm focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-5 py-3 text-lg">{edit ? "Edit" : "Add"} Process</button>
                </div>
            </form>
        </div>
    )
}