import Home from "./Home/Home.js";
import Login from "./Login/Login.js";
import Explore from "./Explore/Explore.js";
import Profile from "./Profile/Profile.js";
import Nav from "./Shared/Nav.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function Components() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Nav />
    </Router>
  );
}
