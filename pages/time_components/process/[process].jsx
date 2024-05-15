import BaseLayout from "../../../components/BaseLayout/BaseLayout";
import Process from "../../../components/Time_Components/Process";
import { useRouter } from "next/router"


export default function Process_Page(){
    const router = useRouter()
    console.log(router.query)

    return(
    <BaseLayout title={"Time Components - Process"} heading={"Time Components - Process"}>
        <Process process_id={router.query.process}/>
    </BaseLayout>)
}