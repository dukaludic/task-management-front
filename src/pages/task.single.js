import React, { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import * as dataHandler from "../helpers/dataHandler";
import { AiFillEdit, AiOutlineCheck } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";

import { useDropzone } from "react-dropzone";

import * as datahandler from "../helpers/dataHandler";
import DropdownSearch from "../components/parts/dropdownSearch";
import TaskSingleTeamDropdown from "../components/parts/task.single.team.dropdown";

Modal.setAppElement("#root");

function TaskSingle() {
  const { id } = useParams();
  const [task, setTask] = useState("");
  const [taskProgress, setTaskProgress] = useState(0);
  const [subTasks, setSubTasks] = useState([]);
  const [addSubTaskOpen, setAddSubTaskOpen] = useState(false);
  const [subTaskContent, setSubTaskContent] = useState("");
  const [descriptionEditIconShown, setDescriptionEditShown] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [titleEditIconShown, setTitleEditIconShown] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesShown, setImagesShown] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [status, setStatus] = useState("");
  const [assignMoreOpen, setAssignMoreOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [hoveringOverImage, setHoveringOverImage] = useState(null);

  const [newImageId, setNewImageId] = useState(0);

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const calcTaskProgress = (subTasks) => {
    if (subTasks.length < 1) {
      return;
    }
    const done = [];
    let taskProgress = 0;

    for (let i = 0; i < subTasks.length; i++) {
      if (subTasks[i].done) {
        done.push(subTasks[i]);
      }
    }

    if (done.length < 1) {
      taskProgress = 0;
    }

    taskProgress = Math.round((done.length / subTasks.length) * 100);

    setTaskProgress(taskProgress);
  };

  useEffect(() => {
    (async () => {
      const task = await dataHandler.showSingle("tasks", id);

      const fetchedProjectUsers = await datahandler.show(
        `users/project/${task.project_id}`
      );

      const uploadedImages = await datahandler.show(
        `imagesassigned/assignment_id/${id}`
      );

      const projectUsers = fetchedProjectUsers.map((user) => {
        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          username: user.username,
          email: user.email,
          role: user.role,
          profile_picture: user.profile_picture,
        };
      });

      const assignedUsers = task.assigned_users.map((user) => {
        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          username: user.username,
          email: user.email,
          role: user.role,
          profile_picture: user.profile_picture,
        };
      });

      //Shallow copy an object not to be passed as reference
      const imagesShown = uploadedImages.map((image) => {
        return {
          _id: image._id,
          base_64: image.base_64,
        };
      });

      console.log(imagesShown, "IMAGESSHOW");

      console.log(projectUsers, "projectUsers");

      setTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setSubTasks(task.sub_tasks);
      calcTaskProgress(task.sub_tasks);
      setAssignedUsers(assignedUsers);

      setProjectUsers(projectUsers);
      setAllImages(uploadedImages);
      setImagesShown(imagesShown);
    })();
  }, []);

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      //Make new filereader
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        getBase64(file).then((data) => {
          setAllImages((prevState) => [
            ...prevState,
            { _id: newImageId, base_64: data },
          ]);
          setImagesShown((prevState) => [
            ...prevState,
            { _id: newImageId, base_64: data },
          ]);
          setNewImageId((prevState) => prevState + 1);
        });
      });
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="dropzone-task">Drop the files here ...</div>
        ) : (
          <div className="dropzone-task">
            Drag 'n' drop some files here, or click to select files
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    calcTaskProgress(subTasks);
  }, [subTasks]);

  const addSubTask = async () => {
    const subTaskObj = {
      task_id: id,
      content: subTaskContent,
      done: false,
    };

    const createSubTaskRes = await datahandler.create("subtasks", subTaskObj);

    subTaskObj.id = createSubTaskRes.id;

    // calcTaskProgress(subTasks);
    setSubTasks([subTaskObj, ...subTasks]);
  };

  const subTaskCheck = async (index, isChecked) => {
    const updateSubTaskRes = await datahandler.update(
      "subtasks",
      subTasks[index]._id,
      { done: !isChecked }
    );

    const tmpSubTasksArr = [...subTasks];
    tmpSubTasksArr[index].done = !isChecked;
    console.log(tmpSubTasksArr[index], "index");

    console.log(isChecked, "isChecked");
    console.log(tmpSubTasksArr, "subTasks");

    setSubTasks(tmpSubTasksArr);
  };

  const removeSubtask = (index, id) => {
    console.log(index, id);

    const deleteSubtaskRes = datahandler.deleteItem("subtasks", id);

    setSubTasks((prevState) => prevState.filter((el) => el._id !== id));
  };

  const setEdit = (element, value) => {
    if (element === "title") {
      setEditTitle((prevState) => !prevState);
    } else if (element === "description") {
      setEditDescription((prevState) => !prevState);
    }
  };

  const saveChanges = async () => {
    const assignedUsersIds = [];

    for (let i = 0; i < assignedUsers.length; i++) {
      assignedUsersIds.push(assignedUsers[i].id);
    }

    const updateTaskObj = {
      title: title,
      description: description,
      status: status,
      assigned_users: assignedUsersIds,
    };

    console.log(updateTaskObj);

    console.log(allImages, "allImages");
    console.log(imagesShown, "imagesShown");

    // console.log(allImages, "allImages");

    const notInImagesShown = allImages.filter(
      ({ _id }) => !imagesShown.some((img) => img._id === _id)
    );

    console.log(notInImagesShown, "notInImagesShown");

    // for (let i = 0; i < allImages.length; i++) {
    //   console.log("uploaeded");
    //   if (!imagesShown.some((el) => el._id === allImages[i]._id)) {
    //     console.log(allImages[i]._id);
    //     const deletedImage = await datahandler.deleteItem(
    //       "images",
    //       allImages[i]._id
    //     );
    //   }
    // }

    // for (let i = 0; i < allImages.length; i++) {
    //   // if (imagesShown[i]._id) {
    //   //   const deletedImage = await datahandler.deleteItem(
    //   //     "imagesassigned",
    //   //     imagesShown[index]._id
    //   //   );
    //   // }

    //   if (allImages[i]._id === undefined) {
    //     const createImageRes = await datahandler.create("images", {
    //       base_64: allImages[i].base_64,
    //     });

    //     const createImageassignedRes = await datahandler.create(
    //       "imagesassigned",
    //       {
    //         assignment_id: task.id,
    //         image_id: createImageRes.id,
    //       }
    //     );
    //   }
    // }

    // const updateTaskRes = await datahandler.update(
    //   "tasks",
    //   task.id,
    //   updateTaskObj
    // );
  };

  const unassignUser = (user) => {
    setAssignedUsers(assignedUsers.filter((el) => el.id !== user.id));
    childData.current.setData((prevState) => [...prevState, user]);
  };

  function openModal(image) {
    setModalIsOpen(true);
    setModalImage(image.base_64);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const statusChange = (value) => {
    setStatus(value);
  };

  const childData = useRef();

  const removeImage = async (index) => {
    console.log(index);

    console.log(imagesShown, allImages, "imagesShown");

    const tmpImagesShown = imagesShown;
    tmpImagesShown.splice(index, 1);

    console.log(tmpImagesShown, "tmpImagesShown");

    setImagesShown(tmpImagesShown);
    forceUpdate();
  };

  useEffect(() => {
    console.log(imagesShown, "imagesShown");
  }, [imagesShown]);

  return (
    <div className="d-flex">
      <Container>
        <Row>
          <Col lg={8}>
            <p>Task</p>
            <div
              onMouseEnter={() => setTitleEditIconShown(true)}
              onMouseLeave={() => setTitleEditIconShown(false)}
            >
              <span className="d-flex justify-content-between">
                {!editTitle ? (
                  <h1>{title}</h1>
                ) : (
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                )}
                {titleEditIconShown ? (
                  !editTitle ? (
                    <AiFillEdit onClick={() => setEditTitle(!editTitle)} />
                  ) : (
                    <div>
                      <IoMdClose onClick={() => setEditTitle(!editTitle)} />
                    </div>
                  )
                ) : null}
              </span>
            </div>
            {subTasks?.length > 0 && <div>{taskProgress}</div>}
            {/* <p>{task?.status}</p> */}
            <select
              onChange={(e) => statusChange(e.target.value)}
              name="status"
              id="status"
            >
              <option value="to_do" selected={task?.status === "to_do"}>
                To do
              </option>
              <option
                selected={task?.status === "in_progress"}
                value="in_progress"
              >
                In Progress
              </option>
              <option selected={task?.status === "in_review"} value="in_review">
                In Review
              </option>
              <option selected={task?.status === "done"} value="done">
                Done
              </option>
            </select>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <div
              onMouseEnter={() => setDescriptionEditShown(true)}
              onMouseLeave={() => setDescriptionEditShown(false)}
            >
              <span className="d-flex justify-content-between">
                <h3>Description</h3>
                {descriptionEditIconShown ? (
                  !editDescription ? (
                    <AiFillEdit
                      onClick={() => setEditDescription(!editDescription)}
                    />
                  ) : (
                    <IoMdClose
                      onClick={() => setEditDescription(!editDescription)}
                    />
                  )
                ) : null}
              </span>
              {!editDescription ? (
                <p>{task?.description}</p>
              ) : (
                <textarea
                  style={{ width: "100%" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              )}
            </div>
            <div>
              <h3>Team</h3>
              {assignedUsers?.map((item) => {
                return (
                  <div className="d-flex">
                    <div className="d-flex">
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#ddd",
                        }}
                      >
                        <img
                          className="profile-picture-default"
                          src={item?.profile_picture?.base_64}
                        />
                      </div>
                      <div>
                        <p>{`${item.name}`}</p>
                        <p>{item.role}</p>
                      </div>
                    </div>
                    <IoMdClose onClick={() => unassignUser(item)} />
                  </div>
                );
              })}
              {assignMoreOpen && (
                <TaskSingleTeamDropdown
                  data={projectUsers}
                  setParentData={setAssignedUsers}
                  assignedUsers={assignedUsers}
                  ref={childData}
                />
              )}
              {!assignMoreOpen && (
                <button onClick={() => setAssignMoreOpen(true)}>
                  Assign More
                </button>
              )}
            </div>
            <div>
              <p>Images</p>
              <div className="d-flex">
                {imagesShown.map((item, index) => {
                  return (
                    <div
                      onMouseEnter={() => {
                        setHoveringOverImage(index);
                      }}
                      onMouseLeave={() => {
                        setHoveringOverImage(null);
                      }}
                      className="task-img-container"
                    >
                      {hoveringOverImage === index && (
                        <IoMdClose
                          onClick={() => removeImage(index)}
                          style={{ position: "absolute", cursor: "pointer" }}
                        />
                      )}
                      <img
                        onClick={() => openModal(item)}
                        className="task-images"
                        src={item.base_64}
                      />
                    </div>
                  );
                })}

                <MyDropzone
                  onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>
                          Drag 'n' drop some files here, or click to select
                          files
                        </p>
                      </div>
                    </section>
                  )}
                </MyDropzone>
              </div>
            </div>
            <button onClick={saveChanges}>SAVE</button>
          </Col>
          <Col lg={4}>
            <div>
              <h3>Subtasks</h3>
              {addSubTaskOpen && (
                <div>
                  <input
                    value={subTaskContent}
                    onChange={(e) => setSubTaskContent(e.target.value)}
                    type="text"
                    placeholder="Add an item"
                  ></input>
                  <button onClick={addSubTask}>Add</button>
                </div>
              )}
              {!addSubTaskOpen && (
                <button onClick={() => setAddSubTaskOpen(true)}>
                  Add an item
                </button>
              )}

              {subTasks &&
                subTasks.map((item, index) => {
                  return (
                    <>
                      <div className="d-flex justify-content-between">
                        <input
                          checked={item.done}
                          onChange={(e) => subTaskCheck(index, item.done)}
                          type="checkbox"
                        ></input>
                        <IoMdClose
                          onClick={() => removeSubtask(index, item._id)}
                        />
                      </div>
                      <p>{item.content}</p>
                    </>
                  );
                })}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Comments</h3>
          </Col>
        </Row>
      </Container>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <img src={modalImage} />
      </Modal>
    </div>
  );
}

export default TaskSingle;
