import React from "react";
import { IoMdArrowDropup } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

function ProjectBlockers() {
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Blockers</h3>
        <div>6</div>
      </div>
      <hr></hr>
      <div>
        <div className="d-flex justify-content-between">
          <h3>Connect Payment API</h3>
          <div>3</div>
          <IoMdArrowDropup />
        </div>
        <div>
          <span>We need to contact the bank for API permissions</span>
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
}

export default ProjectBlockers;
