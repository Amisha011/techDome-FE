import React from "react";
import logo from "../../../src/assets/Images/mainLogo.svg";
import "./Login.css";
import loanImg from "../../assets/Images/personal-loan.svg";
import UserAuthForm from "../CommonComponents/UserAuthForm";
import { Link } from "react-router-dom";
import LogoImg from "../../assets/Images/Personal-Loan-App-Icon.png";
const Login = () => {
  return (
    <div className="login-page">
      <div className="login-col login-left-container">
        <img className="" src={loanImg} alt="" />
      </div>
      <div
        className={`login-right-container`}
        style={{ padding: " 36px 100px 100px 100px" }}
      >
        <img src={LogoImg} style={{ height: "150px" }}></img>
        <h1 className="mb-1" style={{ textAlign: "start" }}>
          Welcome back!
        </h1>
        <p style={{ textAlign: "start" }}>
          Sign In with your email to check your Loan details
        </p>
        <UserAuthForm formType={"Login"} />
        {/* <p className="forgotPassword mt-3">
          <Link to="/forgot-password">Forgot Password</Link>
        </p> */}
        <p className="sign-up mt-3">
          Don’t have an account? <Link to="/SignUp">Signup Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
