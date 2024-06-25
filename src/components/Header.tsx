import React, { useState } from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { FetchTodayDollar } from '../api';

export const Header = () => {
  let [dollar, setTodayDollar] = useState(0)
  let navigate = useNavigate();
  FetchTodayDollar()
    .then((dollar) => {
      setTodayDollar(dollar);
    })
    .catch((error) => {
      setTodayDollar(1390);
      console.log("Error fetching today's dollar:", error);
    });
  return (
    <>
      <div className='nav-bank'>
        <div>오늘의 달러: </div>
        <span>
          {dollar}원
        </span>
      </div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand onClick={((e) => navigate("/"))}>Kimchi coin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className='navbar' id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={((e) => navigate("/"))}>Home</Nav.Link>
              <Nav.Link onClick={((e) => navigate("/socket"))}>Socket</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>)
}
