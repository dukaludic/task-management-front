import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import * as dataHandler from "../helpers/dataHandler";

import Sidebar from "../components/shared/sidebar";
import TasksList from "../components/parts/tasksList";
import ProjectTeam from "../components/parts/project.team";
import ProjectBlockers from "../components/parts/project.blockers";
import ProjectGeneralDiscussion from "../components/parts/project.general.discussion";

function ProjectSingle() {
  const { _id } = useParams();
  const [project, setProject] = useState("");
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    (async () => {
      const project = await dataHandler.showSingle("projects", _id);
      setProject(project);
      console.log(project, "===project");

      const todo = project.tasks.filter((task) => task.status === "to_do");
      const inProgress = project.tasks.filter(
        (task) => task.status === "in_progress"
      );
      const inReview = project.tasks.filter(
        (task) => task.status === "in_review"
      );
      const done = project.tasks.filter((task) => task.status === "done");

      setTodo(todo);
      setInProgress(inProgress);
      setInReview(inReview);
      setDone(done);
    })();
  }, []);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <p>Project</p>
            <h1>{project?.title}</h1>
            <p>{project?.status}</p>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <TasksList
              project={project}
              todo={todo}
              inProgress={inProgress}
              inReview={inReview}
              done={done}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ProjectTeam assigned_users={project?.assigned_users} />
          </Col>
          <Col>
            <ProjectBlockers blockers={project?.blockers} />
          </Col>
        </Row>
        <Row>
          <Col>
            <ProjectGeneralDiscussion comments={project?.comments} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProjectSingle;
