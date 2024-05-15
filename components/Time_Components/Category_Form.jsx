import { useState } from "react"
import axios from "axios";

export default function Category_Form({toggleModel, categories, setCategories, index, current_Cat, edit, setEdit}){
    const [categoryData, setCategoryData] = useState(edit ? current_Cat : {name: "", img_source: ""})
    const [file, setFile] = useState(null);
    const [error, setError] = useState({name: "", img_source: ""})

    function handleChange(event){
        const {id, value} = event.target
        setCategoryData(prevCategoryData => {return {...prevCategoryData, [id]: value}})
    }

    function handleFileChange(event){
        console.log("event.target.files: ", event.target.files)
        setFile(event.target.files[0]);
        setCategoryData({...categoryData, ["img_source"]: event.target.files[0].name})
    }

    function giveError(){
        Object.entries(categoryData).map(([key, value]) => {
            // if(key === "img_source" && value === ""){
            //     setError((prevError) => {return {...prevError, ["img_source"]: `- img not uploaded -`}})    
            // }
            if(key === "img_source" && value === ""){
                
            }
            else if(value === ""){
                setError((prevError) => {return {...prevError, [key]: `- ${key} is empty -`}})
            }
            else{
                setError((prevError) => {return {...prevError, [key]: ""}})
            }
        })
        // if(file === "" || file === null || file === undefined){
        //     setError((prevError) => {return {...prevError, ["img_source"]: `- img not uploaded -`}})
        // }
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
        // if(categoryData.name !== "" && categoryData.img_source !== "" && (file !== null || file !== "undefined") ){
        if(categoryData.name !== ""){
            try{
                console.log("file: ", file)
                if(edit){
                    const res = await axios.post(`/api/edit_category`, {categoryData: categoryData})
                    console.log("res.data in edit cat: ", res.data)
                    let temp_cats = [...categories]
                    temp_cats[index] = res.data
                    setCategories(temp_cats)
                    setEdit(false)
                }
                else{
                    const res = await fetch(`/api/add_category`, {
                        mode: "no-cors",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({categoryData: categoryData}) // Assuming categoryData is already in the correct format
                    });
                    // const resData = await res.json()
                    // console.log("res.data in add cat: ", resData)
                    const resData = {}
                    console.log("res in add cat: ", await res)
                    let temp_categories = categories
                    if(Array.isArray(resData)){
                        temp_categories = [...temp_categories, ...resData]    
                    }
                    else{
                        temp_categories = [...temp_categories, resData]
                    }
                    setCategories(temp_categories)   

                    // const res = await axios.post(`/api/add_category`, {categoryData: categoryData}, {headers: {"Content-Type": "application/json", 'Accept': 'application/json'}})
                    // console.log("res.data in add cat: ", res.data)
                    // let temp_categories = categories
                    // if(Array.isArray(res.data)){
                    //     temp_categories = [...temp_categories, ...res.data]    
                    // }
                    // else{
                    //     temp_categories = [...temp_categories, res.data]
                    // }
                    // setCategories(temp_categories)   
                }
                toggleModel()
            }
            catch(error){
                console.log("error in creating category: ", error)
                // if(error.response.data.code === "P2002"){
                //     setError((prevError) => {return {...prevError, ["name"]: "- Category already registered -"}})
                // }
            }
        }
    }

    function cancelForm(){
        setEdit(false)
        toggleModel()
    }

    return(
        <div className="w-screen h-screen inset-0 fixed bg-black/70 text-[#E3E4E8] flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="w-2/6 px-7 pt-5 pb-7 rounded flex flex-col justify-center items-center font-poppins bg-[#26262D]">
                <div className="w-full flex flex-col space-y-2.5 mb-4">
                    <label htmlFor="name" className="text-xs">Category Name</label>
                    <input value={categoryData.name} onChange={handleChange} type="text" id="name" className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                </div>
                {/* <div className="w-full flex flex-col space-y-2.5 mb-2">
                    <label htmlFor="img" className="text-xs">Image</label>
                    <input onChange={handleFileChange} type="file" id="img" name="img" accept=".jpg" className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                </div> */}
                <div className="w-full flex flex-col space-y-1 mb-7">
                    {error.name !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.name}</p>}
                    {error.img_source !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.img_source}</p>}
                </div>
                <div className="w-full flex flex-row justify-end space-x-5">
                    <button onClick={cancelForm} type="button" className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]">Cancel</button>
                    <button type="submit" className="rounded-sm focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-8 py-3 text-lg">{edit ? "Edit" : "Add"} Category</button>
                </div>
            </form>
        </div>
    )
}