import React from "react";
import { Link } from "react-router-dom";

function ProjectsList(props) {
  return (
    <div>
      <div className="projects-list-titles">
        <p>Project</p>
        <p>Team</p>
        <p>Last updated</p>
        <p>Progress</p>
      </div>
      {props.projects.map((project, index) => {
        return (
          <div className="project-list-info">
            <Link to={`/project/${project.id}`}>{project.title}</Link>
            <div className="d-flex align-items-center">
              {project.assigned_users.map((user) => {
                return <div className="team-small-image-circle"></div>;
              })}
            </div>
            <p></p>

            <div>{props.projectProgresses[index]}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectsList;
