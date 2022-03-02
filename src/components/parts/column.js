import React from "react";
import Task from "./task";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div`
  padding: 8px;
`;

function Column(props) {
  console.log(props, "===props");
  return (
    <div
      style={{
        margin: "8px",
        border: "1px solid lightgrey",
        width: "220px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Droppable droppableId={props.column.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {props.tasks.map((task, index) => {
              console.log(task);
              console.log(props.tasks, "props.tasks");
              return (
                <Task
                  key={task.id}
                  task={task}
                  item={props.item}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
