import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TopNav() {
  return (
    <div className="navigation clearfix">
      <h1 className="logo">X-Central</h1>
      <Navbar className="navlist">
        <Nav className="mr-auto">
          <NavLink className="nav-option" to="/">
            HOME &nbsp;
          </NavLink>
          <NavLink className="nav-option" to="/createPage">
            WORKSHOP &nbsp;
          </NavLink>
          <NavLink className="nav-option" to="/rankingPage">
            RANKING &nbsp;
          </NavLink>
        </Nav>
      </Navbar>
    </div>
  );
}