import React, { useState, useEffect, useContext, useCallback } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineFundProjectionScreen,
  AiOutlineAreaChart,
  AiOutlineCluster,
  AiOutlineUnorderedList,
  AiOutlinePieChart,
  AiOutlineTeam,
  AiOutlineUser,
  AiOutlineClose,
} from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";
import defaultUser from "../../assets/images/default-user-image.png";
import { Auth } from "../../context/AuthContext";
import logo from "../../assets/images/grapes-mark-white.svg";
import jwt_decode from "jwt-decode";
import * as datahandler from "../../helpers/dataHandler";
import { BiBarChart } from "react-icons/bi";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import { GrProjects } from "react-icons/gr";
import { Spinner } from "react-bootstrap";

function Sidebar(props) {
  const [sidebarActive, setSidebarActive] = useState(true);
  const [logoTypo, setLogoTypo] = useState("");
  const [counter, setCounter] = useState(0);

  const [user, setUser] = useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalProfilePicture, setModalProfilePicture] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [userIsLoading, setUserIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const decoded = jwt_decode(token);

    console.log(token);

    (async () => {
      const userData = await datahandler.show(
        `users/basic/${decoded._id}`,
        authContext
      );
      setUser(userData);
      setUserIsLoading(false);
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
      `imagesassigned/assignment_id/${user._id}`,
      authContext
    );

    console.log(imageAssignedExists, "imageassignedExists");

    if (imageAssignedExists.length > 0) {
      const updatedImageRes = await datahandler.update(
        `images`,
        imageAssignedExists.image_id,
        { base_64: modalProfilePicture },
        authContext
      );
    } else {
      const insertImageRes = await datahandler.create(
        "images",
        {
          base_64: modalProfilePicture,
        },
        authContext
      );

      const insertImageAssignedRes = await datahandler.create(
        "imagesassigned",
        {
          assignment_id: user._id,
          image_id: insertImageRes._id,
        },
        authContext
      );

      const updateUserRes = await datahandler.update(
        "users",
        user._id,
        {
          profile_picture: insertImageAssignedRes._id,
        },
        authContext
      );
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

  // Typewriter effect
  useEffect(() => {
    // clearInterval(typeWriter);
    if (sidebarActive) {
      setLogoTypo("");
    } else {
      setLogoTypo("");
    }
    console.log("useeff");
  }, [sidebarActive]);

  useEffect(() => {
    if (logoTypo === "") {
      i = 0;
      setTimeout(typeWriter, 100);
    }
  }, [logoTypo]);

  let i = 0;
  const txt = "rapes.";
  const typeWriter = () => {
    console.log(i, "i");
    if (i < txt.length) {
      console.log(i, txt.charAt(i), "typeWriter");
      setLogoTypo((prevState) => (prevState += txt.charAt(i)));
      i++;
      setTimeout(typeWriter, 70);
    } else {
    }
  };

  return (
    <div className={`sidebar ${sidebarActive ? `active` : ``}`}>
      <Modal
        className="profile-picture-modal"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <div className="d-flex">
          <div className="sidebar-dropzone-container">
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
          </div>
          <div className="p-2 sidebar-profile-modal-inputs">
            <p className="h-3">Change Password</p>
            <p>Current password</p>
            <input type="password" className="login-input" />
            <p>New Password</p>
            <input type="password" className="login-input" />
            <p>Confirm Password</p>
            <input type="password" className="login-input" />
            <button onClick={modalSaveHandler}>Save</button>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <AiOutlineClose className="remove-review-icon" onClick={closeModal} />
        </div>
      </Modal>
      {console.log(sidebarActive)}
      <div>
        <div className="logo-content">
          {sidebarActive && (
            <>
              <img className="sidebar-logo-mark" src={logo} />
              <span className="sidebar-logo-rest">{logoTypo}</span>
            </>
          )}
        </div>

        <GiHamburgerMenu
          onClick={() => {
            setLogoTypo("");
            setSidebarActive((prevState) => !prevState);
            props.setSidebarActive((prevState) => !prevState);
          }}
          id="hamburger"
        />
        <ul className="nav-list b-1">
          <li>
            <NavLink
              exact
              className={(navData) =>
                navData.isActive ? "nav-active-link" : "nav-inactive-link"
              }
              to="/dashboard"
            >
              <BiBarChart className="sidebar-icon" />
              {sidebarActive && <span className="menu-item">Dashboard</span>}
            </NavLink>
            {!sidebarActive && (
              <>
                {console.log(sidebarActive, "sidebarActive")}
                <span className="tip">Dashboard</span>
              </>
            )}
          </li>
          <li>
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-active-link" : "nav-inactive-link"
              }
              to="/projects"
            >
              <AiOutlineCluster className="sidebar-icon" />
              {sidebarActive && <span className="menu-item">Projects</span>}
            </NavLink>
            {!sidebarActive && <span className="tip">Projects</span>}
          </li>
          <li>
            <NavLink
              exact
              className={(navData) =>
                navData.isActive ? "nav-active-link" : "nav-inactive-link"
              }
              to="/tasks"
            >
              <AiOutlineUnorderedList className="sidebar-icon" />
              {sidebarActive && <span className="menu-item">Tasks</span>}
            </NavLink>
            {!sidebarActive && <span className="tip">Tasks</span>}
          </li>
        </ul>
        {/* <hr id="sidebar-hr"></hr> */}
      </div>
      <div id="logout-btn-container">
        <div className="logout-btn-container b-1">
          <NavLink
            onClick={logout}
            style={{ marginLeft: "15px" }}
            className={(navData) =>
              navData.isActive ? "nav-active-link" : "nav-inactive-link"
            }
            to="/login"
          >
            <RiLogoutBoxLine className="sidebar-icon" />
            {sidebarActive && <span className="menu-item">Log out</span>}
          </NavLink>
          {!sidebarActive && <span className="tip logout-tip">Log out</span>}
        </div>
        <div className="sidebar-profile-container">
          {userIsLoading ? (
            <Spinner
              style={{ marginTop: "20px" }}
              variant="white"
              animation="border"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              {!sidebarActive ? (
                <div className="sidebar-user-icon">
                  <AiOutlineUser
                    onClick={openModal}
                    size={20}
                    id="sidebar-user-icon"
                  />

                  <span className="tip">Profile</span>
                </div>
              ) : (
                <div className="sidebar-profile-img-container">
                  <img
                    onClick={openModal}
                    className="sidebar-profile-img"
                    src={profilePicture || user?.profile_picture?.base_64}
                  />
                </div>
              )}

              {/* <img className="sidebar-profile-img" src={defaultUser} /> */}

              {sidebarActive && (
                <div className="sidebar-profile-info">
                  <div
                    style={{ color: "white" }}
                    className="b-2 sidebar-full-name"
                  >
                    {`${user.first_name} ${user.last_name}`}
                  </div>
                  <div style={{ color: "white" }} className="b-3 sidebar-role">
                    {user.role === "project_manager"
                      ? "Project manager"
                      : "Worker"}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
