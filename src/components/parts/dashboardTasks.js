import React, { useEffect, useState } from "react";
import * as dataHandler from "../../helpers/dataHandler";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
Chart.register(...registerables);

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

  const dataByStatus = {
    labels: [
      `To do: ${props.todo.length}`,
      `In Progress: ${props.inProgress.length}`,
      `In Review ${props.inReview.length}`,
    ],

    datasets: [
      {
        data: [
          props.todo.length,
          props.inProgress.length,
          props.inReview.length,
        ],

        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const dataByDeadline = {
    labels: [
      `Overdue: ${props.overdue.length}`,
      `Near Deadline: ${props.nearDeadline.length}`,
    ],
    options: {
      plugins: {
        legend: {
          labels: {
            // This more specific font property overrides the global property
            font: {
              size: 6,
            },
          },
        },
      },
    },
    datasets: [
      {
        data: [props.overdue.length, props.nearDeadline.length],

        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(255, 206, 86, 0.6)"],
      },
    ],
  };

  // const toggleUserProjectTasks = () => {
  //   if (props.userProjectTasks === "user") {
  //     props.setUserProjectTasks("project");
  //   } else if (props.userProjectTasks === "project") {
  //     props.setUserProjectTasks("user");
  //   }
  // };

  return (
    <div className="card-container">
      <div className="d-flex justify-content-between align-items-center">
        <span className="h-3">Tasks</span>
        {props.userOnlyTasks ? (
          <AiOutlineUser
            className="user-team-icon"
            onClick={props.toggleUserProjectTasks}
          />
        ) : (
          <AiOutlineTeam
            className="user-team-icon"
            size={20}
            onClick={props.toggleUserProjectTasks}
          />
        )}
      </div>
      <p className="b-3">{props.projectSelected}</p>

      <div className="d-flex justify-content-between">
        <div width="600px" className="d-flex flex-column">
          <Bar
            options={{
              plugins: {
                legend: {
                  display: false,
                  position: "bottom",
                  labels: {
                    // This more specific font property overrides the global property
                    font: {
                      size: 11,
                    },
                  },
                },
              },
            }}
            data={dataByStatus}
          />
          <Bar
            options={{
              plugins: {
                legend: {
                  display: false,
                  position: "bottom",
                  labels: {
                    // This more specific font property overrides the global property
                    font: {
                      size: 12,
                      family: "Helvetica",
                    },
                  },
                },
              },
              myScale: {
                type: "logarithmic",
                position: "right", // `axis` is determined by the position as `'y'`
              },
            }}
            data={dataByDeadline}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardTasks;
