import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import imageToBase64 from "image-to-base64/browser";
import * as datahandler from "../../helpers/dataHandler";

import Dashboard from "../../pages/dashboard";
import Projects from "../../pages/projects";
import Tasks from "../../pages/tasks";
import TaskSingle from "../../pages/task.single";
import ProjectSingle from "../../pages/project.single";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";

import { Auth } from "../../context/AuthContext";

Modal.setAppElement("#root");

function Sidebar() {
  let subtitle;
  const [user, setUser] = useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalProfilePicture, setModalProfilePicture] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const decoded = jwt_decode(token);

    (async () => {
      const userData = await datahandler.show(`users/basic/${decoded._id}`);
      setUser(userData);
      console.log(userData, "===userData 2131231");
    })();

    console.log(decoded, "===decoded");
  }, []);

  const authContext = useContext(Auth);
  const navigate = useNavigate();

  const logout = () => {
    console.log(authContext, "===authContext");
    authContext.dispatch({ type: "LOG_OUT" });
    navigate("/");
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      //Make new filereader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load something...
      reader.onload = () => {
        // Make a fileinfo object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((item) => {
        getBase64(item)
          .then((res) => {
            setModalProfilePicture(res);
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
      // Do something with the files
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <div {...getRootProps()}>
        {modalProfilePicture ? (
          <img src={modalProfilePicture} />
        ) : (
          <>
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="dashboard-profile-picture">
                Drop the files here ...
              </div>
            ) : (
              <div className="dropzone-profile-picture">
                Drag 'n' drop some files here, or click to select files
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const modalSaveHandler = async () => {
    console.log(user._id, "===user._id");

    const imageAssignedExists = await datahandler.show(
      `imagesassigned/assignment_id/${user._id}`
    );

    console.log(imageAssignedExists, "imageassignedExists");

    if (imageAssignedExists) {
      const updatedImageRes = await datahandler.update(
        `images`,
        imageAssignedExists.image_id,
        { base_64: modalProfilePicture }
      );
    } else {
      const insertImageRes = await datahandler.create("images", {
        base_64: modalProfilePicture,
      });

      const insertImageAssignedRes = await datahandler.create(
        "imagesassigned",
        {
          assignment_id: user._id,
          image_id: insertImageRes._id,
        }
      );

      const updateUserRes = await datahandler.update("users", user._id, {
        profile_picture: insertImageAssignedRes._id,
      });
    }

    console.log(modalProfilePicture, "==modalProfilePicture");

    setProfilePicture(modalProfilePicture);

    closeModal();
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setModalProfilePicture("");
    setIsOpen(false);
  }

  return (
    <>
      <div className="sidebar-wrapper">
        <h1>LOGO</h1>

        <Modal
          className="profile-picture-modal"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
        >
          <MyDropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                {console.log(modalProfilePicture, "modalProfilePicture")}
                {modalProfilePicture ? (
                  <img
                    className="profile-picture-dashboard-modal"
                    src={modalProfilePicture}
                  />
                ) : (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                )}
              </section>
            )}
          </MyDropzone>
          <div className="d-flex justify-content-between">
            <button onClick={closeModal}>Close</button>
            <button onClick={modalSaveHandler}>Save</button>
          </div>
        </Modal>

        <div>
          <ul className="sidebar-list">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/tasks">Tasks</Link>
            </li>
          </ul>
          <div>
            <div onClick={openModal} className="sidebar-profile-img">
              {console.log(user, "user")}
              <img
                style={{ width: "100%" }}
                className="sidebar-profile-img"
                src={profilePicture || user?.profile_picture?.base_64}
              />
            </div>
            {console.log(authContext)}
            <p>{`${user.first_name} ${user.last_name}`}</p>
          </div>
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
