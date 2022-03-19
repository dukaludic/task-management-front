import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import * as datahandler from "../../helpers/dataHandler";

import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";
import DropdownSearch from "./dropdownSearch";

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
  const [dueDate, setDueDate] = useState(new Date());

  const [workers, setWorkers] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);

  const [showTaskDropdown, setShowTaskDropdown] = useState(-1);

  const [update, setUpdate] = useState("");

  const authContext = useContext(Auth);
  const { user } = authContext.state.data;

  // Drag and drop state
  const [state, setState] = useState({});

  const navigate = useNavigate();

  // window.onclick = () => {
  //   console.log("click");
  //   setShowTaskDropdown(-1);
  // };

  useEffect(async () => {
    console.log("useEffect tasksList");
    let tasks;
    (async () => {
      if (props.projectOnly) {
        console.log("projectONly");
        tasks = await datahandler.show(
          `tasks/project/${props.project._id}`,
          authContext
        );
        console.log("tasks, projectOnly");
      } else {
        tasks = await datahandler.show(`tasks/user/${user._id}`, authContext);
      }

      console.log(tasks, "TASKS");

      const sortedTasks = {
        tasks: {},
        columns: {
          to_do: {
            _id: "to_do",
            title: "To do",
            taskIds: [],
          },
          in_progress: {
            _id: "in_progress",
            title: "In Progress",
            taskIds: [],
          },
          in_review: {
            _id: "in_review",
            title: "In Review",
            taskIds: [],
          },
          done: {
            _id: "done",
            title: "Done",
            taskIds: [],
          },
        },
        columnOrder: ["to_do", "in_progress", "in_review", "done"],
      };

      for (let i = 0; i < tasks.length; i++) {
        sortedTasks.tasks[tasks[i]._id] = tasks[i];

        switch (tasks[i].status) {
          case "to_do":
            sortedTasks.columns["to_do"].taskIds.push(tasks[i]._id);
            break;
          case "in_progress":
            sortedTasks.columns["in_progress"].taskIds.push(tasks[i]._id);
            break;
          case "in_review":
            sortedTasks.columns["in_review"].taskIds.push(tasks[i]._id);
            break;
          case "done":
            sortedTasks.columns["done"].taskIds.push(tasks[i]._id);
            break;

          default:
            break;
        }
      }

      const titles = await datahandler.show("projects/titles", authContext);
      const users = await datahandler.show("users/names", authContext);

      // firt name and last name to title so it can be passed to dropdown component
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

      console.log(sortedTasks, "sortedTasks");

      setState(sortedTasks);
      setWorkers(workers);
      setProjectManagers(projectManagers);
      setProjectTitles(titles);
    })();
  }, []);

  // Reset inputs on task type/status change
  const changeTaskType = (type) => {
    setNewTaskType(type);
    setNewTaskTitle("");
    setNewTaskProject("");
    setNewTaskDescription("");
    setNewTaskAssignedUsers([]);
    setNewTaskProjectManager("");
    setDueDate(new Date());
  };

  const insertTask = async () => {
    //Prepare objects as IDs
    const project_id = props.project?._id || newTaskProject._id;
    const title = newTaskTitle;
    const assigned_users = [];
    for (let i = 0; i < newTaskAssignedUsers.length; i++) {
      assigned_users.push(newTaskAssignedUsers[i]._id);
    }

    const project = await datahandler.show(
      `projects/basic/${project_id}`,
      authContext
    );

    const project_manager_id = project.project_manager;
    assigned_users.unshift(project_manager_id);

    function toSnakeCase(str) {
      return (
        str &&
        str
          .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
          )
          .map((s) => s.toLowerCase())
          .join("_")
      );
    }
    const status = toSnakeCase(newTaskType);

    const created_by = authContext.state.data.user._id;
    const creation_time = new Date();
    const due_date = dueDate;
    const description = newTaskDescription;

    const taskObj = {
      project_id,
      title,
      assigned_users,
      project_manager_id,
      status,
      created_by,
      creation_time,
      due_date,
      description,
    };
    const insertTaskRes = await datahandler.create(
      "tasks",
      taskObj,
      authContext
    );

    taskObj._id = insertTaskRes._id;

    if (status === "in_review") {
      (async () => {
        const project = await datahandler.show(
          `projects/basic/${taskObj.project_id}`,
          authContext
        );

        const reviewObj = {
          task_id: taskObj._id,
          approval: "pending",
          project_id: taskObj.project_id,
          reviewed_by: project.project_manager,
          sent_to_review_time: new Date(),
          assignee_id: user._id,
        };

        const createReview = await datahandler.create(
          "reviews",
          reviewObj,
          authContext
        );
      })();
    }

    // Insert task in front end temp memory since I don't know how to refetch immediately
    const tmpTasksObj = state;

    switch (status) {
      case "to_do":
        tmpTasksObj.tasks[taskObj._id] = taskObj;
        tmpTasksObj.columns["to_do"].taskIds.push(taskObj._id);
        setState(tmpTasksObj);
        break;
      case "in_progress":
        tmpTasksObj.tasks[taskObj._id] = taskObj;
        tmpTasksObj.columns["in_progress"].taskIds.push(taskObj._id);
        setState(tmpTasksObj);
        break;
      case "in_review":
        tmpTasksObj.tasks[taskObj._id] = taskObj;
        tmpTasksObj.columns["in_review"].taskIds.push(taskObj._id);
        setState(tmpTasksObj);
        break;
      case "done":
        tmpTasksObj.tasks[taskObj._id] = taskObj;
        tmpTasksObj.columns["done"].taskIds.push(taskObj._id);
        setState(tmpTasksObj);
        break;

      default:
        break;
    }

    setNewTaskType("");
  };

  const taskOptionsClick = async (action, item) => {
    switch (action) {
      case "edit":
        //navigate
        navigate(`/task/${item._id}`);
        break;
      case "delete":
        const task = props.tasks.find((el) => el._id === item._id);
        const deleted = await datahandler.deleteItem(
          "tasks",
          task._id,
          authContext
        );
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

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn._id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart._id]: newStart,
        [newFinish._id]: newFinish,
      },
    };

    const task = state.tasks[draggableId];

    (async () => {
      const project = await datahandler.show(
        `projects/basic/${task.project_id}`,
        authContext
      );

      const reviewObj = {
        task_id: draggableId,
        approval: "pending",
        project_id: task.project_id,
        reviewed_by: project.project_manager,
        sent_to_review_time: new Date(),
        assignee_id: user._id,
      };

      const droppedInto = finish._id;

      const updateTask = await datahandler.update(
        "tasks",
        draggableId,
        {
          status: droppedInto,
        },
        authContext
      );
      if (droppedInto === "in_review") {
        const createReview = await datahandler.create(
          "reviews",
          reviewObj,
          authContext
        );
      }
      if (start._id === "in_review" && droppedInto !== "in_review") {
        const deletedReview = await datahandler.deleteItem(
          "reviews",
          draggableId,
          authContext
        );
      }
    })();

    setState(newState);
  };

  return (
    <Container>
      <Row>
        {/* TODO */}
        <Col>
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "220px",
                minHeight: "100px",
              }}
            >
              {state.columnOrder?.map((columnId, index) => {
                const column = state.columns[columnId];

                const tasks = column.taskIds.map(
                  (taskId) => state.tasks[taskId]
                );

                return (
                  <Col>
                    <div>
                      <h3>{column.title}</h3>
                      <p>{props.todo.length} tasks available</p>
                    </div>
                    {newTaskType === column.title ? (
                      <div className="add-new-task-container">
                        <p>Title</p>
                        <input
                          value={newTaskTitle}
                          onChange={(e) => {
                            setNewTaskTitle(e.target.value);
                          }}
                          placeholder="Title"
                        ></input>
                        <p>Project</p>

                        <DropdownSearch
                          items={projectTitles}
                          type="projects"
                          setNewEntryProject={setNewTaskProject}
                        />
                        <p>Description</p>
                        <textarea
                          value={newTaskDescription}
                          onChange={(e) =>
                            setNewTaskDescription(e.target.value)
                          }
                          placeholder="Description"
                        ></textarea>
                        {/* <p>Project Manager</p> */}
                        {/* <DropdownSearch
                          items={projectManagers}
                          type="project_managers"
                          setNewEntryProjectManager={setNewTaskProjectManager}
                        /> */}
                        <p>Team</p>
                        <DropdownSearch
                          items={workers}
                          type="workers"
                          setNewEntryAssignedUsers={setNewTaskAssignedUsers}
                          newEntryAssignedUsers={newTaskAssignedUsers}
                        />
                        <p>Due Date</p>
                        <input
                          style={{ width: "100%" }}
                          type="date"
                          placeholder={new Date().toLocaleDateString("en-CA")}
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          name="dueDate"
                        ></input>
                        <button onClick={insertTask}>Add</button>
                        <button onClick={(e) => changeTaskType("")}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{ margin: "10px" }}
                        onClick={() => changeTaskType(column.title)}
                        className="add-new-task-btn"
                      ></div>
                    )}
                    <Column key={column._id} column={column} tasks={tasks} />
                  </Col>
                );
              })}
            </div>
          </DragDropContext>
        </Col>
      </Row>
    </Container>
  );
}

export default TasksList;
