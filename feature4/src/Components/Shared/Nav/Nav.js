import { Link, useNavigate } from 'react-router-dom';
import { checkUser } from '../../Auth/AuthService';
import Parse from 'parse';

// routing with react links
const Nav = () => {
  const navigate = useNavigate();
  const isAuthenticated = checkUser();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      alert('Logged out successfully!');
      navigate('/auth');
    } catch (error) { 
      alert(`Error logging out: ${error.message}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Literary Lounge</Link>
      <ul className="navigation">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/bookclub">Book Club</Link></li>
        
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;