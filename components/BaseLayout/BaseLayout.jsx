import Head from 'next/head'
import Header from './Header'
import { Poppins } from "next/font/google"
import { useEffect, useState } from 'react'
const poppins = Poppins({subsets: ['latin'], variable: "--font-poppins", weight: ['100', '200', '300','400','500', '600', '700', '800', '900']})

export default function BaseLayout({title, heading, height_reset, children}) {
  const [darkmode, setDarkmode] = useState("false")

  function toggleMode(){
    if (typeof window !== 'undefined') {
      const mode = darkmode === "true" ? "false" : "true"
      localStorage.setItem("mode", mode)
    }
    setDarkmode(darkmode === "true" ? "false" : "true")
  }

  useEffect(() => {
    console.log("localStorage.getItem(mode): ", localStorage.getItem("mode"))
    const mode = localStorage.getItem("mode")
    setDarkmode(mode)
  }, [])

  return (
    <div className={`${(height_reset === "true" || height_reset === "true_add") ? "" : "h-screen"} ${darkmode === "true" ? "dark" : ""} flex flex-col bg-[#161616] dark:bg-[#FFFFFF] overflow-y-scroll scrollbar scrollbar-thumb-[#26262D] scrollbar-track-[#1D1D22] dark:scrollbar-thumb-[#F0F2FF] scrollbar-track-[#F7F9FC]`}>
        <Head>
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header heading={heading} toggleMode={toggleMode} darkmode={darkmode}></Header>
        <main className={`grow ${poppins.variable} bg-[#161616] text-[#E3E4E8] dark:bg-[#FFFFFF] dark:text-[#17181C]`}>
            {children}
        </main>
    </div>
  )
}
