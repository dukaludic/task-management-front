import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import TasksList from "../components/parts/tasksList";

import * as datahandler from "../helpers/dataHandler";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    console.log("refetch");
    (async () => {
      const tasks = await datahandler.show("tasks");
      setTasks(tasks);
    })();
  }, []);

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
            <TasksList
              tasks={tasks}
              todo={todo}
              inProgress={inProgress}
              inReview={inReview}
              done={done}
              setTodo={setTodo}
              setInProgress={setInProgress}
              setInReview={setInReview}
              setDone={setDone}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Tasks;
