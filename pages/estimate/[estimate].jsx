import BaseLayout from "../../components/BaseLayout/BaseLayout";
import Estimate from "../../components/Estimate/Estimate";
import { useRouter } from "next/router"

export default function Estimate_Page(){
    const router = useRouter()
    console.log(router.query)

    return(
    <BaseLayout title={"New Estimate"} heading={"New Estimate"}>
        <Estimate estimate={router.query.estimate}/>
    </BaseLayout>)
}