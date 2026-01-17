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

  const { user, accessToken } = useAuthContext();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

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

        const episodesRes = await fetch(
          `https://api.tvmaze.com/shows/${id}/episodes`
        );

        const episodesData = await episodesRes.json();

        const today = new Date();

        const releasedEpisodes = episodesData.filter(
          (ep) => ep.airstamp && new Date(ep.airstamp) <= today
        ).length;

        setShow({
          ...showData,
          bigImages: imagesData.filter(
            (img) => img.resolutions?.original?.width >= 1500
          ),
          seasonsCount: seasonsData.filter(
            (s) => s.premiereDate && new Date(s.premiereDate) <= today
          ).length,
          episodesReleased: releasedEpisodes,
        });

        setLoading(false);
      } catch (err) {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleWatchlistClick() {
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      const existsRes = await fetch(
        `${API_URL}/660/userShows?userId=${user.id}&showId=${show.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!existsRes.ok) {
        console.log("Not authorized to check watchlist");
      } else {
        const exists = await existsRes.json();

        if (exists.length > 0) {
          console.log("Show already in watchlist!");
          return;
        }
      }

      const watchlistItem = {
        userId: user.id,
        showId: show.id,
        name: show.name,
        image: show.image?.medium,
        premiered: show.premiered,
        ended: show.ended,
        episodesReleased: show.episodesReleased,
        rating: show.rating?.average,
        summary: show.summary,
      };

      const postRes = await fetch(`${API_URL}/660/userShows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(watchlistItem),
      });
      if (!postRes.ok) {
        console.error("POST failed:", postRes.status);
        return;
      }
      console.log("Added to watchlist!");
    } catch (err) {
      console.error("Error saving show:", err);
    }
  }

  async function handleSeenClick() {
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      const showItem = {
        userId: user.id,
        showId: show.id,
        name: show.name,
        image: show.image?.medium || null,
        premiered: show.premiered || null,
        ended: show.ended || null,
        episodesReleased: show.episodesReleased,
        rating: show.rating?.average || null,
        summary: show.summary || "",
      };

      await fetch(`${API_URL}/660/userShows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(showItem)
      });

      const episodesRes = await fetch(
        `https://api.tvmaze.com/shows/${id}/episodes`
      );
      const episodes = await episodesRes.json();
      console.log(episodes)
      const today = new Date();

      const filteredEpisodes = episodes.filter(
        (ep) =>
          ep.type === "regular" && ep.airstamp && new Date(ep.airstamp) <= today
      );

      const seenItems = filteredEpisodes.map((ep) => ({
        userId: user.id,
        showId: show.id,
        episodeId: ep.id,
        runtime: ep.runtime || 0,
      }));

      await Promise.all(
        seenItems.map((item) =>
          fetch(`${API_URL}/660/watchedEpisodes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(item),
          })
        )
      );
    } catch (err) {
      console.error("Error marking episodes as seen:", err);
    }
  }

  if (loading) return <p>Loading...</p>;
  return (
    <>
      {showModal && (
        <AuthRequiredModal onClose={() => setShowModal(false)} showId={id} />
      )}
      <section
        className={styles["show-info"]}
        style={{
          "--bg-image": `url(${show.bigImages?.[0]?.resolutions?.original?.url})`,
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
