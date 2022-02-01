import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import TasksList from "../components/parts/tasksList";

import * as datahandler from '../helpers/dataHandler';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [done, setDone] = useState([]);


  useEffect(() => {
    (async() => {
      const tasks = await this.datahandler('tasks')
      setTasks(tasks)
      
      const todo = tasks.filter((task) => task.status === 'to_do');
      const inProgress = tasks.filter((task) => task.status === 'in_progress');
      const inReview = tasks.filter((task) => task.status === 'in_review');
      const done = tasks.filter((task) => task.status === 'done');

      setTodo(todo);
      setInProgress(inProgress);
      setInReview(inReview);
      setDone(done);
    })()
  }, [])

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
            todo={todo}
            inProgress={inProgress}
            inReview={inReview}
            done={done}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Tasks;
