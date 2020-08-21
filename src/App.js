import React from 'react';
import logo from './logo.svg';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import DataTable from './components/DataTable';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddApplication from './components/AddApplication';

function App() {
  return (
    <Container fluid style={{background: "#f8f8f8", paddingRight: '0', paddingLeft: '0'}}> 
      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <img
          alt=""
          src="/logo.svg"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        Job Trackr
      </Navbar.Brand>
    </Navbar>
      <Container>
        <Row>
            <Col>
              <AddApplication />
              <DataTable />
            </Col>
          </Row>
      </Container>
    </Container>
  );
}

export default App;
