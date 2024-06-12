import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import '../styles/Navbar.css'

export default function Nav() {
  const { user, setUser } = useContext(UserContext);
  const is_gamepublisher = user && user.is_gamepublisher === 1;//game publisher ekenin tekseredi, true bolsa {is_gamepublisher && ...} osy zherde react && keiin zhazylganyn oryndaidy
  return (
    <nav className="nav">
      <ul className="site-title">
        <Link to="/">Oiynazar</Link>
      </ul>
      <ul className="left-links">
        <CustomLink to="/">Home</CustomLink>
        {user && <CustomLink to="/library">Library</CustomLink>}
        {is_gamepublisher && <CustomLink to="/myGames">My Games</CustomLink>}
        <CustomLink to ="/more">More</CustomLink>
      </ul>
      <ul className="right-links">
        {user ? (
          <li><Link to="/logout">Log Out</Link></li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
