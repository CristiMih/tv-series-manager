import style from "./CastInfo.module.css";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import noImg from "../../../assets/no-image.jpg";

export default function CastInfo() {
  const [castInfo, setCastInfo] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const carouselRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    async function loadData() {
      try {
        const castRes = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
        const castData = await castRes.json();

        setCastInfo(castData);
      } catch (err) {
        console.error("Eroare la fetch:", err);
      }
    }
    loadData();
  }, [id]);

  function updateScrollButtons() {
    const el = carouselRef.current;
    if (!el) return;
    const atStart = el.scrollLeft === 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  }

  function checkOverFlow() {
    const el = carouselRef.current;
    if (!el) return;
    const hasOverFlow = el.scrollWidth > el.clientWidth;
    if (hasOverFlow) {
      updateScrollButtons();
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }

  useEffect(() => {
    checkOverFlow();
    window.addEventListener("resize", checkOverFlow);
    return () => window.removeEventListener("resize", checkOverFlow);
  }, [castInfo]);

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
    <>
      <h2 className={style["cast-title"]}>Cast</h2>
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
          {castInfo.map((c) => (
            <div key={c.character.id} className={style["episode-info"]}>
              <img src={c.person.image?.medium || noImg} />
              <p>{c.person.name}</p>
              <h6>{c.character.name.toUpperCase()}</h6>
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
    </>
  );
}
