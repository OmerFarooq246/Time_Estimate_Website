import BaseLayout from "../../../components/BaseLayout/BaseLayout";
import Processes from "../../../components/Time_Components/Processes";
import { useRouter } from "next/router"


export default function Process_Page(){
    const router = useRouter()
    console.log(router.query)

    return(
    <BaseLayout title={"Time Components - Processes"} heading={"Time Components - Processes"}>
        <Processes sub_category={router.query.sub_category}/>
    </BaseLayout>)
}