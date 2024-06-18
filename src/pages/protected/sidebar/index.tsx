import React from 'react'
import { Nav, Image } from 'react-bootstrap';
import { HouseDoor, CalendarCheck, ClipboardPulse } from 'react-bootstrap-icons';
import { Link, useLocation } from 'react-router-dom';
import styles from './sidebar.module.css';

function Sidebar() {
  const location = useLocation();
  return (
    <Nav defaultActiveKey="/dashboard/home" className={`flex-column ${styles.sidebar}`}>
      <Nav.Item className={styles.logoItem}>
        <img src='/bank.png' alt='Logo' className={styles.logo} />
      </Nav.Item>
      <Nav.Item>
        <Image src=''></Image>
        <Link to="/dashboard/home" className={`${styles.link} ${location.pathname === '/dashboard/home' ? styles.active : ''}`}>
          <HouseDoor /> Home
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/dashboard/create-transaction" className={`${styles.link} ${location.pathname === '/dashboard/create-transaction' ? styles.active : ''}`}>
          <ClipboardPulse /> Create Transaction
        </Link>
      </Nav.Item>
    </Nav>
  )
}

export default Sidebar