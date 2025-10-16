import Home from "./Home/Home";
import Login from "./Login/Login";
import Explore from "./Explore/Explore";
import Profile from "./Profile/Profile";
import Main from "./Main/Main";
import Nav from "./Shared/Nav/Nav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function Components() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
