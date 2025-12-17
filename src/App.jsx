import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Nav from "./components/Nav/Nav"
import ContentSection from "./components/ContentSection/Content";
import Discover from "./components/Discover/Discover"
import "./App.css"

export default function App() {

  return (

    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<ContentSection />} />
        <Route path="discover" element={<Discover />}/>
        <Route path="*" element={<h1>404 Not Found</h1>}/>
      </Routes>
    </BrowserRouter>
      


  );
}
