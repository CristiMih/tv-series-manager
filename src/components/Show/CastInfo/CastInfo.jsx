import style from "./CastInfo.module.css";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

export default function CastInfo() {
  const [castInfo, setCastInfo] = useState([]);
  const carouselRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    async function loadData() {
      try {
        const castRes = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
        const castData = await castRes.json();

        setCastInfo(castData);
        console.log(castData);
      } catch (err) {
        console.error("Eroare la fetch:", err);
      }
    }
    loadData();
  }, [id]);
  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  return (
    <>
      <h2>Cast</h2>
      <div className={style.wrapper}>
        <button
          className={`${style.arrow} ${style["left-arrow"]}`}
          onClick={scrollLeft}
        >
          ◀
        </button>
        <div className={style["carousel-div"]} ref={carouselRef}>
          {castInfo.map((c) => (
            <div key={c.character.id} className={style["episode-info"]}>
              <img src={c.person.image?.medium} />
              <p>{c.person.name}</p>
              <h6>{c.character.name}</h6>
            </div>
          ))}
        </div>
        <button
          className={`${style.arrow} ${style["right-arrow"]}`}
          onClick={scrollRight}
        >
          ▶
        </button>
      </div>
    </>
  );
}
