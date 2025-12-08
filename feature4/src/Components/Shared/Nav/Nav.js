import { Link, useNavigate } from 'react-router-dom';
import { checkUser } from '../../Auth/AuthService';
import { useEffect, useState } from 'react';
import Parse from 'parse';

// routing with react links
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" className="logo">Literary Lounge</Link>
        
        {/* User Info - Left side of navbar */}
        {isAuthenticated && currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 15px',
            backgroundColor: 'rgba(42, 82, 152, 0.1)',
            borderRadius: '20px'
          }}>
            {currentUser.profilePicture && (
              <img
                src={currentUser.profilePicture}
                alt="Profile"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #2a5298'
                }}
              />
            )}
            <span style={{
              color: '#2a5298',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              @{currentUser.username}
            </span>
          </div>
        )}
      </div>
      
      <ul className="navigation">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#555',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#2a5298';
                  e.target.style.backgroundColor = 'rgba(42, 82, 152, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#555';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
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