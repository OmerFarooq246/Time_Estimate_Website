import { useState } from "react"
import axios from "axios";

export default function Add_User_Form({toggleModel, index, current_user, users, setUsers, edit, setEdit}){
    const [userData, setUserData] = useState(edit ? current_user : {username: "", password: "", level: "admin"})
    const levels = ["admin", "user", "read only"]
    const [error, setError] = useState({username: "", password: "", level: ""})

    function handleChange(event){
        const {id, value} = event.target
        setUserData(prevCategoryData => {return {...prevCategoryData, [id]: value}})
    }

    function giveError(){
        Object.entries(userData).map(([key, value]) => {
            if(value === ""){
                setError((prevError) => {return {...prevError, [key]: `- ${key} is empty -`}})
            }
            else{
                setError((prevError) => {return {...prevError, [key]: ""}})
            }
        })
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
        console.log("user data: ", userData)
        if(userData.username !== "" && userData.password !== "" && userData.level !== ""){
            try{
                console.log("user data: ", userData)
                let res;
                if(edit){
                    res = await axios.post(`/api/edit_user`, {userData: userData})
                    console.log("res.data in edit user: ", res.data)
                    let temp_users = [...users]
                    temp_users[index] = res.data
                    setUsers(temp_users)
                    setEdit(false)
                }
                else{
                    res = await axios.post(`/api/add_user`, {userData: userData})
                    console.log("res.data in add user: ", res.data)
                    setUsers([...users, res.data])
                }
                toggleModel()
            }
            catch(error){
                console.log("error in creating userData: ", error)
                if(error.response.data.code === "P2002"){
                    setError((prevError) => {return {...prevError, ["username"]: "- username already registered -"}})
                }
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
                    <label htmlFor="username" className="text-xs">Username</label>
                    <input disabled={edit} value={userData.username} onChange={handleChange} type="text" id="username" className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                </div>
                <div className="w-full flex flex-col space-y-2.5 mb-4">
                    <label htmlFor="password" className="text-xs">Password</label>
                    <input value={userData.password} onChange={handleChange} type="password" id="password" className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                </div>
                <div className="w-full flex flex-col space-y-2.5 mb-4">
                    <label htmlFor="level" className="text-xs">Level</label>
                    <select value={userData.level} id="level" onChange={handleChange} className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none">
                        {levels.map((level_i, index) => (
                            <option key={index} value={level_i}>{level_i}</option>
                        ))}
                    </select>
                </div>
                
                <div className="w-full flex flex-col space-y-1 mb-7">
                    {error.username !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.username}</p>}
                    {error.password !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.password}</p>}
                    {error.level !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.level}</p>}
                </div>
                <div className="w-full flex flex-row justify-end space-x-5">
                    <button onClick={cancelForm} type="button" className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]">Cancel</button>
                    <button type="submit" className="rounded-sm focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-8 py-3 text-lg">{edit ? "Edit" : "Add"} User</button>
                </div>
            </form>
        </div>
    )
}