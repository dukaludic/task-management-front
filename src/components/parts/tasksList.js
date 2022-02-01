import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";

function TasksList(props) {
  return (
    <Container>
      <Row>
        <Col>
          <div>
            <h3>To do</h3>
            <p>3 tasks available</p>
          </div>
          <div className="add-new-task-btn"></div>

          <div>
            <hr></hr>
          </div>
        </Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default TasksList;
