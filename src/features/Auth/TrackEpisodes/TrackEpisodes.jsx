import { useParams } from "react-router";

export default function TrackEpisodes() {
  const { id } = useParams();

  return (
    <h1>I exist!</h1>
  )
}