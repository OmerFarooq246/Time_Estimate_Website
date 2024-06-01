import BaseLayout from "../../components/BaseLayout/BaseLayout";
import Estimate from "../../components/Estimate/Estimate";
import { useRouter } from "next/router"


// export default function Estimate_Page(){
const Estimate_Page = () => {
    const router = useRouter()
    console.log("router.query in Estimate_Page", router.query)

    return(
        <BaseLayout title={"New Estimate"} heading={"New Estimate"} height_reset={router.query.edit}>
            {router.query.edit === "true"
            ? <Estimate estimate={router.query.estimate} edit={true}/> 
            : <Estimate estimate={router.query.estimate} edit={false}/>}
        </BaseLayout>)
}

export default Estimate_Page;