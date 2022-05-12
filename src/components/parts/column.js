import React from "react";
import TaskItem from "./taskItem";
import { Droppable } from "react-beautiful-dnd";

function Column(props) {
  return (
    <div
      style={{
        margin: "8px",
        height: "100%",
        minWidth: "220px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Droppable droppableId={props.column._id}>
        {(provided) => (
          <div
            className="droppable-container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.tasks.map((task, index) => {
              return (
                <TaskItem
                  key={task._id}
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
