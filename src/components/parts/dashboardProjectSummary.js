import React, { useEffect, useState } from "react";
import * as dataHandler from "../../helpers/dataHandler";
import { Container, Col, Row } from "react-bootstrap";

import DashboardTasks from "./dashboardTasks";

import moment from "moment";

function DashboardProjectSummary(props) {
  return (
    <div container={true}>
      <Row>
        <h3>Project Summary</h3>
      </Row>
      <Row>
        <Col lg={12} className="project-summary-card col-6">
          <div className="project-summary-titles">
            <div>Name</div>
            <div>Start</div>
            <div>End</div>
            <div>Progress</div>
          </div>
          {props.projects.map((project, index) => {
            return (
              <div key={index} className="project-summary-item">
                <div>{project.title}</div>
                <div>{moment(project.start_date).format("MMM Do YY")}</div>
                <div>{moment(project.end_date).format("MMM Do YY")}</div>
                <div>{props.projectProgresses[index]}</div>
              </div>
            );
          })}
        </Col>
      </Row>
    </div>
  );
}

export default DashboardProjectSummary;
