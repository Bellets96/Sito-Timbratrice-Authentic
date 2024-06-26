import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { useAuth } from "../context/AuthContext";

import config from "../config.json";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand={"lg"} color={"dark"} dark={true}>
      <NavbarBrand as={Link} to="/bollatrice">
        <img
          alt="logo"
          src="logo.png"
          style={{
            height: 60,
          }}
        />
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink
              className="nav-link"
              target="_blank"
              to="http://authenticremastered.it"
            >
              Authentic Remastered
            </NavLink>
          </NavItem>

          {user ? (
            <>
              {user.isAdmin && (
                <NavItem>
                  <NavLink
                    className="nav-link"
                    to="/bollatrice/user/admin/timbrature"
                  >
                    Timbrature
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink className="nav-link" to="/bollatrice/user/profilo">
                  Dashboard Profilo
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className="nav-link" to="/bollatrice/user/logout">
                  Logout
                </NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink className="nav-link" to={config.discordUri}>
                  Login via discord
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Header;
