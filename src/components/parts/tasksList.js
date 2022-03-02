import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import * as dataHandler from "../../helpers/dataHandler";

import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";
import TasksDropdown from "./tasksDropdown";
import TaskItem from "./taskItem";

import { Auth } from "../../context/AuthContext";

import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";

import Column from "./column";
import { DragDropContext } from "react-beautiful-dnd";

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

  const [showTaskDropdown, setShowTaskDropdown] = useState(-1);

  const [update, setUpdate] = useState("");

  const authContext = useContext(Auth);

  //DND
  const initialData = {
    tasks: {
      "61ec01992d4715532858af0e": {
        id: "61ec01992d4715532858af0e",
        title: "Landing Page",
        project_id: "61eae6462d4715532858aec6",
        status: "in_progress",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      "61f7a1067d145db0a3dae0b6": {
        id: "61f7a1067d145db0a3dae0b6",
        title: "Create Cart Page",
        project_id: "61eae6462d4715532858aec6",
        status: "in_progress",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "To do",
        taskIds: ["61ec01992d4715532858af0e", "61f7a1067d145db0a3dae0b6"],
      },
      "column-2": {
        id: "column-2",
        title: "In Progress",
        taskIds: [],
      },
      "column-3": {
        id: "column-3",
        title: "In Review",
        taskIds: [],
      },
      "column-4": {
        id: "column-4",
        title: "Done",
        taskIds: [],
      },
    },
    columnOrder: ["column-1", "column-2", "column-3", "column-4"],
  };

  const [state, setState] = useState(initialData);

  const navigate = useNavigate();

  // window.onclick = () => {
  //   console.log("click");
  //   setShowTaskDropdown(-1);
  // };

  useEffect(async () => {
    console.log("useEffect");
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
    const created_by = authContext.state.data.user.id;
    const creation_time = new Date();

    console.log(created_by, "created");

    const taskObj = {
      project_id,
      title,
      assigned_users,
      project_manager_id,
      status,
      created_by,
      creation_time,
    };
    const insertTaskRes = await dataHandler.create("tasks", taskObj);

    taskObj.id = insertTaskRes.id;

    // Insert task in front end temp memory since I don't know how to refetch immediately
    switch (newTaskType) {
      case "to_do":
        console.log("to_do");
        props.setTodo([...props.todo, taskObj]);
        break;
      case "in_progress":
        props.setInProgress([...props.inProgress, taskObj]);
        break;
      case "in_review":
        props.setInReview([...props.inReview, taskObj]);
        break;
      case "done":
        props.setDone([...props.done, taskObj]);
        break;

      default:
        break;
    }

    // console.log(insertTaskRes, "insertTaskRes");

    console.log(taskObj, "taskObj");

    setNewTaskType("");
  };

  const taskOptionsClick = async (action, item) => {
    switch (action) {
      case "edit":
        //navigate
        navigate(`/task/${item.id}`);
        break;
      case "delete":
        const task = props.tasks.find((el) => el.id === item.id);
        const deleted = await dataHandler.deleteItem("tasks", task.id);
        console.log("delete", task, deleted);
        break;

      default:
        break;
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = state.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    console.log(newColumn, "newColumn !!!!!!!!!");

    console.log(newColumn, "===newColumn");

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    };

    setState(newState);
  };

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
              <p>Title</p>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <p>Project</p>
              {console.log(projectTitles, "projectTitles")}
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />
              <p>Description</p>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <p>Project Manager</p>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <p>Team</p>
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />

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
          <DragDropContext onDragEnd={onDragEnd}>
            {state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

              return <Column key={column.id} column={column} tasks={tasks} />;
            })}
          </DragDropContext>
        </Col>
        {/* IN PROGRESS */}
        <Col>
          <div>
            <h3>In Progress</h3>
            <p>{props.inProgress.length} tasks available</p>
          </div>
          {newTaskType === "in_progress" ? (
            <>
              <p>Title</p>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <p>Project</p>
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />
              <p>Description</p>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <p>Project Manager</p>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <p>Team</p>
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />

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
              <p>Title</p>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <p>Project</p>
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />
              <p>Description</p>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <p>Project Manager</p>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <p>Team</p>
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />

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
              <p>Title</p>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <p>Project</p>
              <TasksDropdown
                items={projectTitles}
                type="projects"
                setNewTaskProject={setNewTaskProject}
              />
              <p>Description</p>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <p>Project Manager</p>
              <TasksDropdown
                items={projectManagers}
                type="project_managers"
                setNewTaskProjectManager={setNewTaskProjectManager}
              />
              <p>Team</p>
              <TasksDropdown
                items={workers}
                type="workers"
                setNewTaskAssignedUsers={setNewTaskAssignedUsers}
                newTaskAssignedUsers={newTaskAssignedUsers}
              />

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
