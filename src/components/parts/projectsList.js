import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Auth } from "../../context/AuthContext";
import DropdownSearch from "./dropdownSearch";
import moment from "moment";
import * as datahandler from "../../helpers/dataHandler";

function ProjectsList(props) {
  const authContext = useContext(Auth);
  const [newProjectMenuOpen, setNewProjectMenuOpen] = useState(false);
  const [allWorkers, setAllWorkers] = useState([]);
  const [allProjectManagers, setAllProjectManagers] = useState([]);
  const [newEntryAssignedUsers, setNewEntryAssignedUsers] = useState([]);
  const [newEntryProjectManager, setNewEntryProjectManager] = useState({});
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryStartDate, setNewEntryStartDate] = useState("");
  const [newEntryEndDate, setNewEntryEndDate] = useState("");
  const [newEntryDescription, setNewEntryDescription] = useState("");

  const [newEntryTitleValid, setNewEntryTitleValid] = useState(true);

  useEffect(() => {
    (async () => {
      const users = await datahandler.show("users", authContext);

      const workers = [];
      const projectManagers = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "project_manager") {
          projectManagers.push({
            _id: users[i]._id,
            title: `${users[i].first_name} ${users[i].last_name}`,
          });
        } else {
          workers.push({
            _id: users[i]._id,
            title: `${users[i].first_name} ${users[i].last_name}`,
          });
        }
      }

      setAllWorkers(workers);
      setAllProjectManagers(projectManagers);
    })();
  }, []);

  const addProject = async () => {
    if (newEntryTitle.length < 3) {
      setNewEntryTitleValid(false);
      return;
    }

    const assignedUsersIds = [];
    for (let i = 0; i < newEntryAssignedUsers.length; i++) {
      assignedUsersIds.push(newEntryAssignedUsers[i]._id);
    }

    const newProjectObj = {
      title: newEntryTitle,
      start_date: newEntryStartDate,
      end_date: newEntryEndDate,
      assigned_users: assignedUsersIds,
      project_manager_id: newEntryProjectManager._id,
      status: "to_do",
    };

    const newProjectRes = await datahandler.create(
      "projects",
      newProjectObj,
      authContext
    );
    props.reload(props.reloadCounter + 1);
    setNewProjectMenuOpen(false);
  };

  const cancelNewProject = () => {
    setNewEntryTitle("");
    setNewEntryDescription("");
    setNewEntryAssignedUsers("");
    setNewEntryProjectManager("");
    setNewEntryStartDate("");
    setNewEntryEndDate("");
    setNewProjectMenuOpen(false);
  };

  return (
    <div>
      <div className="projects-list-titles b-2-bold">
        <p>Project</p>
        <p>Team</p>
        <p>Start Date</p>
        <p>End Date</p>
        <p>Progress</p>
      </div>
      {props.projectsLoading ? (
        <div>Loading</div>
      ) : (
        <>
          {props.projects.map((project, index) => {
            return (
              <div className="project-list-info">
                <Link to={`/project/${project?._id}`}>{project?.title}</Link>
                <div className="d-flex align-items-center mb-3">
                  {[project?.project_manager, ...project?.assigned_users].map(
                    (user) => {
                      return (
                        <img
                          src={user?.profile_picture?.file_url}
                          className="team-small-image-circle"
                        ></img>
                      );
                    }
                  )}
                </div>
                {console.log(project, "PROJECT in projectList")}
                <p className="b-2">
                  {project.start_date
                    ? moment(project.start_date).format("MMM Do YY")
                    : "Not defined"}
                </p>
                <p className="b-2">
                  {project.end_date
                    ? moment(project.end_date).format("MMM Do YY")
                    : "Not defined"}
                </p>
                <div className="progress-bar-container">
                  <div className="progress-bar-progress-container">
                    <div className="progress-bar-whole"></div>
                    <div
                      style={{ width: `${props.projectProgresses[index]}%` }}
                      className="progress-bar"
                    ></div>
                  </div>
                  <span>{`${
                    props.projectProgresses[index]
                      ? props.projectProgresses[index]
                      : "0"
                  }%`}</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default ProjectsList;
