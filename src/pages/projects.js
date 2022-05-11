import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import ProjectsList from "../components/parts/projectsList";

import * as datahandler from "../helpers/dataHandler";
import { Auth } from "../context/AuthContext";
import NewProjectMenu from "../components/parts/newProjectMenu";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectProgresses, setProjectProgresses] = useState([]);
  const [reloadCounter, reload] = useState(0);
  const [newProjectMenuOpen, setNewProjectMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [newProjectId, setNewProjectId] = useState("");
  const authContext = useContext(Auth);

  const loadProjects = async () => {
    const projects = await datahandler.show(
      "projects/projects_page",
      authContext
    );
    setProjects(projects);
    return projects;
  };

  useEffect(() => {
    (async () => {
      const projects = await loadProjects();

      setIsLoading(false);
      const users = [];
      for (let i = 0; i < projects?.length; i++) {
        for (let j = 0; j < projects[i].assigned_users.length; j++) {
          const user = projects[i].assigned_users[j];
          users.push(user);
        }
      }

      console.log(users, "===users");

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

  useEffect(async () => {
    if (!newProjectId) {
      return;
    }
    console.log(newProjectId, "id");
    const newProject = await datahandler.showSingle(
      "projects/single",
      newProjectId
    );
    console.log(newProject, "newProject");
    setProjects((prevState) => [...prevState, newProject]);
    setProjectsLoading(false);
  }, [newProjectId]);

  return (
    <>
      <Container>
        <Row>
          <Col lg={12}>
            <h1 className="h-1 main-heading">Projects</h1>
          </Col>
        </Row>
        {isLoading ? (
          <Spinner
            style={{ marginTop: "20px" }}
            variant="dark"
            animation="border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <div className="d-flex">
            <Row>
              <Col lg={12}>
                <div className="card-container">
                  <ProjectsList
                    projects={projects}
                    projectProgresses={projectProgresses}
                    reloadCounter={reloadCounter}
                    reload={reload}
                    // projectsLoading={projectsLoading}
                  />
                </div>
              </Col>
              <Col>
                {newProjectMenuOpen &&
                  authContext.state.data.user.role === "project_manager" && (
                    <NewProjectMenu
                      setNewProjectMenuOpen={setNewProjectMenuOpen}
                      setProjects={setProjects}
                      reload={reload}
                      setNewProjectId={setNewProjectId}
                    />
                  )}
                {!newProjectMenuOpen &&
                  authContext.state.data.user.role === "project_manager" && (
                    <button
                      className="btn-default-g mt-4"
                      onClick={() => setNewProjectMenuOpen(true)}
                    >
                      New Project
                    </button>
                  )}
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
}

export default Projects;
