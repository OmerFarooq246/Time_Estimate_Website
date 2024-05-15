import Home from '../components/Home/home'
import BaseLayout from '../components/BaseLayout/BaseLayout'

export default function HomePage() {
 
  return (
    <BaseLayout title={"HomePage"} heading={"Home"}>
        <Home />
    </BaseLayout>
  )
}
