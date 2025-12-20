import { useEffect, useState } from "react";
import { useParams } from "react-router"
import styles from "./Show.module.css"
import Rating from "./Rating"


export default function Show() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

useEffect(() => {
  async function loadData() {
    try {
      const showRes = await fetch(`https://api.tvmaze.com/shows/${id}`);
      const showData = await showRes.json();

      const imagesRes = await fetch(`https://api.tvmaze.com/shows/${id}/images`);
      const imagesData = await imagesRes.json();

      const seasonsRes = await fetch(`https://api.tvmaze.com/shows/${id}/seasons`); 
      const seasonsData = await seasonsRes.json();

      setShow({
        ...showData,
        bigImages: imagesData.filter(img => img.resolutions?.original?.width >= 1500 ),
        seasonsCount: seasonsData.length
      });

      setLoading(false);
    } catch (err) {
      console.error("Eroare la fetch:", err);
      setLoading(false);
    }
  }

  loadData();
}, [id]);

  if (loading) return <p>Se incarca...</p>

  return (
    <>
      <section
        className={styles["show-info"]}
        style={{
          backgroundImage: `url(${show.bigImages?.[0]?.resolutions.original.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >

        <img src={show.image?.medium} alt={show.name} className={styles.showImg}/>
        <div className={styles['show-data']}>
          <h2>{show.name}</h2>
          <p>{show.seasonsCount} {show.seasonsCount > 1 ? "Seasons" : "Season"} • {show.premiered.split("-")[0]} • {show.status}</p>
          <p>Rating: {show.rating.average}</p>
          <Rating score={show.rating.average}/>
          <p>{show.genres.join(", ")}</p>
          <p dangerouslySetInnerHTML={{ __html: show.summary }} />
        </div>
        <button className={styles.watchlistBtn}>+ Add to watchlist</button>
      </section>
      
    </>
  )
}