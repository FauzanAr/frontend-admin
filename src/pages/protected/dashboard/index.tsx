import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../sidebar';
import LastLoginCard from '../last-login';
import Overview from '../overview';
import Footer from '../footer';
import styles from './dashboard.module.css';

type DashboardProps = React.PropsWithChildren<{}>;

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
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