import { useNavigate } from "react-router";
import { useState } from "react";
export default function SearchForm(){
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    navigate(`/discover?query=${query}`);
  }
  return(
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Search titles" value={query} onChange={(e) => setQuery(e.target.value)}/>
      </form>
  )
}