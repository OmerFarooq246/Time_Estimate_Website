import { Poppins } from "next/font/google"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link"
import axios from "axios";
import { useSession } from "next-auth/react";

const poppins = Poppins({subsets: ['latin'], variable: "--font-poppins", weight: ['100', '200', '300','400','500', '600', '700', '800', '900']})

export default function Header({ heading, toggleMode, darkmode}) {
    const router = useRouter()
    const session = useSession()


    // const handleSignOut = async () => {
    //     try{
    //         const res = await axios.get("/api/logout_force")
    //         console.log("res.data in logout: ", res.data)
    //         if(res.status === 200){
    //             console.log("logout successful")
    //             router.push('/login')    
    //         }
    //     }
    //     catch(error){
    //         console.log("error in logout: ", error)
    //     }
    // }

    return (
        <div className="bg-[#161616] dark:bg-[#FFFFFF]">
            <header className="flex flex-row bg-[#1D1D22] text-[#E3E4E8] dark:bg-[#F7F9FC] dark:text-[#17181C] justify-center py-2 px-1">
                <div className="w-4/12">
                    {heading !== "New Time Estimate" && <img src="/images/logo.png" alt="logo" className="h-10"/>}
                </div>
                <div className={`w-6/12 ${poppins.className} uppercase text-2xl flex justify-center items-center`}>
                    {heading === "New Time Estimate"
                    ? <img src="/images/logo.png" alt="logo" className="h-10"/>
                    : <h1 className="font-bold">{heading}</h1>}
                </div>
                <div className={`w-4/12 flex flex-row space-x-3 justify-end items-center pr-2 ${poppins.className}`}>
                    {heading === "New Time Estimate" && <h1 className="font-bold">{heading}</h1>}
                    {(router.pathname === "/" && router.pathname !== "/login") && <button className="uppercase font-bold text-sm" onClick={() => signOut({ callbackUrl: '/login' })}>Log Off</button>}
                    {(router.pathname !== "/" && router.pathname !== "/login" && !router.pathname.includes("/estimate")) && <Link className="uppercase font-bold text-sm" href="/">Home</Link>}
                    <button className='text-xs font-base' onClick={toggleMode}>{darkmode === "true" ? "Dark Mode" : "Light Mode"}</button>
                </div>
            </header>
            <div className="flex flex-row justify-between px-3 py-3 bg-[#161616] text-[#E3E4E8] dark:bg-[#FFFFFF] dark:text-[#17181C] mb-2">
                {router.pathname !== "/" && router.pathname !== "/login" && 
                <div className="w-full">
                    <button onClick={() => router.back()} className={`${poppins.className} text-xs flex flex-row items-center space-x-1`}>
                        <IoArrowBack className="h-4"/>
                        <p>Back</p>
                    </button>
                </div>}
                {router.pathname === "/" && session.data?.user?.level === "admin" &&
                    <Link href="/admin" className={`text-xs font-semibold w-full ${poppins.className}`}>Admin Panel</Link>
                }
                <h1 className={`text-xs text-end w-full ${poppins.className}`}>{router.pathname}</h1>
            </div>
        </div>
    )
}
