import React from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

function TaskItem({ item }) {
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
}

export default TaskItem;
