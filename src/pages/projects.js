import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import ProjectsList from "../components/parts/projectsList";

import * as dataHandler from "../helpers/dataHandler";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectProgresses, setProjectProgresses] = useState([]);

  useEffect(() => {
    (async () => {
      const projects = await dataHandler.show("projects");

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

      setProjects(projects);
      setProjectProgresses(projectProgresses);
    })();
  }, []);

  return (
    <div className="d-flex">
      <Container>
        <Row>
          <Col lg={12}>
            <h1>Projects</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ProjectsList
              projects={projects}
              projectProgresses={projectProgresses}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Projects;
