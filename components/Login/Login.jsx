import { LuUser2 } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { useState } from "react";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Login(){
    const [loginData, setLoginData] = useState({username: "", password: ""})
    const [error, setError] = useState({username: "", password: "", credentials: ""})
    const router = useRouter()

    function handleChange(event){
        const {id, value} = event.target
        setLoginData(prevLoginData => {return {...prevLoginData, [id]: value}})
    }

    function giveError(){
        Object.entries(loginData).map(([key, value]) => {
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
        if(loginData.username !== "" && loginData.password !== ""){
            // try{
            //     const res = await fetch(`/api/login_force`, {
            //         mode: "no-cors",
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Accept': 'application/json'
            //         },
            //         body: JSON.stringify(loginData)
            //     });
            //     const resData = await res.json()
            //     console.log("resData in login: ", resData)

            //     // const res = await axios.post("/api/login_force", {
            //     //     loginData
            //     // })
            //     // console.log("res.data in login: ", res.data)
            //     if(res.status === 401){
            //         setError((prevError) => {return {...prevError, ["credentials"]: "- credentials are incorrect -"}})
            //     }
            //     else if(res.status === 200){
            //         setError((prevError) => {return {...prevError, ["credentials"]: ""}})
            //         router.push("/home")
            //     }
            // }
            // catch(error){
            //     console.log("error in login: ", error)
            // }
            
            try{
                const res = await signIn('credentials', {...loginData, redirect: false})
                console.log("res in login: ", res)
                if(res.status === 401){
                    setError((prevError) => {return {...prevError, ["credentials"]: "- credentials are incorrect -"}})
                }
                else if(res.status === 200){
                    setError((prevError) => {return {...prevError, ["credentials"]: ""}})
                    router.push("/")
                    // router.push("/login")
                }
            }
            catch(error){
                console.log("error in login: ", error)
                // console.log(error)
            }
        }
    }

    return(
        <div className="h-full flex flex-col items-center">
            <div className="h-1/6"></div>
            <div className="flex items-center justify-center h-4/6 w-5/12 ">
                <form onSubmit={handleSubmit} className="flex flex-col py-5 px-6 w-full rounded items-center font-poppins bg-[#26262D]">
                    <div className="w-full flex mb-5 flex-col space-y-2.5 justify-center">
                        {/* <div className="border-2 border-gray-900 rounded-md p-1">
                            <LuUser2 className="h-8 w-8"/>
                        </div> */}
                        <label htmlFor="username" className="text-xs">Username</label>
                        <input type="text" id="username" value={loginData.username} onChange={handleChange} className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="w-full flex mb-2 flex-col space-y-2.5 justify-center">
                        {/* <div className="border-2 border-gray-900 rounded-md p-1">
                            <RiLockPasswordLine className="h-8 w-8"/>
                        </div> */}
                        <label htmlFor="password" className="text-xs">Password</label>
                        <input type="password" id="password" value={loginData.password} onChange={handleChange} className="px-3 py-2 bg-[#31313A] text-sm rounded-sm focus:outline-none"/>
                    </div>
                    <div className="mb-5 w-full">
                        {error.username !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.username}</p>}
                        {error.password !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.password}</p>}
                        {error.credentials !== "" && <p className="text-xs text-orange-700 mt-0.5">{error.credentials}</p>}
                    </div>
                    <div className="flex flex-row justify-end w-full">
                        <button type="submit" className="focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-8 py-3 text-lg rounded-sm">Login</button>
                    </div>
                    {/* <Link href="/home">Home</Link> */}
                </form>
            </div>
            <div className="h-1/6"></div>
        </div>
    )
}