import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import TasksList from "../components/parts/tasksList";

import * as datahandler from "../helpers/dataHandler";

import { Auth } from "../context/AuthContext";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [done, setDone] = useState([]);

  const authContext = useContext(Auth);

  const { user } = authContext.state.data;

  useEffect(() => {
    console.log("refetch");
    (async () => {
      const tasks = await datahandler.show(
        `tasks/user/${user._id}`,
        authContext
      );
      console.log(tasks, "TASKS");
      setTasks(tasks);
    })();
  }, []);

  return (
    <div className="d-flex">
      <Container>
        <Row>
          <Col lg={12}>
            <h1 className="main-heading h-1">All Tasks</h1>
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
