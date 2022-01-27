import React from "react";
import ProjectSummary from "../components/parts/projectSummary";

import Sidebar from "../components/shared/sidebar";

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ width: "100%" }}>
        <h1>Dashboard</h1>
        <ProjectSummary />
      </div>
    </div>
  );
};

export default Dashboard;
