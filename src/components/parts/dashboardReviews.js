import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";

import * as datahandler from "../../helpers/dataHandler";

import { Auth } from "../../context/AuthContext";

function DashboardReviews(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inReview, setInReview] = useState([]);

  const authContext = useContext(Auth);
  const { user } = authContext.state.data;

  console.log(user, "USER");

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
    console.log("toggle");
  };

  const optionsClick = async (option, task) => {
    console.log(option);
    let newStatus;
    switch (option) {
      case "Resolve":
        newStatus = "done";
        break;
      case "Send back":
        console.log("send back");
        newStatus = "in_progress";
        break;

      default:
        break;
    }
    const updatedTask = await datahandler.update("tasks", task.id, {
      status: newStatus,
    });

    console.log(updatedTask, "updatedTask");

    const tmpInReviewArr = props.inReview;
    const index = tmpInReviewArr.findIndex((i) => i.id === task.id);
    console.log(index, "i");
    tmpInReviewArr.splice(index, 1);
    props.setInReview(props.inReview);
    setInReview(props.inReview);
    console.log(tmpInReviewArr, "===tmpInReviewArr");
  };

  const options = ["one", "two", "three"];

  return (
    <div className="main-card">
      <h3>Reviews</h3>
      {props.inReview.length === 0 && (
        <p>You currently have no pending reviews</p>
      )}
      {props.inReview.map((task) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/task/${task.id}`}>
                <p>{task.title}</p>
              </Link>

              <span
                style={{ fontSize: "11px" }}
              >{`${task.assigned_users[0].first_name} ${task.assigned_users[0].last_name}`}</span>
              <span style={{ fontSize: "11px" }}>4 Days ago</span>
            </div>
            {user.role === "project_manager" ? (
              <Dropdown isOpen={true} toggle={toggle}>
                <Dropdown.Toggle>
                  <BsThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => optionsClick(e.target.innerHTML, task)}
                  >
                    Resolve
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => optionsClick(e.target.innerHTML, task)}
                  >
                    Send back
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <p>{`${task.approved ? `Approved` : `Pending`}`}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DashboardReviews;
