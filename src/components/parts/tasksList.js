import React from "react";
import { Container, Col, Row } from "react-bootstrap";
// import { BsThreeDotsVertical } from "react-icons/bs";

function TasksList(props) {

  console.log(props.inProgress)
  return (
    <Container>
      <Row>
        <Col>
          <div>
            <h3>To do</h3>
            <p>3 tasks available</p>
          </div>
          <div className="add-new-task-btn"></div>
          {props.todo.map((item) => {
            return (
              <div>
                <hr></hr>
                <h3>{item.title}</h3>
              </div>
            )
          })}
          
        </Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default TasksList;
