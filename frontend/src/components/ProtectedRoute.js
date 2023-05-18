import React from "react";
import { Route, useHistory } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const history = useHistory();

  if (!userInfo) {
    history.push("/guest");
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
