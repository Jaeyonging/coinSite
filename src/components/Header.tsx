import React, { useState } from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { FetchTodayDollar } from '../api';

export const Header = () => {
  let [dollar, setTodayDollar] = useState<number>(0)
  let navigate = useNavigate();
  FetchTodayDollar()
    .then((dollar) => {
      setTodayDollar(dollar);
    })
    .catch((error) => {
      setTodayDollar(1389.0);
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
    </>)
}
