import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useContext } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";

import Login from "./helpers/login";
import Sidebar from "./components/shared/sidebar";

import { Auth } from "./context/AuthContext";
import Overview from "./pages/overview";
import Dashboard from "./pages/dashboard";
import Register from "./helpers/register";

function App() {
  const authContext = useContext(Auth);
  console.log(authContext.state.data.isAuthenticated);
  const isAuthenticated = authContext.state.data.isAuthenticated;
  return (
    <div className="App">
      <Router>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route exact path="*" element={<Dashboard />} />
            </>
          ) : (
            <>
              <Route exact path="/" element={<Login />}></Route>
              <Route exact path="/register" element={<Register />}></Route>
              <Route exact path="*" element={<Login />}></Route>
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
