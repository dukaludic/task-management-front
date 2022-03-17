import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

import * as datahandler from "../../helpers/dataHandler";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

function TaskItem(props) {
  const [users, setUsers] = useState([]);

  const checkUrgency = (task) => {
    const today = Date.parse(new Date());
    const inSevenDays = Date.parse(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
    const dueDate = Date.parse(task.due_date);

    if (dueDate < today) {
      return "OVERDUE";
    } else if (dueDate < inSevenDays) {
      return "NEAR DEADLINE";
    }
  };

  useEffect(() => {
    //When new task is created we don't get user info from DB, just ID. So to get images we have to fetch in that case
    if (typeof props.task.assigned_users[0] === "string") {
      (async () => {
        const users = [];
        for (let i = 0; i < props.task.assigned_users.length; i++) {
          const user = await datahandler.show(
            `users/basic/${props.task.assigned_users[i]}`
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
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          innerRef={provided.innerRef}
        >
          <div>
            <div>
              <div className="d-flex justify-content-between">
                <Link to={`/task/${props.task._id}`}>{props.task.title}</Link>
                <div {...provided.dragHandleProps}>
                  <BsThreeDotsVertical />
                </div>
              </div>
              <div className="">
                <div>{props.task.description}</div>
                <div className="d-flex justify-content-between">
                  <div>
                    {users.map((user) => {
                      return (
                        <img
                          className="team-small-image-circle"
                          src={user?.profile_picture?.base_64}
                        />
                      );
                    })}
                  </div>

                  <div style={{ fontSize: "11px" }} className="task-flag">
                    {checkUrgency(props.task)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </Draggable>
  );
}

export default TaskItem;
