import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";

import { Auth } from "../../context/AuthContext";

import * as datahandler from "../../helpers/dataHandler";

const ProjectSingleManagerDropdown = forwardRef((props, ref) => {
  const authContext = useContext(Auth);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    (async () => {
      const allUsers = await datahandler.show("users");

      const allManagersRepack = allUsers
        .filter((user) => user.role === "project_manager")
        .map((user) => {
          return {
            _id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            username: user.username,
            email: user.email,
            role: user.role,
            profile_picture: user.profile_picture,
          };
        });

      console.log(allManagersRepack, "allworkersRepack");

      //difference between arrays because some are already assigned and shouldn't appear in search
      const remainingUsers = allManagersRepack.filter(
        ({ _id }) => props.projectManager._id !== _id
      );

      console.log(data, "dataaa");

      setData(remainingUsers);
      // console.log(props.data, "props.data");
    })();
  }, []);

  const onInput = (e) => {
    const filtered = data?.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(filtered, "filtered");
    setFiltered(filtered);
    setSearch(e.target.value);
  };

  const onFocus = (e) => e.target.parentNode.parentNode.classList.add("focus");
  const onBlur = (e) =>
    e.target.parentNode.parentNode.classList.remove("focus");

  const onClickItem = async (item) => {
    // console.log(props.setAssignedUsers);

    console.log(item, "item");

    props.setParentData(item);

    const projectManagerId = item._id;

    if (props.type === "project") {
      const updatedProject = await datahandler.update(
        "projects",
        props.project._id,
        {
          project_manager_id: projectManagerId,
        },
        authContext
      );
    }

    setData((prevState) => prevState.filter((user) => user._id !== item._id));
    setFiltered([]);
  };

  useImperativeHandle(ref, () => ({
    setData: setData,
  }));

  return (
    <div>
      <div className="wrapper">
        <div className="search">
          <input
            _id="search"
            type="search"
            value={search}
            onChange={onInput}
            onFocus={onFocus}
            onBlur={onBlur}
            autoComplete="off"
          />
        </div>
        {search.length > 1 && filtered.length > 0 && (
          <ul className=".dropdown-search-list">
            {filtered.map((item) => (
              <li onClick={() => onClickItem(item)}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default ProjectSingleManagerDropdown;
