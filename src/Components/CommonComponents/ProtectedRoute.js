import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  
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
