import { useEffect, useState } from "react";
import { useAuthContext } from "../../features/Auth/AuthContext";
import styles from "./ContentSection.module.css";
import { useNavigate } from "react-router";

export default function ContentSection() {
  const [shows, setShows] = useState([]);
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const { user, accessToken } = useAuthContext();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserShows() {
      try {
        const res = await fetch(`${API_URL}/660/userShows?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setShows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading user shows:", err);
      }
    }
    if (user) fetchUserShows();
  }, [user, accessToken]);

  async function handleRemoveClick(show) {
    setLoadingAnimation(true);
    try {
      const showRes = await fetch(
        `${API_URL}/660/userShows?userId=${user.id}&showId=${show.showId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
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
        `${API_URL}/660/watchedEpisodes?userId=${user.id}&showId=${show.showId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const episodes = await episodesRes.json();

      for (const ep of episodes) {
        await fetch(`${API_URL}/660/watchedEpisodes/${ep.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      setShows((prev) => prev.filter((s) => s.id !== show.id));
    } catch (err) {
      console.error("Error removing show:", err);
    } finally {
      setLoadingAnimation(false);
    }
  }

  function navigateToShow(show) {
    navigate(`/track/${show.showId}`);
  }

  return (
    <>
      {loadingAnimation && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span>Loading...</span>
        </div>
      )}
      <div className={styles.showsDiv}>
        {shows.map((show) => (
          <div key={show.id} className={styles.card}>
            <button
              className={styles.delete}
              onClick={() => handleRemoveClick(show)}
            >
              X
            </button>

            <div className={styles.imageWrapper}>
              <img
                src={show.image}
                alt={show.name}
                onClick={() => navigateToShow(show)}
              />
            </div>

            <div className={styles.content}>
              <h3 onClick={() => navigateToShow(show)}>{show.name}</h3>

              <div>
                <p>
                  {" "}
                  {show.premiered?.slice(0, 4)} -{" "}
                  {show.ended?.slice(0, 4) ?? ""}{" "}
                </p>
                <p>
                  {show.episodesWatched}/{show.episodesReleased} eps
                </p>
              </div>

              <p className={styles.rating}>{show.rating ?? "N/A"}</p>

              <p
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: `${show.summary}...` }}
              />
            </div>

            <div className={styles.progressionBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(show.episodesWatched / show.episodesReleased) * 100}%`,
                  backgroundColor:
                    show.episodesWatched === 0
                      ? "#6F581A" // 0%
                      : show.episodesWatched === show.episodesReleased
                        ? "green" // 100%
                        : "yellow", // progres intermediar
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
