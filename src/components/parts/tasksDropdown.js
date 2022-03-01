import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

function TasksDropdown({
  items,
  type,
  setNewTaskProject,
  setNewTaskAssignedUsers,
  setNewTaskProjectManager,
  newTaskAssignedUsers,
}) {
  const [data, setData] = useState(items);
  const [search, setSearch] = useState("");
  const [project, setProject] = useState("");
  const [filtered, setFiltered] = useState([]);

  const [team, setTeam] = useState([]);

  useEffect(() => {
    console.log(items, "===items");
  }, []);

  //   const onInput = (e) => setSearch(e.target.value);
  const onFocus = (e) => e.target.parentNode.parentNode.classList.add("focus");
  const onBlur = (e) =>
    e.target.parentNode.parentNode.classList.remove("focus");

  const onInput = (e) => {
    const filtered = data?.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filtered);
    setSearch(e.target.value);
  };

  window.onclick = () => {
    setFiltered([]);
  };

  const onClickItem = (item, type) => {
    switch (type) {
      case "projects":
        setSearch(item.title);
        setNewTaskProject(item);
        setFiltered([]);
        break;
      case "workers":
        console.log(type);
        console.log(item.title, "item title");

        setNewTaskAssignedUsers([...newTaskAssignedUsers, item]);
        //Remove selected from data array
        const tmpData = data.filter((el) => el.title !== item.title);

        console.log(tmpData, "tmpData");
        setData(tmpData);

        break;
      case "project_managers":
        console.log(type);
        console.log(item.title, "item title");
        setSearch(item.title);
        setNewTaskProjectManager(item);
        setFiltered([]);
        break;

      default:
        break;
    }
  };

  const removeTeamMember = (item) => {
    const tmpTeam = newTaskAssignedUsers.filter(
      (el) => el.title !== item.title
    );

    console.log(tmpTeam, "===tmpTeam");
    setNewTaskAssignedUsers(tmpTeam);
    setData([...data, item]);
    // console.log([...data, tmpTeam[index]]);
  };

  return (
    <div>
      <div className="wrapper">
        <div className="search">
          <input
            id="search"
            value={search}
            onChange={onInput}
            onFocus={onFocus}
            onBlur={onBlur}
            autoComplete="off"
          />
        </div>
        {search.length > 1 && filtered.length > 0 && (
          <ul className="list">
            {filtered.map((item) => (
              <li onClick={() => onClickItem(item, type)}>{item.title}</li>
            ))}
          </ul>
        )}
      </div>
      {newTaskAssignedUsers?.map((item, i) => {
        {
          console.log(item);
        }
        return (
          <div>
            <span>{item.title}</span>
            <span>
              <AiOutlineClose onClick={() => removeTeamMember(item)} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default TasksDropdown;
