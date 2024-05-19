import { useState } from "react"
import axios from "axios";

export default function Sub_Category_Form({toggleModel, category, sub_categories, setSub_Categories, index, current_sub_cat, edit, setEdit}){
    const [sub_categoryData, setSub_CategoryData] = useState(edit ? current_sub_cat : {name: "", img_source: ""})
    const [file, setFile] = useState(null);
    const [error, setError] = useState({name: "", img_source: ""})

    function handleChange(event){
        const {id, value} = event.target
        setSub_CategoryData(prevSub_CategoryData => {return {...prevSub_CategoryData, [id]: value}})
    }

    function handleFileChange(event){
        console.log("event.target.files: ", event.target.files)
        setFile(event.target.files[0]);
        setSub_CategoryData({...sub_categoryData, ["img_source"]: event.target.files[0].name})
    }

    function giveError(){
        Object.entries(sub_categoryData).map(([key, value]) => {
            if(key === "img_source" && value === "" && !edit){
                setError((prevError) => {return {...prevError, ["img_source"]: `- img not uploaded -`}})    
            }
            else if(value === ""){
                setError((prevError) => {return {...prevError, [key]: `- ${key} is empty -`}})
            }
            else{
                setError((prevError) => {return {...prevError, [key]: ""}})
            }
        })
        if((file === "" || file === null || file === undefined) && !edit){
            setError((prevError) => {return {...prevError, ["img_source"]: `- img not uploaded -`}})
        }
    }

    function resetError(){
        Object.entries(error).map(([key, value]) => {
            setError((prevError) => {return {...prevError, [key]: ""}})
        })
    }

    async function handleFileUpload() {
        console.log("inside fileUpload");
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(`/api/img_upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            });
            console.log("res.data in handlefile uplaod: ", res.data);
            return res.data.secure_url;
        } 
        catch (error) {
          console.log("error in hadnleFileUpload");
        }
    }

    async function handleSubmit(event){
        event.preventDefault()
        resetError()
        giveError()
        if(sub_categoryData.name !== "" && sub_categoryData.img_source !== "" && (file !== null || file !== "undefined") ){
        // if(sub_categoryData.name !== ""){
            try{
                console.log("file: ", file)
                if(edit){
                    let temp_sub_categoryData = {...sub_categoryData};
                    if (file) {
                        const secure_url = await handleFileUpload();                            
                        temp_sub_categoryData.img_source = secure_url;
                    }

                    const res = await axios.post(`/api/edit_sub_category`, {sub_categoryData: temp_sub_categoryData})
                    console.log("res.data in edit sub_cat: ", res.data)
                    let temp_sub_cats = [...sub_categories]
                    temp_sub_cats[index] = res.data
                    setSub_Categories(temp_sub_cats)
                    setEdit(false)
                }
                else{
                    const secure_url = await handleFileUpload();
                    let temp_sub_categoryData = {...categoryData};
                    temp_sub_categoryData.img_source = secure_url;

                    const res = await axios.post(`/api/add_sub_category`, {sub_categoryData: {...temp_sub_categoryData, category}})
                    console.log("res.data: ", res.data)
                    let temp_sub_categories = sub_categories
                    if(Array.isArray(res.data)){
                        temp_sub_categories = [...temp_sub_categories, ...res.data]    
                    }
                    else{
                        temp_sub_categories = [...temp_sub_categories, res.data]
                    }
                    setSub_Categories(temp_sub_categories)   
                }
                toggleModel()
            }
            catch(error){
                console.log("error in creating sub_category: ", error)
                // if(error.response.data.code === "P2002"){
                //     setError((prevError) => {return {...prevError, ["name"]: "- Sub_Category already registered -"}})
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
                    <label htmlFor="name" className="text-xs">Sub Category Name</label>
                    <input value={sub_categoryData.name} onChange={handleChange} type="text" id="name" className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                </div>
                <div className="w-full flex flex-col space-y-2.5 mb-2">
                    <label htmlFor="img" className="text-xs">Image</label>
                    {edit && !file && <h1 className="text-xs font-light">{sub_categoryData.img_source}</h1>}
                    <input onChange={handleFileChange} type="file" id="img" name="img" accept=".jpg" className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                </div>
                <div className="w-full flex flex-col space-y-1 mb-7">
                    {error.name !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.name}</p>}
                    {error.img_source !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.img_source}</p>}
                </div>
                <div className="w-full flex flex-row space-x-5 justify-end">
                    <button onClick={cancelForm} type="button" className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]">Cancel</button>
                    <button type="submit" className="rounded-sm focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-8 py-3 text-lg">{edit ? "Edit" : "Add"} Sub Category</button>
                </div>
            </form>
        </div>
    )
}