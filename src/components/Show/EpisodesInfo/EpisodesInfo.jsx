import { useEffect, useState } from "react";
import { useParams } from "react-router";
import style from "./EpisodesInfo.module.css";
import EpisodesCarousel from "./EpisodesCarousel";

export default function EpisodesInfo() {
  const [season, setSeason] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    async function loadData() {
      try {
        const seasonRes = await fetch(
          `https://api.tvmaze.com/shows/${id}/seasons`
        );
        const seasonData = await seasonRes.json();

        const today = new Date();

        const filteredSeasons = seasonData.filter((s) => {
          if (!s.premiereDate) return false;
          return new Date(s.premiereDate) <= today;
        });

        setSeason(filteredSeasons);
        setSelectedSeasonId(filteredSeasons[0]?.id);
      } catch (err) {
        console.error("Eroare la fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <p>Se incarca...</p>;

  return (
    <>
      <div className={style["episodes-div"]}>
        <h2>Episodes</h2>
        <div className={style['select-wrapper']}>
          <select
            value={selectedSeasonId}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
          >
            {season.map(
              (s) =>
                s.premiereDate && (
                  <option key={s.id} value={s.id}>
                    Season {s.number}
                  </option>
                )
            )}
          </select>
        </div>
      </div>
      <EpisodesCarousel seasonId={selectedSeasonId} setLoading={setLoading} />
    </>
  );
}
