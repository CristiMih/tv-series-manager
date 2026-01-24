import ContentSection from "./Content"
import LandingPage from "./LandingPage"
import { useAuthContext } from "../../features/Auth/AuthContext";
import { useEffect, useState } from "react";

export default function Homepage() {
  const { user, accessToken } = useAuthContext();
  const API_URL = import.meta.env.VITE_API_URL;
  const [userShows, setUserShows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !accessToken) {
      setLoading(false);
      return;
    }

    const fetchUserShows = async () => {
      try {
       const res = await fetch(`${API_URL}/660/userShows?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();

        const currentUserShows = data.filter(
          (show) => show.userId === user.id
        );

        setUserShows(currentUserShows);
      } catch (error) {
        console.error("Eroare la fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserShows();
  }, [user, accessToken]);


  if (loading) return <p>Loading...</p>;


  if (!user || !accessToken) return <LandingPage />;

 
  if (!userShows || userShows.length === 0) return <LandingPage />;


  return <ContentSection />;
}
