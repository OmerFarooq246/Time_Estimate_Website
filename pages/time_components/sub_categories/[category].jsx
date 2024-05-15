import BaseLayout from "../../../components/BaseLayout/BaseLayout";
import Sub_Categories from "../../../components/Time_Components/Sub_Categories";
import { useRouter } from "next/router"


export default function Sub_Categories_Page(){
    const router = useRouter()
    console.log(router.query)

    return(
    <BaseLayout title={"Time Components - Sub_Categories"} heading={"Time Components - Sub_Categories"}>
        <Sub_Categories category={router.query.category}/>
    </BaseLayout>)
}