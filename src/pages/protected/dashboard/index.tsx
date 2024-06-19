import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Sidebar from '../sidebar';
import LastLoginCard from '../last-login';
import Footer from '../footer';
import styles from './dashboard.module.css';
import _ from 'lodash';
import { getUser } from '../../../api/user/getUser';
import { localStorageKey } from '../../constanta';
import Response from '../../../api/response';

type DashboardProps = React.PropsWithChildren<{}>;

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const object = localStorage.getItem(localStorageKey.USER_DATA) ? JSON.parse(localStorage.getItem(localStorageKey.USER_DATA) || '') : {};
  const [user, setUser] = useState(object);
  const navigate = useNavigate();

  useEffect(() => {
    if (_.isEmpty(user)) {
      getUser({token: localStorage.getItem(localStorageKey.JWT) || ''})
        .then((res: Response) => {
          if (res.success) {
            localStorage.setItem(localStorageKey.USER_DATA, JSON.stringify(res.data))
            setUser(res.data);
          }
        })
    }
  })

  const onLogout = () => {
    navigate('/')
  }

  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col md={2} className={styles.sidebarCol}>
            <Sidebar />
          </Col>
          <Col md={{ span: 10, offset: 2 }} className={styles.mainContent}>
            <Row className="mt-4">
              <Col>
                <div className={styles.logoutContent}>
                  <p>[{user.userId}]</p>
                  <button className={styles.logoutButton} onClick={onLogout}>
                    Logout
                  </button>
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <LastLoginCard />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                {children}
              </Col>
            </Row>
            <Row>
              <Col>
                <Footer />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;