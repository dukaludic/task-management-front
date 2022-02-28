import React, { createContext, useReducer } from "react";

export const Auth = createContext();

const AuthProvider = (props) => {
  const initialState = {
    data: {
      isAuthenticated: false,
      user: [],
    },
  };

  const reducer = (currentState, action) => {
    switch (action.type) {
      case "LOGIN":
        console.log("LOGIN");
        return {
          data: {
            isAuthenticated: true,
            user: action.payload,
          },
        };
        break;
      case "LOG_OUT":
        return {
          data: {
            isAuthenticated: false,
            user: null,
          },
        };
        break;

      default:
        return {
          data: {
            isAuthenticated: false,
            user: null,
          },
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Auth.Provider value={{ state, dispatch }}>{props.children}</Auth.Provider>
  );
};

export default AuthProvider;
