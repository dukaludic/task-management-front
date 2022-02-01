import React from "react";

function DashboardRecent(props) {
  return (
    <div style={{ width: "300px", backgroundColor: "#ddd", height: "100vh" }}>
      <p>Recent Activity</p>
      {props.events.map((item) => {
        return (
          <div>
            <p>
              {item.user.first_name} {item.user.last_name} {item.operation} on
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardRecent;
