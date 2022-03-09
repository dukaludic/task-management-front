import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Auth } from "../../context/AuthContext";
import DropdownSearch from "./dropdownSearch";

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
  const [reloadCounter, reload] = useState(0);
  const [newEntryTitleValid, setNewEntryTitleValid] = useState(true);

  useEffect(() => {
    (async () => {
      const users = await datahandler.show("users");

      const workers = [];
      const projectManagers = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "project_manager") {
          projectManagers.push({
            id: users[i].id,
            title: `${users[i].first_name} ${users[i].last_name}`,
          });
        } else {
          workers.push({
            id: users[i].id,
            title: `${users[i].first_name} ${users[i].last_name}`,
          });
        }
      }
      console.log(workers, "workers");
      console.log(projectManagers, "projectManagers");

      setAllWorkers(workers);
      setAllProjectManagers(projectManagers);
    })();
  }, [reloadCounter]);

  const addProject = async () => {
    if (newEntryTitle.length < 3) {
      setNewEntryTitleValid(false);
      return;
    }

    console.log(
      newEntryTitle,
      newEntryAssignedUsers,
      newEntryProjectManager,
      newEntryStartDate,
      newEntryEndDate
    );

    const assignedUsersIds = [];
    for (let i = 0; i < newEntryAssignedUsers.length; i++) {
      assignedUsersIds.push(newEntryAssignedUsers[i].id);
    }

    const newProjectObj = {
      title: newEntryTitle,
      start_date: newEntryStartDate,
      end_date: newEntryEndDate,
      assigned_users: assignedUsersIds,
      project_manager_id: newEntryProjectManager.id,
      status: "to_do",
    };

    const newProjectRes = await datahandler.create("projects", newProjectObj);
    reload(reloadCounter + 1);
    setNewProjectMenuOpen(false);
  };

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
                {
                  console.log(user, "user");
                }
                return (
                  <img
                    src={user.profile_picture.base_64}
                    className="team-small-image-circle"
                  ></img>
                );
              })}
            </div>
            <p></p>

            <div>{props.projectProgresses[index]}</div>
          </div>
        );
      })}
      {newProjectMenuOpen &&
        authContext.state.data.user.role === "project_manager" && (
          <div>
            <div>
              <p>Title</p>
              <input
                value={newEntryTitle}
                onChange={(e) => setNewEntryTitle(e.target.value)}
                type="text"
                className=""
              />
              {!newEntryTitleValid && (
                <p>Title must be at least 3 letter long</p>
              )}
            </div>
            <div>
              <p>Description</p>
              <textarea
                value={newEntryDescription}
                onChange={(e) => setNewEntryDescription(e.target.value)}
              />
            </div>
            <div>
              <p>Team</p>
              <DropdownSearch
                style={{ display: "block" }}
                items={allWorkers}
                type="workers"
                setNewEntryAssignedUsers={setNewEntryAssignedUsers}
                newEntryAssignedUsers={newEntryAssignedUsers}
              />
            </div>
            <div>
              <p>Project Manager</p>
              <DropdownSearch
                items={allProjectManagers}
                type="project_managers"
                setNewEntryProjectManager={setNewEntryProjectManager}
              />
            </div>

            <div>
              <p>Start Date</p>
              <input
                value={newEntryStartDate}
                onChange={(e) => setNewEntryStartDate(e.target.value)}
                type="date"
                className=""
              />
            </div>

            <div>
              <p>End Date</p>
              <input
                value={newEntryEndDate}
                onChange={(e) => setNewEntryEndDate(e.target.value)}
                type="date"
                className=""
              />
            </div>
            <button onClick={addProject}>ADD</button>
          </div>
        )}
      {!newProjectMenuOpen &&
        authContext.state.data.user.role === "project_manager" && (
          <button onClick={() => setNewProjectMenuOpen(true)}>
            New Project
          </button>
        )}
    </div>
  );
}

export default ProjectsList;
