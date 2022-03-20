import React, { useEffect, useState } from "react";
import * as dataHandler from "../../helpers/dataHandler";
import { Container, Col, Row } from "react-bootstrap";

import DashboardTasks from "./dashboardTasks";

import moment from "moment";

function DashboardProjectSummary(props) {
  return (
    <div container={true}>
      <Row></Row>
      <Row>
        <Col style={{ padding: 0 }} lg={12}>
          <div className="card-container">
            <h3 className="h-3 card-title">Project Summary</h3>
            <div className="card-content">
              <div className="project-summary-titles b-2-bold">
                <div>Name</div>
                <div>Start</div>
                <div>End</div>
                <div>Progress</div>
              </div>
              {props.projects.length < 1 && (
                <p>You are currently not assigned to any project</p>
              )}
              {props.projects.map((project, index) => {
                return (
                  <div key={index} className="project-summary-item">
                    <div
                      onClick={() => props.changeProject(project)}
                      style={{ cursor: "pointer" }}
                      className={
                        props.projectSelected === project.title &&
                        `project-title-selected`
                      }
                    >
                      {project.title}
                    </div>
                    <div>{moment(project.start_date).format("MMM Do YY")}</div>
                    <div>{moment(project.end_date).format("MMM Do YY")}</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-whole"></div>
                      <div
                        style={{ width: `${props.projectProgresses[index]}%` }}
                        className="progress-bar"
                      ></div>
                      <span>{`${props.projectProgresses[index]}%`}</span>
                    </div>
                  </div>
                );
              })}
              <p
                style={{ cursor: "pointer" }}
                className={
                  props.projectSelected === "All Projects" &&
                  "project-title-selected"
                }
                onClick={() => props.resetData()}
              >
                All Projects
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardProjectSummary;
