import React, { useEffect, useState, useReducer, useRef } from "react";
import { Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import * as dataHandler from "../../helpers/dataHandler";

import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";
import TasksDropdown from "./tasksDropdown";

function TasksList(props) {
  const [newTaskType, setNewTaskType] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAssignedUsers, setNewTaskAssignedUsers] = useState([]);
  const [newTaskProjectManager, setNewTaskProjectManager] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);

  const [workers, setWorkers] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);

  useEffect(async () => {
    const titles = await dataHandler.show("projects/titles");
    const users = await dataHandler.show("users/names");

    // firt name and last name to title so it can be passed to dropdown component
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

    setWorkers(workers);
    setProjectManagers(projectManagers);
    setProjectTitles(titles);
  }, []);

  // Reset inputs on task type/status change
  const changeTaskType = (type) => {
    setNewTaskType(type);
    setNewTaskTitle("");
    setNewTaskProject("");
    setNewTaskDescription("");
    setNewTaskAssignedUsers([]);
    setNewTaskProjectManager("");
  };

  const insertTask = async () => {
    setNewTaskType("");

    console.log("insert task");

    console.log(props, "props");
    //Prepare objects as IDs
    const project_id = props.project?.id || newTaskProject.id;
    const title = newTaskTitle;
    const assigned_users = [];
    for (let i = 0; i < newTaskAssignedUsers.length; i++) {
      assigned_users.push(newTaskAssignedUsers[i].id);
    }
    const project_manager_id = newTaskProjectManager.id;
    const status = newTaskType;

    const taskObj = {
      project_id,
      title,
      assigned_users,
      project_manager_id,
      status,
    };

    const insertTaskRes = await dataHandler.create("tasks", taskObj);

    console.log(insertTaskRes, "insertTaskRes");

    console.log(taskObj, "taskObj");
  };

  //   const InsertTaskMenu = () => {
  //     return (

  //     );
  //   };

  return (
    <Container>
      <Row>
        {/* TODO */}
        <Col>
          <div>
            <h3>To do</h3>
            <p>{props.todo.length} tasks available</p>
          </div>
          {newTaskType === "to_do" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              {console.log(projectTitles, "projectTitles")}
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />

              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />
              <AiFillPlusCircle />
              <button onClick={insertTask}>Add</button>
              <button onClick={(e) => changeTaskType("")}>Cancel</button>
              {/* {projectTitles.map((item) => {
                {
                  console.log(projectTitles, projectsDropdown, "projectTitles");
                }
                <div>{item.title}</div>;
              })} */}
            </>
          ) : (
            <div
              onClick={() => changeTaskType("to_do")}
              className="add-new-task-btn"
            ></div>
          )}

          {props.todo.map((item) => {
            return (
              <div>
                <hr style={{ transition: "all 0.3s" }}></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <Link to={`/task/${item.id}`}>{item.title}</Link>
                    <BsThreeDotsVertical />
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{ fontSize: "11px" }}
                  >
                    <span>John Doe </span>
                    <span>6 days ago</span>
                    <div className="task-flag">OVERDUE</div>
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
            );
          })}
        </Col>
        {/* IN PROGRESS */}
        <Col>
          <div>
            <h3>In Progress</h3>
            <p>{props.inProgress.length} tasks available</p>
          </div>
          {newTaskType === "in_progress" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />

              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />
              <AiFillPlusCircle />
              <button onClick={insertTask}>Add</button>
              <button onClick={(e) => changeTaskType("")}>Cancel</button>
            </>
          ) : (
            <div
              onClick={() => changeTaskType("in_progress")}
              className="add-new-task-btn"
            ></div>
          )}
          {props.inProgress.map((item) => {
            return (
              <div>
                <hr></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <Link to={`/task/${item.id}`}>{item.title}</Link>
                    <BsThreeDotsVertical />
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{ fontSize: "11px" }}
                  >
                    <span>John Doe </span>
                    <span>6 days ago</span>
                    <div className="task-flag">OVERDUE</div>
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
            );
          })}
        </Col>
        {/* IN REVIEW */}
        <Col>
          <div>
            <h3>In Review</h3>
            <p>{props.inReview.length} tasks available</p>
          </div>
          {newTaskType === "in_review" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />

              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />
              <AiFillPlusCircle />
              <button onClick={insertTask}>Add</button>
              <button onClick={(e) => changeTaskType("")}>Cancel</button>
            </>
          ) : (
            <div
              onClick={() => changeTaskType("in_review")}
              className="add-new-task-btn"
            ></div>
          )}
          {props.inReview.map((item) => {
            return (
              <div>
                <hr></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <Link to={`/task/${item.id}`}>{item.title}</Link>
                    <BsThreeDotsVertical />
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{ fontSize: "11px" }}
                  >
                    <span>John Doe </span>
                    <span>6 days ago</span>
                    <div className="task-flag">OVERDUE</div>
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
            );
          })}
        </Col>
        {/* DONE */}
        <Col>
          <div>
            <h3>Done</h3>
            <p>{props.done.length} tasks available</p>
          </div>
          {newTaskType === "done" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />

              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />
              <AiFillPlusCircle />
              <button onClick={insertTask}>Add</button>
              <button onClick={(e) => changeTaskType("")}>Cancel</button>
            </>
          ) : (
            <div
              onClick={() => changeTaskType("done")}
              className="add-new-task-btn"
            ></div>
          )}
          {props.done.map((item) => {
            return (
              <div>
                <hr></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <Link to={`/task/${item.id}`}>{item.title}</Link>
                    <BsThreeDotsVertical />
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{ fontSize: "11px" }}
                  >
                    <span>John Doe </span>
                    <span>6 days ago</span>
                    <div className="task-flag">OVERDUE</div>
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
}

export default TasksList;
