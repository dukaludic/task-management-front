import React, { useEffect, useState, useContext } from "react";

import * as dataHandler from "../helpers/dataHandler";
import { Container, Row, Col } from "react-bootstrap";

import Sidebar from "../components/shared/sidebar";
import DashboardProjectSummary from "../components/parts/dashboardProjectSummary";
import DashboardTasks from "../components/parts/dashboardTasks";
import DashboardReviews from "../components/parts/dashboardReviews";
import DashboardRecent from "../components/parts/dashboardRecent";
import moment from "moment";

import { useNavigate } from "react-router-dom";

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

  const [projectSelected, setProjectSelected] = useState("All Projects");

  const [userOnlyTasks, setUserOnlyTasks] = useState(false);

  const [userTasks, setUserTasks] = useState([]);
  const [userTodo, setUserTodo] = useState([]);
  const [userInProgress, setUserInProgress] = useState([]);
  const [userInReview, setUserInReview] = useState([]);
  const [userNearDeadline, setUserNearDeadline] = useState([]);
  const [userOverdue, setUserOverdue] = useState([]);

  // Reviews (not tasks in review)
  const [reviews, setReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

  //All Data
  const [chartMax, setChartMax] = useState([]);

  const [isReset, callReset] = useState(false);

  const authContext = useContext(Auth);
  const { user } = authContext.state.data;
  const navigate = useNavigate();

  const sortProjectsData = (projects) => {
    let today = Date.parse(new Date());
    let inSevenDays = Date.parse(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    console.log(projects, "PROJECTS");

    // sort tasks in state by status
    const tasks = [];
    const todo = [];
    const inProgress = [];
    const inReview = [];
    const nearDeadline = [];
    const overdue = [];

    // Only active user tasks
    const userTasks = [];
    const userTodo = [];
    const userInProgress = [];
    const userInReview = [];
    const userNearDeadline = [];
    const userOverdue = [];

    for (let i = 0; i < projects.length; i++) {
      for (let j = 0; j < projects[i].tasks.length; j++) {
        //If only active user tasks are enabled otherwise whole project
        // if (userOnlyTasks === "user") {
        //   //if user doesn't exist in this task's assigned users array
        //   if (!projects[i].tasks[j].assigned_users.includes(user._id)) {
        //     continue;
        //   }
        // }

        const dueDate = Date.parse(projects[i].tasks[j].due_date);
        tasks.push(projects[i].tasks[j]);

        console.log(projects[i].tasks[j].assigned_users, "TEST USERTASKS");

        switch (projects[i].tasks[j].status) {
          case "to_do":
            todo.push(projects[i].tasks[j]);

            console.log(projects[i].tasks[j].assigned_users, "USER");

            // if (
            //   projects[i].tasks[j].assigned_users.some(
            //     (el) => el._id === user._id
            //   )
            // ) {
            //   userTodo.push(projects[i].tasks[j]);
            //   console.log("userTodo");
            // }

            if (projects[i].tasks[j].assigned_users.includes(user._id)) {
              userTodo.push(projects[i].tasks[j]);
            }

            break;
          case "in_progress":
            inProgress.push(projects[i].tasks[j]);

            // if (
            //   projects[i].tasks[j].assigned_users.some(
            //     (el) => el.username === user.username
            //   )
            // ) {
            //   userInProgress.push(projects[i].tasks[j]);
            // }

            if (projects[i].tasks[j].assigned_users.includes(user._id)) {
              userInProgress.push(projects[i].tasks[j]);
            }

            break;
          case "in_review":
            inReview.push(projects[i].tasks[j]);

            // if (
            //   projects[i].tasks[j].assigned_users.some(
            //     (el) => el.username === user.username
            //   )
            // ) {
            //   userInReview.push(projects[i].tasks[j]);
            // }

            if (projects[i].tasks[j].assigned_users.includes(user._id)) {
              userInReview.push(projects[i].tasks[j]);
            }
            break;
          // case "done":
          //   if (
          //     user.role === "worker" &&
          //     projects[i].tasks[j].still_visible_to_worker
          //   ) {
          //     inReview.push(projects[i].tasks[j]);

          //     if (
          //       projects[i].tasks[j].assigned_users.some(
          //         (el) => el.username === user.username
          //       )
          //     ) {
          //       userInReview.push(projects[i].tasks[j]);
          //     }
          //   }
          //   break;

          default:
            break;
        }
        if (
          !projects[i].tasks[j].due_date ||
          projects[i].tasks[j].status === "done"
        ) {
          continue;
        } else if (dueDate < today) {
          console.log(projects[i].tasks[j].title);
          overdue.push(projects[i].tasks[j]);

          // if (
          //   projects[i].tasks[j].assigned_users.some(
          //     (el) => el.username === user.username
          //   )
          // ) {
          //   userOverdue.push(projects[i].tasks[j]);
          // }
          if (projects[i].tasks[j].assigned_users.includes(user._id)) {
            userOverdue.push(projects[i].tasks[j]);
          }
        } else if (dueDate < inSevenDays) {
          console.log(projects[i].tasks[j].title);

          nearDeadline.push(projects[i].tasks[j]);

          // if (
          //   projects[i].tasks[j].assigned_users.some(
          //     (el) => el.username === user.username
          //   )
          // ) {
          //   userNearDeadline.push(projects[i].tasks[j]);
          // }

          if (projects[i].tasks[j].assigned_users.includes(user._id)) {
            userNearDeadline.push(projects[i].tasks[j]);
          }
        }
      }
    }
    setProjects(projects);
    setTodo(todo);
    setInProgress(inProgress);
    setInReview(inReview);
    setEvents(events);
    setOverdue(overdue);
    setNearDeadline(nearDeadline);

    console.log(userTodo, "=====userTodo");

    //Set dynamically chart's fixed Y axis
    let max = todo.length + inProgress.length + inReview.length;
    setChartMax(max);

    setUserTodo(userTodo);
    setUserInProgress(userInProgress);
    setUserInReview(userInReview);
    setUserOverdue(userOverdue);
    setUserNearDeadline(userNearDeadline);
  };

  useEffect(() => {
    (async () => {
      console.log(user, "user");
      const projects = await dataHandler.show(
        `projects/user/overview/${authContext.state.data.user._id}`,
        authContext
      );

      console.log(projects, "projects");

      // const events = await dataHandler.show(
      //   `events/user/${authContext.state.data.user._id}`,
      //   authContext
      // );

      let reviews = await dataHandler.show(
        `reviews/user/${authContext.state.data.user._id}`,
        authContext
      );

      if (user.role === "project_manager") {
        reviews = reviews.filter((el) => el.approval === "pending");
      }

      console.log(reviews, "reviews");

      setReviews(reviews);

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
    setProjectSelected("All Projects");
    sortProjectsData(projects);
  };

  const toggleUserProjectTasks = () => {
    console.log("roggle");
    setUserOnlyTasks(!userOnlyTasks);
  };

  const changeProject = (project) => {
    // sort tasks in state by status
    setProjectSelected(project.title);

    let today = Date.parse(new Date());
    let inSevenDays = Date.parse(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    const tasks = [];
    const todo = [];
    const inProgress = [];
    const inReview = [];
    const nearDeadline = [];
    const overdue = [];

    const userTodo = [];
    const userInProgress = [];
    const userInReview = [];
    const userNearDeadline = [];
    const userOverdue = [];

    for (let j = 0; j < project.tasks.length; j++) {
      const dueDate = Date.parse(project.tasks[j].due_date);
      tasks.push(project.tasks[j]);
      console.log(project.tasks[j], "project.tasks[j]");
      switch (project.tasks[j].status) {
        case "to_do":
          todo.push(project.tasks[j]);

          if (project.tasks[j].assigned_users.some((el) => el === user._id)) {
            userTodo.push(project.tasks[j]);
          }

          break;
        case "in_progress":
          inProgress.push(project.tasks[j]);

          if (project.tasks[j].assigned_users.some((el) => el === user._id)) {
            userInProgress.push(project.tasks[j]);
          }

          break;
        case "in_review":
          inReview.push(project.tasks[j]);

          if (project.tasks[j].assigned_users.some((el) => el === user._id)) {
            userInReview.push(project.tasks[j]);
          }

          break;

        // case "done":
        //   if (
        //     user.role === "worker" &&
        //     project.tasks[j].still_visible_to_worker
        //   ) {
        //     inReview.push(project.tasks[j]);

        //     if (
        //       project.tasks[j].assigned_users.some(
        //         (el) => el.username === user.username
        //       )
        //     ) {
        //       userInReview.push(project.tasks[j]);
        //     }
        //   }
        //   break;
        default:
          break;
      }
      if (!project.tasks[j].due_date || project.tasks[j].status === "done")
        continue;
      if (dueDate < today) {
        overdue.push(project.tasks[j]);

        if (project.tasks[j].assigned_users.some((el) => el === user._id)) {
          userOverdue.push(project.tasks[j]);
        }
      } else if (dueDate < inSevenDays) {
        nearDeadline.push(project.tasks[j]);

        if (project.tasks[j].assigned_users.some((el) => el === user._id)) {
          userNearDeadline.push(project.tasks[j]);
        }
      }
    }
    setTodo(todo);
    setInProgress(inProgress);
    setInReview(inReview);
    setOverdue(overdue);
    setNearDeadline(nearDeadline);

    console.log(userTodo, "userTodo");

    setUserTodo(userTodo);
    setUserInProgress(userInProgress);
    setUserInReview(userInReview);
    setUserOverdue(userOverdue);
    setUserNearDeadline(userNearDeadline);
  };

  return (
    <div className="d-flex">
      {/* <h1>Overview</h1> */}
      <Container>
        <Row>
          <Col lg={12}>
            <h1 className="h-1 main-heading">Dashboard</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <DashboardProjectSummary
              projectSelected={projectSelected}
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
          <Col className="overview-col-l" lg={6}>
            <DashboardTasks
              projectSelected={projectSelected}
              toggleUserProjectTasks={toggleUserProjectTasks}
              projects={projects}
              projectProgresses={projectProgresses}
              todo={userOnlyTasks ? userTodo : todo}
              inProgress={userOnlyTasks ? userInProgress : inProgress}
              inReview={userOnlyTasks ? userInReview : inReview}
              nearDeadline={userOnlyTasks ? userNearDeadline : nearDeadline}
              overdue={userOnlyTasks ? userOverdue : overdue}
              changeProject={changeProject}
              userOnlyTasks={userOnlyTasks}
              setUserOnlyTasks={setUserOnlyTasks}
              chartMax={chartMax}
            />
          </Col>
          <Col className="overview-col-r" lg={6}>
            <DashboardReviews
              projects={projects}
              projectProgresses={projectProgresses}
              todo={todo}
              inProgress={inProgress}
              inReview={userOnlyTasks ? userInReview : inReview}
              userInReview={userInReview}
              setInReview={setInReview}
              setUserInReview={setUserInReview}
              reviews={reviews}
              setReviews={setReviews}
              userReviews={userReviews}
              setUserReviews={setUserReviews}
            />
          </Col>
        </Row>
      </Container>
      {/* <DashboardRecent events={events} /> */}
    </div>
  );
};

export default Overview;
