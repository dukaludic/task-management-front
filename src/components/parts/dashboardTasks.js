import React, { useEffect, useState } from "react";
import * as dataHandler from "../../helpers/dataHandler";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Utils } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardTasks(props) {
  const [projectTitle, setProjectTitle] = useState("All Tasks");
  const [todo, setTodo] = useState(props.todo);
  const [inProgress, setInProgress] = useState(props.inProgress);
  const [inReview, setInReview] = useState(props.inReview);
  const [done, setDone] = useState(props.done);
  const [nearDeadline, setNearDeadline] = useState([]);
  const [overdue, setOverdue] = useState([]);

  // On load
  useEffect(() => {
    setTodo(props.todo);
    setInProgress(props.inProgress);
    setInReview(props.inReview);
  }, []);

  // On Change project
  // useEffect(() => {
  //   setProjectTitle("All Tasks");
  //   setTodo(props.todo);
  //   setInProgress(props.inProgress);
  //   setInReview(props.inReview);
  // }, [props.todo, props.inProgress, props.done, props.inReview]);

  const data = {
    labels: [
      `Overdue: ${props.overdue.length}`,
      `Near Deadline: ${props.nearDeadline.length}`,
      `In Progress: ${props.inProgress.length}`,
      `To do: ${props.todo.length}`,
      `In Review ${props.inReview.length}`,
    ],
    datasets: [
      {
        data: [
          props.overdue.length,
          props.nearDeadline.length,
          props.inProgress.length,
          props.todo.length,
          props.inReview.length,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="main-card">
      <h3>Tasks</h3>
      {projectTitle !== "All Tasks" && <p>All Tasks</p>}

      <div className="d-flex justify-content-between">
        <div style={{ width: "100%" }}>
          <Doughnut data={data} />
        </div>
      </div>
    </div>
  );
}

export default DashboardTasks;
