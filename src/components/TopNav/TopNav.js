import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import LogoutButton from '../Logout';
import './TopNav.css';

const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Navbar className="clearfix">
      <div className="logo">XCentral</div>
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>
      <Nav className="navlist">
        <NavLink className="nav-option" to="/">
          HOME &nbsp;
        </NavLink>
        {hasToken && (
          <>
            <NavLink className="nav-option" to="/createPage">
              WORKSHOP &nbsp;
            </NavLink>
            <NavLink className="nav-option" to="/myPage">
              MY PAGE &nbsp;
            </NavLink>
          </>
        )}
        <NavLink className="nav-option" to="/rankingPage">
          RANKING &nbsp;
        </NavLink>
        {!hasToken && (
          <>
            <NavLink className="nav-option" to="/registration">
              REGISTER &nbsp;
            </NavLink>
            <NavLink className="nav-option" to="/login">
              LOGIN &nbsp;
            </NavLink>
          </>
        )}
        {hasToken && (
          <>
            <LogoutButton />
          </>
        )}
      </Nav>
      {menuOpen && (
        <div className="dropdown-menu">
          <NavLink className="nav-option" to="/" onClick={toggleMenu}>
            HOME &nbsp;
          </NavLink>
          {hasToken && (
          <>
            <NavLink className="nav-option" to="/createPage">
              WORKSHOP &nbsp;
            </NavLink>
            <NavLink className="nav-option" to="/myPage">
              MY PAGE &nbsp;
            </NavLink>
          </>
        )}
          <NavLink className="nav-option" to="/rankingPage" onClick={toggleMenu}>
            RANKING &nbsp;
          </NavLink>
          {!hasToken && (
            <>
              <NavLink className="nav-option" to="/registration" onClick={toggleMenu}>
                REGISTER &nbsp;
              </NavLink>
              <NavLink className="nav-option" to="/login" onClick={toggleMenu}>
                LOGIN &nbsp;
              </NavLink>
            </>
          )}
          {hasToken && (
            <>
              <LogoutButton />
            </>
          )}
        </div>
      )}
    </Navbar>
  );
};

export default TopNav;