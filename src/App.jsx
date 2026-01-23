import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Nav from "./components/Nav/Nav"
import Homepage from "./components/HomePage/Homepage"
import Discover from "./components/Discover/Discover"
import Show from "./components/Show/Show"
import Register from "./features/Auth/Register";
import Login from "./features/Auth/Login";
import TrackEpisodes from "./features/Auth/TrackEpisodes/TrackEpisodes";
import ProfilePage from "./features/Auth/ProfilePage"
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer/Footer"
import "./App.css"
import { AuthContextProvider } from "./features/Auth/AuthContext";

export default function App() {
  
  return (
    
    <BrowserRouter>
      <AuthContextProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="discover" element={<Discover />}/>
          <Route path="/show/:id" element={<Show />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="*" element={<h1>404 Not Found</h1>}/>
          <Route path="/track/:id" element={<TrackEpisodes/>} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
        <Footer />

        <ToastContainer />
      </AuthContextProvider>
    </BrowserRouter>
      
      
      
    );
  }
  