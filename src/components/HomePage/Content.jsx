import { useEffect, useState } from "react";
import { useAuthContext } from "../../features/Auth/AuthContext";
import styles from "./ContentSection.module.css";
import nedImg from "../../assets/poster.jpeg";

export default function ContentSection() {
  const [shows, setShows] = useState([]);

  const { user, accessToken } = useAuthContext();
  const API_URL = import.meta.env.VITE_API_URL;

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
  return (
    <>
      <div className={styles.showsDiv}>
        {shows.map((show) => (
          <div key={show.id} className={styles.card}>
            <button className={styles.delete}>X</button>

            <div className={styles.imageWrapper}>
              <img src={show.image} alt={show.name} />
            </div>

            <div className={styles.content}>
              <h3>{show.name}</h3>

              <div>
                <p>{show.premiered?.slice(0, 4)}</p>
                <p>
                  {show.episodesWatched}/{show.episodesReleased} eps
                </p>
              </div>

              <p className={styles.rating}>{show.rating}</p>

              <p
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: show.summary }}
              />
            </div>

            <div className={styles.progressionBar}></div>
          </div>
        ))}
      </div>
    </>
  );
}
