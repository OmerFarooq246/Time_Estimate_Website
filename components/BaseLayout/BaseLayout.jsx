import Head from 'next/head'
import Header from './Header'
import { Poppins } from "next/font/google"
const poppins = Poppins({subsets: ['latin'], variable: "--font-poppins", weight: ['100', '200', '300','400','500', '600', '700', '800', '900']})

export default function BaseLayout({title, heading, children}) {
  return (
    <div id="entire-page" className='h-screen flex flex-col bg-[#161616] overflow-y-scroll scrollbar scrollbar-thumb-[#26262D] scrollbar-track-[#1D1D22]'>
        <Head>
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header heading={heading}></Header>
        <main className={`grow ${poppins.variable} bg-[#161616] text-[#E3E4E8]`}>
            {children}
        </main>
    </div>
  )
}
