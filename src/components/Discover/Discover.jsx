import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');

  useEffect(() => {
    if(!query) return;

    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        console.log(data)
        setLoading(false);
      })
      .catch((err) => { console.error("Eroare la fetch:", err); setLoading(false); });
  }, [query]);

  if (loading) {
    return <p>Se incarca...</p>
  }

  return(
    <div>
      <h2>Rezultatele pentru: {query}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {results.map((item, index) => (
        <div key={index}>
          <img src={item.show?.image?.medium}/>
        </div>
        ))}
      </div>    
    </div>
  )
} 