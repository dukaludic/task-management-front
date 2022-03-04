import React, { useEffect, useState } from "react";
import * as dataHandler from "../../helpers/dataHandler";
import { Doughnut } from "react-chartjs-2";
// import { Utils } from "react-chartjs-2";

function DashboardTasks(props) {
  useEffect(() => {
    console.log(props);
  }, []);

  const DATA_COUNT = 5;
  const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

  const data = {
    labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
    datasets: [
      {
        label: "Dataset 1",
        data: 2,
        backgroundColor: "red",
      },
    ],
  };

  return (
    <div className="main-card">
      <h3>Tasks</h3>
      {/* <Doughnut data={data} /> */}
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
