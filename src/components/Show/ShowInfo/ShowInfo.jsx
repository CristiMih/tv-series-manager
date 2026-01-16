import { useAuthContext } from "../../../features/Auth/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "../Show.module.css";
import Rating from "./Rating";
import noImg from "../../../assets/no-image.jpg";

export default function ShowInfo() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuthContext();
  const { id } = useParams();

  useEffect(() => {
    async function loadData() {
      try {
        const showRes = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const showData = await showRes.json();

        const imagesRes = await fetch(
          `https://api.tvmaze.com/shows/${id}/images`
        );
        const imagesData = await imagesRes.json();

        const seasonsRes = await fetch(
          `https://api.tvmaze.com/shows/${id}/seasons`
        );
        const seasonsData = await seasonsRes.json();

        const today = new Date();

        setShow({
          ...showData,
          bigImages: imagesData.filter(
            (img) => img.resolutions?.original?.width >= 1500
          ),
          seasonsCount: seasonsData.filter(
            (s) => s.premiereDate && new Date(s.premiereDate) <= today
          ).length,
        });

        setLoading(false);
      } catch (err) {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleWatchlistClick() {
    if (!user) {
      setShowModal(true);
      return;
    }
    console.log("Added to watchlist!");
  }

  function handleSeenClick() {
    if (!user) {
      setShowModal(true);
      return;
    }

    console.log("Marked as seen!");
  }

  if (loading) return <p>Loading...</p>;
  return (
    <>
      {showModal && <AuthRequiredModal onClose={() => setShowModal(false)}  showId={id} />}
      <section
        className={styles["show-info"]}
        style={{
          "--bg-image": `url(${show.bigImages?.[0]?.resolutions.original.url})`,
        }}
      >
        <img
          src={show.image?.medium || noImg}
          alt={show.name || "Show image"}
          className={styles.showImg}
        />
        <div className={styles["show-data"]}>
          <h2>{show.name}</h2>
          <p>
            {show.seasonsCount || 0}
            {show.seasonsCount > 1 ? " seasons" : " season"} •
            {" " + show.premiered?.split("-")[0] || "Unknown"} •
            {" " + show.status}
          </p>
          <p>
            Rating:{" "}
            {show.rating?.average ? `${show.rating.average} / 10` : "N/A"}
          </p>
          <Rating score={show.rating.average} />
          <p>{show.genres.join(",").toUpperCase()}</p>
          <p
            dangerouslySetInnerHTML={{ __html: show.summary }}
            className={styles["show-summary"]}
          ></p>
        </div>
        <div className={styles.watchlistBtnDiv}>
          <button
            className={styles.watchlistBtn}
            onClick={handleWatchlistClick}
          >
            + Add to watchlist
          </button>
          <span className={styles.seenBtn} onClick={handleSeenClick}>
            ALREADY SEEN IT?
          </span>
        </div>
      </section>
    </>
  );
}
