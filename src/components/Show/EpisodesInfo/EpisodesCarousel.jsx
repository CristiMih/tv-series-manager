import style from "./EpisodesInfo.module.css";
import { useEffect, useState, useRef } from "react";
import noImg from "../../../assets/no-image.jpg";

export default function EpisodesCarousel({ seasonId, setLoading }) {
  const [episodes, setEpisodes] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const episodesRes = await fetch(
          `https://api.tvmaze.com/seasons/${seasonId}/episodes`
        );
        const episodesData = await episodesRes.json();
        const regularEpisodes = episodesData
          .filter((ep) => ep.type === "regular")
          .map((ep) => ({
            ...ep,
            airdate: new Date(ep.airdate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          }));
        setEpisodes(regularEpisodes);
      } catch (err) {
        console.error("Eroare la fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [seasonId]);

  function checkOverflow() {
    const el = carouselRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth;
    if (!hasOverflow) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    updateScrollButtons();
  }

  function updateScrollButtons() {
    const el = carouselRef.current;
    if (!el) return;
    const atStart = el.scrollLeft === 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  }

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [episodes]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  return (
    <div className={style.wrapper}>
      {canScrollLeft && (
        <button
          className={`${style.arrow} ${style["left-arrow"]}`}
          onClick={scrollLeft}
        >
          ◀
        </button>
      )}

      <div className={style["carousel-div"]} ref={carouselRef}>
        {episodes.map((s) => (
          <div key={s.id} className={style["episode-info"]}>
            <img src={s.image?.medium || noImg} />
            <div className={style["episode-overlay"]}>
              <p>
                S{String(s.season).padStart(2, "0")} | E
                {String(s.number).padStart(2, "0")}
              </p>
              <h3>{s.name}</h3>
              <p>{s.airdate}</p>
            </div>
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          className={`${style.arrow} ${style["right-arrow"]}`}
          onClick={scrollRight}
        >
          ▶
        </button>
      )}
    </div>
  );
}
