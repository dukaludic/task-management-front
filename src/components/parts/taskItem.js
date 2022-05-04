import React, { useEffect, useState, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

import { Auth } from "../../context/AuthContext";

import * as datahandler from "../../helpers/dataHandler";

function TaskItem(props) {
  const [users, setUsers] = useState([]);
  const authContext = useContext(Auth);

  const checkUrgency = (task) => {
    const today = Date.parse(new Date());
    const inSevenDays = Date.parse(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
    const dueDate = Date.parse(task.due_date);

    if (dueDate < today) {
      return "OVERDUE";
    } else if (dueDate < inSevenDays) {
      return "NEAR";
    } else {
      return undefined;
    }
  };

  useEffect(() => {
    //When new task is created we don't get user info from DB, just ID. So to get images we have to fetch in that case
    if (typeof props.task.assigned_users[0] === "string") {
      (async () => {
        const users = [];
        for (let i = 0; i < props.task.assigned_users.length; i++) {
          const user = await datahandler.show(
            `users/basic/${props.task.assigned_users[i]}`,
            authContext
          );

          users.push(user);
        }
        setUsers(users);
      })();
    } else {
      setUsers(props.task.assigned_users);
    }

    // console.log(props.task, "props.task");
  }, []);

  return (
    <Draggable draggableId={props.task._id} index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          innerRef={provided.innerRef}
        >
          <div className="task-item-container">
            <div className="d-flex justify-content-between">
              <Link to={`/task/${props.task._id}`}>{props.task.title}</Link>
              <div {...provided.dragHandleProps}>
                <BsThreeDotsVertical />
              </div>
            </div>
            <div className="d-flex flex-column justify-items-between">
              <div className="b-3 task-item-description">
                <p>{props.task.description}</p>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <div className="d-flex ">
                  {users.map((user) => {
                    return (
                      <img
                        className="team-small-image-circle"
                        src={user?.profile_picture?.file_url}
                      />
                    );
                  })}
                </div>
                {props.task.status !== "done" && checkUrgency(props.task) && (
                  <div
                    style={{ fontSize: "11px" }}
                    className={`task-flag${
                      checkUrgency(props.task) === "OVERDUE" ? "-r" : "-o"
                    }`}
                  >
                    {checkUrgency(props.task)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskItem;
