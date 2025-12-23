import style from "./EpisodesInfo.module.css"
import { useEffect, useState } from "react";

export default function EpisodesCarousel({seasonId}) {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const episodesRes = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`)
        const episodesData = await episodesRes.json();
        const regularEpisodes = episodesData.filter(ep => ep.type === "regular");
        setEpisodes(regularEpisodes)
        console.log(episodesData)
      } catch (err) {
      console.error("Eroare la fetch:", err);
      setLoading(false);
      } 
    }
    loadData();
  },[seasonId])

  return(
    <div className={style["carousel-div"]}>
      {episodes.map(s => (
              <img  src={s.image?.medium} key={s.id}/>
            ))}
    </div>
  )
}