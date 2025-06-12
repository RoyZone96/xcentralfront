import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./TopNav.css";
import logo from "../../images/logo.png";

const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setHasToken(false);
    navigate("/login");
  };

  return (
    <Navbar className="clearfix">
      <div className="logo">
        <img src={logo} alt="xcentral log" className="logo-img" />
      </div>
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
          <span className="nav-option logout-link" onClick={handleLogout} style={{ cursor: "pointer" }}>
            LOGOUT &nbsp;
          </span>
        )}
      </Nav>
      {menuOpen && (
        <div className="dropdown-menu">
          <NavLink className="nav-option" to="/" onClick={toggleMenu}>
            HOME &nbsp;
          </NavLink>
          {hasToken && (
            <>
              <NavLink className="nav-option" to="/createPage" onClick={toggleMenu}>
                WORKSHOP &nbsp;
              </NavLink>
              <NavLink className="nav-option" to="/myPage" onClick={toggleMenu}>
                MY PAGE &nbsp;
              </NavLink>
            </>
          )}
          <NavLink
            className="nav-option"
            to="/rankingPage"
            onClick={toggleMenu}
          >
            RANKING &nbsp;
          </NavLink>
          {!hasToken && (
            <>
              <NavLink
                className="nav-option"
                to="/registration"
                onClick={toggleMenu}
              >
                REGISTER &nbsp;
              </NavLink>
              <NavLink className="nav-option" to="/login" onClick={toggleMenu}>
                LOGIN &nbsp;
              </NavLink>
            </>
          )}
          {hasToken && (
            <span
              className="nav-option logout-link"
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              style={{ cursor: "pointer" }}
            >
              LOGOUT &nbsp;
            </span>
          )}
        </div>
      )}
    </Navbar>
  );
};

export default TopNav;