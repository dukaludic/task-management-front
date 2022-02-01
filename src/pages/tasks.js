import React from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import TasksList from "../components/parts/tasksList";

function Tasks() {
  return (
    <div className="d-flex">
      <Sidebar />
      <Container style={{ margin: "0 50px 50px 350px" }}>
        <Row>
          <Col lg={12}>
            <h1>All Tasks</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <TasksList />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Tasks;
