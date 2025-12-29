import style from "./EpisodesInfo.module.css"
import { useEffect, useState, useRef } from "react";

export default function EpisodesCarousel({seasonId, setLoading}) {
  const [episodes, setEpisodes] = useState([]);
  const carouselRef = useRef(null);
  useEffect(() => {
    async function loadData() {
      try {
        const episodesRes = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`)
        const episodesData = await episodesRes.json();
        const regularEpisodes = episodesData.filter(ep => ep.type === "regular");
        setEpisodes(regularEpisodes)

      } catch (err) {
        console.error("Eroare la fetch:", err);

      } finally { 
        setLoading(false); 
      }
    }
    loadData();
  },[seasonId])

  const scrollLeft = () => {
    carouselRef.current.scrollBy({left: -300, behavior:"smooth"});
  };

  const scrollRight = () => { carouselRef.current.scrollBy({ left: 300, behavior: "smooth" }); 
  };
  return (
  <div className={style.wrapper}>
    <button className={`${style.arrow} ${style["left-arrow"]}`} onClick={scrollLeft}>
      ◀
    </button>

    <div className={style["carousel-div"]} ref={carouselRef}>
      {episodes.map(s => (
        <div key={s.id} className={style["episode-info"]}>
          <img src={s.image?.medium} />
          <div className={style["episode-overlay"]}>
            <h3>{s.name}</h3>
            <p>{s.number}</p>
            <p>{s.airdate}</p>
          </div>
          
        </div>
        
      ))}
    </div>

    <button className={`${style.arrow} ${style["right-arrow"]}`} onClick={scrollRight}>
      ▶
    </button>
  </div>
  );

}