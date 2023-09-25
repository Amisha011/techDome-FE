import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import EyeIcon from "../../assets/Images/eye_icon.svg";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const UserAuthForm = (formTypeName) => {
  const formType = formTypeName.formType;
  const Navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  const handleLogin = async () => {

    const loginData = {
      email,
      password,
    };
    if (email === "" || password === "") {
      toast.error("Please enter valid  credentials");
      return;
    }
    if (email?.length > 5 && !regex.test(email)) {
      toast.error("You must enter a valid email address");
      return;
    }
    setLoader(true);
    const response = await axios
      .post(`${process.env.REACT_APP_API_URL}/signin`, loginData)
      .then((res) => {
        setLoader(false);
        localStorage.setItem("token", res?.data?.token);
        localStorage.setItem("userId", res?.data?.user?._id);
        localStorage.setItem("userType", res?.data?.user?.userType)
        if (res.data.user.userType === "Admin") {
          Navigate("/Admin");
        } else {
          Navigate("/dashboard");
        }
      })
      .catch((err) => {
        setLoader(false);
        toast.error(err.response.data.error);
      });
  };
  const handleSignup = async () => {
    const signUpData = {
      userName:name,
      email,
      password,
    };
    if (email === "" || password === "" || name === "") {
      toast.error("All fields are Mandatory");
      return;
    }
    if (email.length > 5 && !regex.test(email)) {
      toast.error("You must enter a valid email address");
      return;
    }
    if (password.length < 5) {
      toast.error("Password should atleast contain 5 characters");
      return;
    }
    setLoader(true);
    const response = await axios
      .post(`${process.env.REACT_APP_API_URL}/signup`, signUpData)
      .then((res) => {
        setLoader(false);
        toast.success("Account created successfuly");
        Navigate("/");
      })
      .catch((err) => {

        setLoader(false);
        toast.error(err?.response?.data?.error);
      });
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  return (
    <Form className="logInForm" style={{ maxWidth: "451px" }}>
      {formType === "SignUp" && (
        <Row className="mb-4">
          <Form.Group as={Col} md="12" controlId="name">
            <Form.Label className="d-flex">User Name</Form.Label>
            <Form.Control
              
              type="text"
              placeholder="Enter your User Name"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Row>
      )}
      <Row className="mb-4">
        <Form.Group as={Col} md="12" controlId="email">
          <Form.Label className="d-flex">Email</Form.Label>
          <Form.Control
            name="email"
            type="text"
            placeholder="Enter your email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row className="mb-4">
        <Form.Group
          className="pwd-wrapper"
          as={Col}
          md="12"
          controlId="password"
        >
          <Form.Label className="d-flex">Password</Form.Label>
          <Form.Control
            name="password"
            type={passwordShown ? "text" : "password"}
            placeholder="Enter your password"
            defaultValue={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <span
            className={
              passwordShown
                ? "hide-pwd password-show"
                : "show-pwd password-show"
            }
            onClick={togglePassword}
          >
            <img className="view-icon" src={EyeIcon} alt="view" />
          </span>
        </Form.Group>
      </Row>
      <Button
        className="solid-button-pink"
        style={{ width: "100%" }}
        onClick={formType === "SignUp" ? handleSignup : handleLogin}
      >
        {formType == "SignUp" ? "Sign Up" : "Sign In"} &nbsp;
        {loader && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
      </Button>
    </Form>
  );
};
export default UserAuthForm;
