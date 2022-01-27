import React, { useEffect, useState } from "react";
import * as dataHandler from "../../helpers/dataHandler";

function ProjectSummary() {
  useEffect(async () => {
    const projects = await dataHandler.show("projects");

    console.log(projects, "===projects");
  }, []);

  return (
    <>
      <h1>Project Summary</h1>
      <div className="project-summary-card">
        <div className="project-summary-titles d-flex">
          <div>Name</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Progress</div>
        </div>
      </div>
    </>
  );
}

export default ProjectSummary;
