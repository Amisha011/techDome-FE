import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { Component } = props;

  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  useEffect(() => {
    let isAuthorized = localStorage.getItem("token");
    if (!isAuthorized) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Component />
    </>
  );
};
export default ProtectedRoute;
