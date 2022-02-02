import React, { useEffect, useState, useReducer } from "react";
import { Container, Col, Row } from "react-bootstrap";
import * as dataHandler from "../../helpers/dataHandler";

import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";

function TasksList(props) {
  const [insertNewTask, setInsertNewTask] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAssignedUsers, setNewTaskAssignedUsers] = useState([]);

  const insertTask = async () => {
    setInsertNewTask("");
    const newTaskRes = await dataHandler.create("tasks");
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
          {insertNewTask === "to_do" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <input
                value={newTaskProject}
                //   onChange={(e) => setNewTaskProject(e.target.value)}
                placeholder="Project"
              ></input>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <input placeholder="Assign to"></input>
              <AiFillPlusCircle />
              <button>Add</button>
              <button>Cancel</button>
            </>
          ) : (
            <div
              onClick={() => setInsertNewTask("to_do")}
              className="add-new-task-btn"
            ></div>
          )}

          {props.todo.map((item) => {
            return (
              <div>
                <hr style={{ transition: "all 0.3s" }}></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <span>{item.title}</span>
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
          {insertNewTask === "in_progress" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <input
                value={newTaskProject}
                //   onChange={(e) => setNewTaskProject(e.target.value)}
                placeholder="Project"
              ></input>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <input placeholder="Assign to"></input>
              <AiFillPlusCircle />
              <button>Add</button>
              <button onClick={() => setInsertNewTask("")}>Cancel</button>
            </>
          ) : (
            <div
              onClick={() => setInsertNewTask("in_progress")}
              className="add-new-task-btn"
            ></div>
          )}
          {props.inProgress.map((item) => {
            return (
              <div>
                <hr></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <span>{item.title}</span>
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
          {insertNewTask === "in_review" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <input
                value={newTaskProject}
                //   onChange={(e) => setNewTaskProject(e.target.value)}
                placeholder="Project"
              ></input>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <input placeholder="Assign to"></input>
              <AiFillPlusCircle />
              <button>Add</button>
              <button onClick={() => setInsertNewTask("")}>Cancel</button>
            </>
          ) : (
            <div
              onClick={() => setInsertNewTask("in_review")}
              className="add-new-task-btn"
            ></div>
          )}
          {props.inReview.map((item) => {
            return (
              <div>
                <hr></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <span>{item.title}</span>
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
          {insertNewTask === "done" ? (
            <>
              <input
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                placeholder="Title"
              ></input>
              <input
                value={newTaskProject}
                //   onChange={(e) => setNewTaskProject(e.target.value)}
                placeholder="Project"
              ></input>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <input placeholder="Assign to"></input>
              <AiFillPlusCircle />
              <button>Add</button>
              <button onClick={() => setInsertNewTask("")}>Cancel</button>
            </>
          ) : (
            <div
              onClick={() => setInsertNewTask("done")}
              className="add-new-task-btn"
            ></div>
          )}
          {props.done.map((item) => {
            return (
              <div>
                <hr></hr>
                <div>
                  <div className="d-flex justify-content-between">
                    <span>{item.title}</span>
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
