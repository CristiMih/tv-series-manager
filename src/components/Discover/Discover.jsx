import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import noImg from "../../assets/no-image.jpg";
import styles from "./Discover.module.css";

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  useEffect(() => {
    if (!query) return;

    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      });
  }, [query]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles["discover-div"]}>
      <h2>Results for: "{query}"</h2>
      <div className={styles["search-div"]}>
        {results.map((item, index) => (
          <div key={index} className={styles["show-div"]}>
            <Link to={`/show/${item.show.id}`}>
              <img
                src={item.show.image?.medium || noImg}
                alt={item.show.name || "No image available"}
              />
            </Link>

            <h4>{item.show.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
