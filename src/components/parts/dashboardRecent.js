import React from "react";

function DashboardRecent(props) {
  console.log(props.events, "events");

  return (
    <div style={{ width: "300px", backgroundColor: "#ddd", height: "100vh" }}>
      <p>Recent Activity</p>
      {props.events.map((item) => {
        return (
          <div>
            <p>
              {item.user.first_name} {item.user.last_name} {item.operation} on{" "}
              {item.event_target.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardRecent;
