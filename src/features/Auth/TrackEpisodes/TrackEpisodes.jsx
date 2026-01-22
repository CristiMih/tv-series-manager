import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuthContext } from "../AuthContext";
import styles from "./TrackEpisodes.module.css";

export default function TrackEpisodes() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSeasons, setOpenSeasons] = useState([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);

  const { user, accessToken } = useAuthContext();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const isEpisodeWatched = (episodeId) => {
    if (!Array.isArray(watchedEpisodes) || watchedEpisodes.length === 0) {
      return false;
    }
    return watchedEpisodes.some((w) => w.episodeId === episodeId);
  };

  const getSeasonProgress = (seasonNumber) => {
    const seasonEpisodes =
      show.seasons.find((s) => s.number === seasonNumber)?.episodes || [];

    const watchedInSeason = seasonEpisodes.filter((ep) =>
      isEpisodeWatched(ep.id),
    ).length;

    return `${watchedInSeason}/${seasonEpisodes.length}`;
  };

  const isSeasonComplete = (seasonNumber) => {
    const season = show.seasons.find((s) => s.number === seasonNumber);
    if (!season) return false;

    return season.episodes.every((ep) => isEpisodeWatched(ep.id));
  };

  const isShowComplete = () => {
    if (!show) return false;
    return show.seasons.every((season) =>
      season.episodes.every((ep) => isEpisodeWatched(ep.id)),
    );
  };

  useEffect(() => {
    async function loadData() {
      try {
        const showRes = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const showData = await showRes.json();

        const imagesRes = await fetch(
          `https://api.tvmaze.com/shows/${id}/images`,
        );
        const imagesData = await imagesRes.json();

        const seasonsRes = await fetch(
          `https://api.tvmaze.com/shows/${id}/seasons`,
        );
        const seasonsData = await seasonsRes.json();

        const episodesRes = await fetch(
          `https://api.tvmaze.com/shows/${id}/episodes`,
        );
        const episodesData = await episodesRes.json();

        const today = new Date();

        const releasedEpisodes = episodesData.filter(
          (ep) => ep.airstamp && new Date(ep.airstamp) <= today,
        ).length;

        const seasonsWithEpisodes = seasonsData
          .map((season) => {
            const episodesInSeason = episodesData.filter(
              (ep) =>
                ep.season === season.number &&
                ep.type === "regular" &&
                ep.airstamp &&
                new Date(ep.airstamp) <= today,
            );
            return {
              ...season,
              episodes: episodesInSeason,
              episodesCount: episodesInSeason.length,
            };
          })
          .filter((season) => season.episodesCount > 0);

        setShow({
          ...showData,
          bigImages: imagesData.filter(
            (img) => img.resolutions?.original?.width >= 1500,
          ),
          seasons: seasonsWithEpisodes,
          seasonsCount: seasonsData.filter(
            (s) => s.premiereDate && new Date(s.premiereDate) <= today,
          ).length,
          episodesReleased: releasedEpisodes,
        });

        const watchedRes = await fetch(
          `${API_URL}/watchedEpisodes?userId=${user.id}&showId=${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const watchedData = await watchedRes.json();

        setWatchedEpisodes(Array.isArray(watchedData) ? watchedData : []);

        setLoading(false);
      } catch (err) {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [id, user?.id, accessToken]);

  async function handleEpisodeWatched(e, ep) {
    e.stopPropagation();

    const existing = watchedEpisodes.find((w) => w.episodeId === ep.id);

    // dacă există -> UNWATCH (DELETE)
    if (existing) {
      console.log("Deleting:", existing.id);
      try {
        const res = await fetch(
          `${API_URL}/660/watchedEpisodes/${existing.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (!res.ok) throw new Error("Failed to delete");

        setWatchedEpisodes((prev) => prev.filter((w) => w.episodeId !== ep.id));
      } catch (err) {
        console.error("Eroare la ștergere episod:", err);
      }
      return;
    }

    // dacă nu există -> WATCH (POST)
    const watchedEpisode = {
      userId: user.id,
      showId: id,
      episodeId: ep.id,
      runtime: ep.runtime,
    };

    try {
      const res = await fetch(`${API_URL}/watchedEpisodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(watchedEpisode),
      });

      if (!res.ok) throw new Error("Failed to save");

      const created = await res.json(); // json-server returnează obiectul cu id nou [web:51]
      console.log("Created:", created);

      setWatchedEpisodes((prev) => [...prev, created]);
    } catch (err) {
      console.error("Eroare la salvare episod:", err);
    }
  }

  async function handleSeasonToggle(e, seasonNumber) {
    e.stopPropagation();
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const season = show.seasons.find((s) => s.number === seasonNumber);
    if (!season) return;

    const isComplete = isSeasonComplete(seasonNumber);

    // Dacă e complet → uncheck toate
    if (isComplete) {
      for (const ep of season.episodes) {
        const existing = watchedEpisodes.find((w) => w.episodeId === ep.id);
        if (existing) {
          await fetch(`${API_URL}/660/watchedEpisodes/${existing.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }
      }

      setWatchedEpisodes((prev) =>
        prev.filter(
          (w) => !season.episodes.some((ep) => ep.id === w.episodeId),
        ),
      );
      return;
    }

    // Dacă nu e complet → mark toate ca watched
    for (const ep of season.episodes) {
      if (!isEpisodeWatched(ep.id)) {
        const watchedEpisode = {
          userId: user.id,
          showId: id,
          episodeId: ep.id,
          runtime: ep.runtime || 45,
        };

        try {
          const res = await fetch(`${API_URL}/watchedEpisodes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(watchedEpisode),
          });

          if (res.ok) {
            const created = await res.json();
            setWatchedEpisodes((prev) => [...prev, created]);
          }
        } catch (err) {
          console.error("Error marking episode:", ep.id, err);
        }

        await delay(5); // delay între POST-uri
      }
    }
  }

  async function handleAllEpisodesToggle(e) {
    e.stopPropagation();

    if (!user) {
      setShowModal(true);
      return;
    }

    const isComplete = isShowComplete();

    if (isComplete) {
      // Deselectează TOATE (ca handleRemoveClick)
      try {
        const episodesRes = await fetch(
          `${API_URL}/660/watchedEpisodes?userId=${user.id}&showId=${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        const episodes = await episodesRes.json();

        for (const ep of episodes) {
          await fetch(`${API_URL}/660/watchedEpisodes/${ep.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        // Refresh watchedEpisodes
        const refreshed = await fetch(
          `${API_URL}/660/watchedEpisodes?userId=${user.id}&showId=${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        setWatchedEpisodes(await refreshed.json());
      } catch (err) {
        console.error("Error clearing all:", err);
      }
      return;
    }

    // Marchează TOATE ca seen (ca handleSeenClick)
    try {
      const episodesRes = await fetch(
        `https://api.tvmaze.com/shows/${id}/episodes`,
      );
      const episodes = await episodesRes.json();
      const today = new Date();

      const filteredEpisodes = episodes.filter(
        (ep) =>
          ep.type === "regular" &&
          ep.airstamp &&
          new Date(ep.airstamp) <= today,
      );

      const seenItems = filteredEpisodes.map((ep) => ({
        userId: user.id,
        showId: id,
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
        await delay(10);
      }

      // Refresh watchedEpisodes
      const refreshed = await fetch(
        `${API_URL}/660/watchedEpisodes?userId=${user.id}&showId=${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setWatchedEpisodes(await refreshed.json());
    } catch (err) {
      console.error("Error marking all seen:", err);
    }
  }

  function handleInfoShowClick() {
    navigate(`/show/${show.id}`);
  }

  // Calculează înainte de return
  const totalReleased =
    show?.seasons.reduce((sum, s) => sum + s.episodesCount, 0) || 0;
  const watchedCount =
    show?.seasons.reduce(
      (sum, s) =>
        sum + s.episodes.filter((ep) => isEpisodeWatched(ep.id)).length,
      0,
    ) || 0;
  const percent = totalReleased > 0 ? (watchedCount / totalReleased) * 100 : 0;


  
  if (loading) return <p>Loading...</p>;
  return (
    <main className={styles.trackWrapper}>
      <section
        className={styles.infoSection}
        style={{
          "--bg-image": `url(${show.bigImages?.[0]?.resolutions?.original?.url})`,
        }}
      >
        <div className={styles.showInfoBtnDiv}>
          <button className={styles.showInfoBtn} onClick={handleInfoShowClick}>
            Show Info
          </button>
        </div>

        <div>
          <h2>{show.name}</h2>
          <p>
            {show.seasonsCount || 0}
            {show.seasonsCount > 1 ? " seasons" : " season"} •{" "}
            {show.premiered?.split("-")[0] || "Unknown"} • {show.status}
          </p>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.progressBase} />
          <div
            className={styles.progressOverlay}
            style={{ width: `${percent}%` }}
          />
          {percent === 100 && <div className={styles.progressComplete} />}
        </div>
      </section>

      <div className={styles.titleDiv}>EPISODES</div>

      <div className={styles.episodesDiv}>
        <div className={styles.allEpisodesDiv}>
          <h3>All episodes</h3>
          <button
            onClick={handleAllEpisodesToggle}
            className={isShowComplete() ? styles.btnWatched : `${""}`}
          >
            ✓
          </button>
        </div>

        {show.seasons.map((season) => (
          <div
            key={season.id}
            onClick={() => {
              if (openSeasons.includes(season.number)) {
                setOpenSeasons(openSeasons.filter((s) => s !== season.number));
              } else {
                setOpenSeasons([...openSeasons, season.number]);
              }
            }}
          >
            <div className={styles.seasonDiv}>
              <div>
                <h4>Season {season.number}</h4>
                <button>
                  {openSeasons.includes(season.number) ? "▲" : "▼"}
                </button>
              </div>

              <div>
                <p>{getSeasonProgress(season.number)}</p>
                <button
                  onClick={(e) => handleSeasonToggle(e, season.number)}
                  className={
                    isSeasonComplete(season.number)
                      ? `${styles.btnWatched}`
                      : `${""}`
                  }
                >
                  ✓
                </button>
              </div>

              <div className={styles.bottomBar}>
                {/* Galben închis de bază */}
                <div className={styles.progressBase}></div>
                {/* Overlay galben deschis (progres actual) */}
                <div
                  className={styles.progressOverlay}
                  style={{
                    width: `${(getSeasonProgress(season.number).split("/")[0] / getSeasonProgress(season.number).split("/")[1]) * 100}%`,
                  }}
                />
                {/* Verde complet (doar când 100%) */}
                {isSeasonComplete(season.number) && (
                  <div className={styles.progressComplete} />
                )}
              </div>
            </div>

            {openSeasons.includes(season.number) && (
              <div
                className={styles.episodesList}
                onClick={(e) => e.stopPropagation()}
              >
                {season.episodes.map((ep) => (
                  <div key={ep.id} className={styles.episodeItem}>
                    <div className={styles.leftSide}>
                      <div>
                        <img
                          src={ep.image?.medium || "/fallback.jpg"}
                          alt={ep.name}
                        />
                      </div>

                      <div className={styles.episodeInfo}>
                        <p>
                          S{String(ep.season).padStart(2, "0")} | E
                          {String(ep.number).padStart(2, "0")}
                        </p>
                        <p>{ep.name}</p>
                      </div>
                    </div>
                    <div className={styles.btnDiv}>
                      <button
                        onClick={(e) => handleEpisodeWatched(e, ep)}
                        className={
                          isEpisodeWatched(ep.id)
                            ? `${styles.btnWatched}`
                            : `${""}`
                        }
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
