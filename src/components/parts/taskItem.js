import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

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

function TaskItem(props) {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          {/* {console.log(props.task)} */}
          <div>
            <div>
              <div className="d-flex justify-content-between">
                <Link to={`/task/${props.task.id}`}>{props.task.title}</Link>
                <BsThreeDotsVertical />
              </div>
              <div
                className="d-flex justify-content-between"
                style={{ fontSize: "11px" }}
              >
                <span>John Doe </span>
                <span>6 days ago</span>
                <div className="task-flag">{checkUrgency(props.task)}</div>
              </div>
              <div>{props.task.description}</div>
            </div>
          </div>
        </Container>
      )}
    </Draggable>
  );
}

export default TaskItem;
