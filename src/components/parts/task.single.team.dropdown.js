import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const TaskSingleTeamDropdown = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // const data = [];
    // for (let i = 0; i < data.length; i++) {
    //   data[i].name = `${data[i].firstName} ${data[i].last_name}`;
    // }

    // const projectUsers = props.data.map((user) => {
    //   return {
    //     id: user.id,
    //     name: `${user.first_name} ${user.last_name}`,
    //     role: user.role,
    //     username: user.username,
    //     email: user.email,
    //     role: user.role,
    //     profile_picture: user.profile_picture,
    //   };
    // });

    console.log(ref, "REF");

    const projectUsers = props.data;

    //difference between arrays because some are already assigned and shouldn't appear in search
    const remainingUsers = projectUsers.filter(
      ({ id }) => !props.assignedUsers.some((user) => user.id === id)
    );

    console.log(remainingUsers, "remainingUsers");

    console.log(data, "dataaa");

    setData(remainingUsers);
    // console.log(props.data, "props.data");
  }, []);

  const onInput = (e) => {
    console.log(data, e.target.value, "data");
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

  const onClickItem = (item) => {
    // console.log(props.setAssignedUsers);

    props.setParentData([...props.assignedUsers, item]);
    setData((prevState) => prevState.filter((user) => user.id !== item.id));
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
            id="search"
            type="search"
            value={search}
            onChange={onInput}
            onFocus={onFocus}
            onBlur={onBlur}
            autocomplete="off"
          />
        </div>
        {search.length > 1 && filtered.length > 0 && (
          <ul className="list">
            {filtered.map((item) => (
              <li onClick={() => onClickItem(item)}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default TaskSingleTeamDropdown;
