import React, { useEffect, useState, useContext } from "react";

import * as dataHandler from "../helpers/dataHandler";
import { Container, Row, Col } from "react-bootstrap";

import Sidebar from "../components/shared/sidebar";
import DashboardProjectSummary from "../components/parts/dashboardProjectSummary";
import DashboardTasks from "../components/parts/dashboardTasks";
import DashboardReviews from "../components/parts/dashboardReviews";
import DashboardRecent from "../components/parts/dashboardRecent";

import Projects from "../pages/projects";
import Tasks from "../pages/tasks";
import TaskSingle from "../pages/task.single";
import ProjectSingle from "../pages/project.single";

import { Auth } from "../context/AuthContext";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";
import Overview from "./overview";

const Dashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(true);

  return (
    <>
      <Sidebar setSidebarActive={setSidebarActive} />
      <div className={`shadow-sidebar${sidebarActive ? "-active" : ""}`}>
        <Routes>
          <Route exact path="/dashboard" element={<Overview />}></Route>
          <Route exact path="/projects" element={<Projects />}></Route>
          <Route exact path="/tasks" element={<Tasks />}></Route>
          <Route exact path="/task/:_id" element={<TaskSingle />}></Route>
          <Route exact path="/project/:_id" element={<ProjectSingle />}></Route>
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
