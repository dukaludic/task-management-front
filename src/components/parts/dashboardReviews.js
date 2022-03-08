import React from "react";

import { BsThreeDotsVertical } from "react-icons/bs";

function DashboardReviews(props) {
  return (
    <div className="main-card">
      <h3>Pending Reviews</h3>
      {props.inReview.length === 0 && (
        <p>You currently have no pending reviews</p>
      )}
      {props.inReview.map((task) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p>{task.title}</p>

              <span
                style={{ fontSize: "11px" }}
              >{`${task.assigned_users[0].first_name} ${task.assigned_users[0].last_name}`}</span>
              <span style={{ fontSize: "11px" }}>4 Days ago</span>
            </div>
            <BsThreeDotsVertical />
          </div>
        );
      })}
    </div>
  );
}

export default DashboardReviews;
