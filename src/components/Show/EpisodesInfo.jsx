import { useEffect, useState } from "react";
import { useParams } from "react-router"

export default function EpisodesInfo() {
  const [season, setSeason] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    async function loadData() {
      try{
        const seasonRes = await fetch(`https://api.tvmaze.com/shows/${id}/seasons`)
        const seasonData = await seasonRes.json();

        setSeason(seasonData)
        setLoading(false);
        console.log(seasonData);
      } catch (err) {
      console.error("Eroare la fetch:", err);
      setLoading(false);
      } 
    } 
    loadData();
  
  },[id])

  if (loading) return <p>Se incarca...</p>

  return(
    <>
      <h2>Episodes</h2>
          <select>
            {season.map(s => (
             <option key={s.id} value={s.number}>
              Season {s.number}
             </option>
            ))}
          </select>
    </>
  )
}