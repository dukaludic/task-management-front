import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

function ProjectTeam(props) {
  return (
    <div>
      <h3>Team</h3>
      {props.assigned_users.map((user) => {
        return (
          <div className="d-flex justify-content-between w-50">
            <div className="d-flex">
              <div className="team-big-image-circle"></div>
              <div>
                <p>{`${user.first_name} ${user.last_name}`}</p>
                <p>{user.role}</p>
              </div>
            </div>
            <BsThreeDotsVertical />
          </div>
        );
      })}
    </div>
  );
}

export default ProjectTeam;
