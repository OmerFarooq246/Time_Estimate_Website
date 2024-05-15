import BaseLayout from "../../components/BaseLayout/BaseLayout";
import Login from "../../components/Login/Login";

export default function LoginPage(){
    return(
    <BaseLayout title={"Login"} heading={"Login"}>
        <Login />
    </BaseLayout>)
}