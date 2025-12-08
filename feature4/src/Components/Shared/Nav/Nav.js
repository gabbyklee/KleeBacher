import { Link, useNavigate } from 'react-router-dom';
import { checkUser } from '../../Auth/AuthService';
import { useEffect, useState } from 'react';
import Parse from 'parse';

const Nav = () => {
  const navigate = useNavigate();
  const isAuthenticated = checkUser();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const user = Parse.User.current();
      if (user) {
        setCurrentUser({
          username: user.get('username'),
          profilePicture: user.get('profilePicture') || ''
        });
      }
    } else {
      setCurrentUser(null);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
      alert('Logged out successfully!');
      navigate('/auth');
    } catch (error) { 
      alert(`Error logging out: ${error.message}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Literary Lounge</Link>
        
        {/* User Info - Left side of navbar */}
        {isAuthenticated && currentUser && (
          <div className="navbar-user-info">
            {currentUser.profilePicture && (
              <img
                src={currentUser.profilePicture}
                alt="Profile"
                className="navbar-user-avatar"
              />
            )}
            <span className="navbar-username">
              @{currentUser.username}
            </span>
          </div>
        )}
      </div>
      
      <ul className="navigation">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/friends">Friends</Link></li>
        
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/auth">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;