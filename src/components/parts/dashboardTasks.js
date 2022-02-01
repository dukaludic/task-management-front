import React, { useEffect, useState } from "react";
import * as dataHandler from "../../helpers/dataHandler";

function DashboardTasks(props) {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div className="main-card">
      <h3>Tasks</h3>
      <div className="d-flex justify-content-between">
        <div className="circle-graph"></div>
        <div className="tasks-graph-info">
          <div className="d-flex justify-content-between">
            <p>To do:</p>
            <p>{props.todo.length}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>In progress:</p>
            <p>{props.inProgress.length}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>In Review:</p>
            <p>{props.inReview.length}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>Near Deadline:</p>
            <p>2</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>Overdue:</p>
            <p>1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTasks;
