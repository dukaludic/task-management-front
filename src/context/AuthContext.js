import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});

  const initalState = {
    data: {
      isAuthenticated: false,
      user: [],
    },
  };

  return (
    <>
      <AuthContext.provider state={initalState}>
        {children}
      </AuthContext.provider>
    </>
  );
}
