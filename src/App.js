import React from 'react';
import logo from './logo.svg';
import { Container, Row, Col } from 'react-bootstrap';
import DataTable from './components/DataTable';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Container fluid style={{background: "#f8f8f8"}}> 
      <Row>
        <Col>
        </Col>
        <Col style={{background: "white"}}>
          <DataTable />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
