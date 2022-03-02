import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

function Task(props) {
  console.log(props, "propsTASK");
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
            <hr></hr>
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
                <div className="task-flag">OVERDUE</div>
              </div>
              <div>{props.task.description}</div>
            </div>
          </div>
        </Container>
      )}
    </Draggable>
  );
}

export default Task;
