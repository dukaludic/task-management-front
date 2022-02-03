import { createContext, useReducer } from "react";

const initialState = {
  data: {
    isAuthenticated: false,
    user: [],
  },
};

export const globalState = createContext(initialState);

const { Provider } = globalState;

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const currentState = { ...state };
    switch (action.type) {
      case "SET_DATA":
        currentState.data = action.payload;

        return currentState;
      case "LOG_IN":
        currentState.data = action.payload;
        break;
      case "LOGOUT":
        currentState.data = {
          isAuthenticated: false,
          user: [],
        };
        return currentState;
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
