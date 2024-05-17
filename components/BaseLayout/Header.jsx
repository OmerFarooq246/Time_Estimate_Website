import { Poppins } from "next/font/google"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link"
import axios from "axios";
import { useSession } from "next-auth/react";

const poppins = Poppins({subsets: ['latin'], variable: "--font-poppins", weight: ['100', '200', '300','400','500', '600', '700', '800', '900']})

export default function Header({ heading }) {
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
        <div className="bg-[#161616]">
            <header className="flex flex-row bg-[#1D1D22] text-[#E3E4E8] justify-center py-2 px-1">
                <div className="w-2/12">
                    <img src="/images/logo.png" alt="logo" className="h-10"/>
                </div>
                <div className={`w-8/12 ${poppins.className} uppercase text-2xl flex justify-center items-center`}>
                    <h1 className="font-bold">{heading}</h1>
                </div>
                <div className={`w-2/12 flex flex-row justify-end items-center pr-2 ${poppins.className}`}>
                    {(router.pathname === "/" && router.pathname !== "/login") && <button className="uppercase font-bold text-sm" onClick={() => signOut({ callbackUrl: '/login' })}>Log Off</button>}
                    {(router.pathname !== "/" && router.pathname !== "/login" && !router.pathname.includes("/estimate")) && <Link className="uppercase font-bold text-sm" href="/">Home</Link>}
                </div>
            </header>
            <div className="flex flex-row justify-between px-3 py-3 bg-[#161616] text-[#E3E4E8] mb-2">
                {router.pathname !== "/" && router.pathname !== "/login" && 
                <div className="flex w-full flex-row items-center space-x-1">
                    <IoArrowBack className="h-4"/>
                    <button onClick={() => router.back()} className={`${poppins.className} text-xs`}>Back</button>
                </div>}
                {router.pathname === "/" && session.data?.user?.level === "admin" &&
                    <Link href="/admin" className={`text-xs font-semibold w-full ${poppins.className}`}>Admin Panel</Link>
                }
                <h1 className={`text-xs text-end w-full ${poppins.className}`}>{router.pathname}</h1>
            </div>
        </div>
    )
}
