import React, { useEffect, useState, useContext } from "react";

import * as dataHandler from "../helpers/dataHandler";
import { Container, Row, Col } from "react-bootstrap";

import Sidebar from "../components/shared/sidebar";
import DashboardProjectSummary from "../components/parts/dashboardProjectSummary";
import DashboardTasks from "../components/parts/dashboardTasks";
import DashboardReviews from "../components/parts/dashboardReviews";
import DashboardRecent from "../components/parts/dashboardRecent";

import { Auth } from "../context/AuthContext";

const Overview = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [nearDeadline, setNearDeadline] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [projectProgresses, setProjectProgresses] = useState([]);
  const [events, setEvents] = useState([]);

  //All Data
  const [allTasks, setAllTasks] = useState([]);

  const [isReset, callReset] = useState(false);

  const context = useContext(Auth);

  const getInitialProjectsData = (projects) => {
    // sort tasks in state by status
    const tasks = [];
    const todo = [];
    const inProgress = [];
    const inReview = [];
    const nearDeadline = [];
    const overDue = [];

    for (let i = 0; i < projects.length; i++) {
      console.log(i, "===i");
      for (let j = 0; j < projects[i].tasks.length; j++) {
        tasks.push(projects[i].tasks[j]);
        switch (projects[i].tasks[j].status) {
          case "to_do":
            todo.push(projects[i].tasks[j]);

            break;
          case "in_progress":
            inProgress.push(projects[i].tasks[j]);

            break;
          case "in_review":
            inReview.push(projects[i].tasks[j]);

            break;

          default:
            break;
        }
      }
    }
    console.log(inReview, "===inReview");
    setProjects(projects);
    setTodo(todo);
    setInProgress(inProgress);
    setInReview(inReview);
    setEvents(events);
  };

  useEffect(() => {
    (async () => {
      const projects = await dataHandler.show(
        `projects/user/${context.state.data.user.id}`
      );
      const events = await dataHandler.show(
        `events/user/${context.state.data.user.id}`
      );

      getInitialProjectsData(projects);

      //Calculate project progresses
      const projectProgresses = [];
      for (let i = 0; i < projects.length; i++) {
        const done = [];
        let projectProgress = 0;
        for (let j = 0; j < projects[i].tasks.length; j++) {
          if (projects[i].tasks[j].status === "done") {
            done.push(projects[i].tasks[j]);
          }
        }
        if (done.length < 1) {
          projectProgresses.push(0);
          continue;
        }

        console.log(done.length, projects[i].tasks.length, "===difference");
        projectProgress = Math.round(
          (done.length / projects[i].tasks.length) * 100
        );
        projectProgresses.push(projectProgress);
      }

      setProjectProgresses(projectProgresses);
    })();
  }, []);

  const resetData = () => {
    getInitialProjectsData(projects);
  };

  const changeProject = (project) => {
    console.log(project, "project change project");

    // sort tasks in state by status
    const tasks = [];
    const todo = [];
    const inProgress = [];
    const inReview = [];
    const nearDeadline = [];
    const overDue = [];

    for (let j = 0; j < project.tasks.length; j++) {
      tasks.push(project.tasks[j]);
      switch (project.tasks[j].status) {
        case "to_do":
          todo.push(project.tasks[j]);

          break;
        case "in_progress":
          inProgress.push(project.tasks[j]);

          break;
        case "in_review":
          inReview.push(project.tasks[j]);
          break;
        default:
          break;
      }
    }
    setTodo(todo);
    setInProgress(inProgress);
    setInReview(inReview);

    console.log(todo, inProgress, inReview);
  };

  return (
    <div className="d-flex">
      {/* <h1>Overview</h1> */}
      <Container>
        <Row>
          <Col lg={12}>
            <h1>Overview</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <DashboardProjectSummary
              projects={projects}
              projectProgresses={projectProgresses}
              todo={todo}
              inProgress={inProgress}
              inReview={inReview}
              changeProject={changeProject}
              resetData={resetData}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col lg={6}>
            <DashboardTasks
              projects={projects}
              projectProgresses={projectProgresses}
              todo={todo}
              inProgress={inProgress}
              inReview={inReview}
              changeProject={changeProject}
            />
          </Col>
          <Col lg={6}>
            <DashboardReviews
              projects={projects}
              projectProgresses={projectProgresses}
              todo={todo}
              inProgress={inProgress}
              inReview={inReview}
              setInReview={setInReview}
            />
          </Col>
        </Row>
      </Container>
      {/* <DashboardRecent events={events} /> */}
      {/* <button onClick={() => console.log(context.state)}></button> */}
    </div>
  );
};

export default Overview;
