import React from 'react';
import logo from './logo.svg';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import ApplicationManager from './components/ApplicationManager';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Container fluid style={{background: "#f8f8f8", paddingRight: '0', paddingLeft: '0'}}> 
      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        Job Trackr
      </Navbar.Brand>
    </Navbar>
      <Container>
        <Row>
            <Col>
              <ApplicationManager />
            </Col>
          </Row>
      </Container>
    </Container>
  );
}

export default App;
