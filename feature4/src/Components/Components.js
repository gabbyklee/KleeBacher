import Home from "./Home/Home";
import Explore from "./Explore/Explore";
import BookClub from "./BookClub/BookClub";
import Profile from "./Profile/Profile";
import Nav from "./Shared/Nav/Nav";
import AuthModule from "./Auth/Auth";
import AuthRegister from "./Auth/AuthRegister";
import AuthLogin from "./Auth/AuthLogin";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// routing with react, need to build out pages in future
export default function Components() {
  return (
    <Router>
      <Nav />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />  
        <Route path="/explore" element={<Explore />} />
        
        {/* Auth pages */}
        <Route path="/auth" element={<AuthModule />} />
        <Route path="/auth/register" element={<AuthRegister />} />
        <Route path="/auth/login" element={<AuthLogin />} />
        
        {/* Protected Routes */}
        <Route path="/bookclub" element={<ProtectedRoute element={BookClub} />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        
        {/* Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}