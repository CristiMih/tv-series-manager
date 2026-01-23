import ContentSection from "./Content"
import LandingPage from "./LandingPage"
import { useAuthContext } from "../../features/Auth/AuthContext";

export default function Homepage() {
  return(
    <>
      {/* <LandingPage /> */}
      <ContentSection />
    </>
  )
}