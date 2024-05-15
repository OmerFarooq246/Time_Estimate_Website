import BaseLayout from "../components/BaseLayout/BaseLayout";
import Project_Estimates from "../components/Estimate/Project_Estimates";

export default function LoginPage(){
    return(
    <BaseLayout title={"Project Estimates"} heading={"Project Estimates"}>
        <Project_Estimates />
    </BaseLayout>)
}