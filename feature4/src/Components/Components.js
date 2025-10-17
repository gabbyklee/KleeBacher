import Home from "./Home/Home";
import Login from "./Login/Login";
import Explore from "./Explore/Explore";
import Profile from "./Profile/Profile";
import Nav from "./Shared/Nav/Nav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// routing with react, need to build out pages in future
export default function Components() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
