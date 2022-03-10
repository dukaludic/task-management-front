import React, { useEffect, useState, useContext } from "react";

import * as dataHandler from "../helpers/dataHandler";
import { Container, Row, Col } from "react-bootstrap";

import Sidebar from "../components/shared/sidebar";
import DashboardProjectSummary from "../components/parts/dashboardProjectSummary";
import DashboardTasks from "../components/parts/dashboardTasks";
import DashboardReviews from "../components/parts/dashboardReviews";
import DashboardRecent from "../components/parts/dashboardRecent";
import moment from "moment";

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

  const sortProjectsData = (projects) => {
    let today = Date.parse(new Date());
    let inSevenDays = Date.parse(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    // sort tasks in state by status
    const tasks = [];
    const todo = [];
    const inProgress = [];
    const inReview = [];
    const nearDeadline = [];
    const overDue = [];

    for (let i = 0; i < projects.length; i++) {
      for (let j = 0; j < projects[i].tasks.length; j++) {
        const dueDate = Date.parse(projects[i].tasks[j].due_date);
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
        if (!projects[i].tasks[j].due_date) continue;
        if (dueDate < today) {
          console.log(projects[i].tasks[j].title);
          overdue.push(projects[i].tasks[j]);
        } else if (dueDate < inSevenDays) {
          console.log(projects[i].tasks[j].title);
          nearDeadline.push(projects[i].tasks[j]);
        }
      }
    }
    console.log(overdue, nearDeadline, "overdue nearDeadline");
    setProjects(projects);
    setTodo(todo);
    setInProgress(inProgress);
    setInReview(inReview);
    setEvents(events);
    setOverdue(overdue);
    setNearDeadline(nearDeadline);
    console.log(nearDeadline, "nearDeadline");
  };

  useEffect(() => {
    (async () => {
      const projects = await dataHandler.show(
        `projects/user/${context.state.data.user.id}`
      );
      const events = await dataHandler.show(
        `events/user/${context.state.data.user.id}`
      );

      sortProjectsData(projects);

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

        projectProgress = Math.round(
          (done.length / projects[i].tasks.length) * 100
        );
        projectProgresses.push(projectProgress);
      }

      setProjectProgresses(projectProgresses);
    })();
  }, []);

  const resetData = () => {
    sortProjectsData(projects);
  };

  const changeProject = (project) => {
    // sort tasks in state by status

    let today = Date.parse(new Date());
    let inSevenDays = Date.parse(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    const tasks = [];
    const todo = [];
    const inProgress = [];
    const inReview = [];
    const nearDeadline = [];
    const overDue = [];

    for (let j = 0; j < project.tasks.length; j++) {
      const dueDate = Date.parse(project.tasks[j].due_date);
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
      if (!project.tasks[j].due_date) continue;
      if (dueDate < today) {
        console.log(project.tasks[j].title);
        overdue.push(project.tasks[j]);
      } else if (dueDate < inSevenDays) {
        console.log(project.tasks[j].title);
        nearDeadline.push(project.tasks[j]);
      }
    }
    setTodo(todo);
    setInProgress(inProgress);
    setInReview(inReview);
    setOverdue(overdue);
    setNearDeadline(nearDeadline);
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
              nearDeadline={nearDeadline}
              overdue={overdue}
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
    </div>
  );
};

export default Overview;
