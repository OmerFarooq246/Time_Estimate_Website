import BaseLayout from "../components/BaseLayout/BaseLayout";
import Admin_Panel from "../components/Admin/Admin_Panel";
import { useEffect } from "react";
import axios from "axios";

export default function AdminPage(){
    // async function get_token(){
    //     try{
    //         const res = await axios.get("/api/checktoken")
    //         console.log("res.data: ", res.data)
    //     }
    //     catch(error){
    //         console.log("error in get_token: ", error)
    //     }
    // }

    // useEffect(() => {
    //     get_token()
    // }, [])

    return(
    <BaseLayout title={"Admin Panel"} heading={"Admin Panel"}>
        <Admin_Panel />
    </BaseLayout>)
}