import React from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    let navigate = useNavigate();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={((e) => navigate("/"))}>Kimchi coin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={((e) => navigate("/"))}>Home</Nav.Link>
            <Nav.Link onClick={((e) => navigate("/list"))}>Charts</Nav.Link>
            <Nav.Link onClick={((e) => navigate("/draw"))}>Draw</Nav.Link>
            <Nav.Link onClick={((e) => navigate("/movie"))}>Movie</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>  )
}
