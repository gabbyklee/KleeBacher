import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Literary Lounge</Link>
      <ul className="navigation">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Nav;