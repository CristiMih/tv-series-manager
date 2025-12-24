import style from "./EpisodesInfo.module.css"
import { useEffect, useState, useRef } from "react";

export default function EpisodesCarousel({seasonId}) {
  const [episodes, setEpisodes] = useState([]);
  const carouselRef = useRef(null);
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

  const scrollLeft = () => {
    carouselRef.current.scrollBy({left: -300, behavior:"smooth"});
  };

  const scrollRight = () => { carouselRef.current.scrollBy({ left: 300, behavior: "smooth" }); 
  };
  return (
  <div className={style.wrapper}>
    <button className={style.arrow} onClick={scrollLeft}>
      ◀
    </button>

    <div className={style["carousel-div"]} ref={carouselRef}>
      {episodes.map(s => (
        <img src={s.image?.medium} key={s.id} />
      ))}
    </div>

    <button className={style.arrow} onClick={scrollRight}>
      ▶
    </button>
  </div>
  );

}