import { useEffect, useState } from "react";
import ShowInfo from "./ShowInfo/ShowInfo"
import EpisodesInfo from "./EpisodesInfo/EpisodesInfo"
import CastInfo from "./CastInfo/CastInfo"


export default function Show() {
  return (
      <>
        <ShowInfo />
        <EpisodesInfo />
        <CastInfo />
      </>
  )
}