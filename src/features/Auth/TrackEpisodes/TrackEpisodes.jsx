import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuthContext } from "../AuthContext";
import styles from "./TrackEpisodes.module.css";

export default function TrackEpisodes() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSeasons, setOpenSeasons] = useState([]);

  const { user, accessToken } = useAuthContext();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

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

        const seasonsWithEpisodes = seasonsData.map((season) => {
          const episodesInSeasons = episodesData.filter(
            (ep) => ep.season === season.number && ep.type === "regular",
          );
          return {
            ...season,
            episodes: episodesInSeasons,
            episodesCount: episodesInSeasons.length,
          };
        });

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
        console.log({
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
        setLoading(false);
      } catch (err) {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function handleEpisodeWatched(e, ep) {
    e.stopPropagation();

    const watchedEpisode = {
      userId: user.id,
      showId: show.id,
      episodeId: ep.id,
      runtime: ep.runtime,
    };
    
    try {
      await fetch(`${API_URL}/watchedEpisodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(watchedEpisode),
      });
    } catch (err) {
      console.error("Eroare la salvare episod:", err)
    }
  }

  function handleInfoShowClick() {
    navigate(`/show/${show.id}`);
  }
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

        <div className={styles.bottomBar}></div>
      </section>

      <div className={styles.titleDiv}>EPISODES</div>

      <div className={styles.episodesDiv}>
        <div className={styles.allEpisodesDiv}>
          <h3>All episodes</h3>
          <button>✓</button>
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
                <p>0/{season.episodesCount}</p>
                <button>✓</button>
              </div>

              <div className={styles.bottomBar}></div>
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
                      <button onClick={(e) => handleEpisodeWatched(e, ep)}>✓</button>
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
