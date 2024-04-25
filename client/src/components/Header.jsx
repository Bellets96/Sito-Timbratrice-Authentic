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

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand={"lg"} color={"dark"} dark={true}>
      <NavbarBrand as={Link} to="/">
        <img
          alt="logo"
          src="/logo.png"
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
          <NavItem>
            <NavLink className="nav-link" to="/">
              Homepage
            </NavLink>
          </NavItem>

          {user ? (
            <>
              {user.isAdmin && (
                <NavItem>
                  <NavLink className="nav-link" to="/user/admin/timbrature">
                    Timbrature
                  </NavLink>
                </NavItem>
              )}

              <NavItem>
                <NavLink className="nav-link" to="/user/logout">
                  Logout
                </NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink className="nav-link" to="/user/login">
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
