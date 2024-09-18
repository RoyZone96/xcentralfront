import { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import LogoutButton from "./Logout";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TopNav() {
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const hasToken = localStorage.getItem("token");

  return (
    <div className="navigation clearfix">
      <h1 className="logo">X-Central</h1>
      <Navbar className="navlist">
        <Nav className="mr-auto">
          <NavLink className="nav-option" to="/">
            HOME &nbsp;
          </NavLink>
          {hasToken && (
            <>
              <NavLink className="nav-option" to="/myPage">
                MY PAGE &nbsp;
              </NavLink>
              <NavLink className="nav-option" to="/createPage">
                WORKSHOP &nbsp;
              </NavLink>
              
            </>
          )}
          {/* see the rankings regardless of login status */}
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
      </Navbar>
    </div>
  );
}
