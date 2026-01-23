import { useAuthContext } from "../../../features/Auth/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "../Show.module.css";
import Rating from "./Rating";
import noImg from "../../../assets/no-image.jpg";

export default function ShowInfo() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isInDb, setIsInDb] = useState(false);

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

        if (!user) {
          setIsInDb(false);
          setLoading(false);
          return;
        }

        const existsRes = await fetch(
          `${API_URL}/660/userShows?userId=${user.id}&showId=${showData.id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (existsRes.ok) {
          const exists = await existsRes.json();
          if (exists.length > 0) {
            setIsInDb(true);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [id, user, accessToken]);

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
        episodesWatched: 0,
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
      setIsInDb(true);
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
        episodesWatched: show.episodesReleased,
        rating: show.rating?.average || null,
        summary: show.summary || "",
      };

      await fetch(`${API_URL}/660/userShows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(showItem),
      });

      const episodesRes = await fetch(
        `https://api.tvmaze.com/shows/${id}/episodes`
      );
      const episodes = await episodesRes.json();
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

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for (const item of seenItems) {
        await fetch(`${API_URL}/660/watchedEpisodes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(item),
        });

        await delay(5);
      }

      setIsInDb(true);
    } catch (err) {
      console.error("Error marking episodes as seen:", err);
    }
  }

  async function handleRemoveClick() {
    try {
      const showRes = await fetch(
        `${API_URL}/660/userShows?userId=${user.id}&showId=${show.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const showItems = await showRes.json();

      if (showItems.length > 0) {
        const showItemId = showItems[0].id;

        await fetch(`${API_URL}/660/userShows/${showItemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      const episodesRes = await fetch(
        `${API_URL}/660/watchedEpisodes?userId=${user.id}&showId=${show.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const episodes = await episodesRes.json();

      for (const ep of episodes) {
        await fetch(`${API_URL}/660/watchedEpisodes/${ep.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      setIsInDb(false);
    } catch (err) {
      console.error("Error removing show:", err);
    }
  }
  const navigate = useNavigate();

  function handleTrackClick() {
    navigate(`/track/${show.id}`);
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
        <div className={styles.imgTxt}>
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
        </div>
        {isInDb ? (
          <div className={styles.watchlistBtnDiv}>
            <button className={styles.watchlistBtn} onClick={handleTrackClick}>
              Track Episodes
            </button>
            <span className={styles.seenBtn} onClick={handleRemoveClick}>
              REMOVE FROM WATCHLIST
            </span>
          </div>
        ) : (
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
        )}
      </section>
    </>
  );
}
