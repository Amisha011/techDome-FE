import React from "react";
import logo from "../../../src/assets/Images/mainLogo.svg";
import loanImg from "../../assets/Images/personal-loan.svg";
import UsetAuthForm from "../CommonComponents/UserAuthForm";
import { Link } from "react-router-dom";
import LogoImg from "../../assets/Images/Personal-Loan-App-Icon.png";

const Signup = () => {
  return (
    <div className="login-page">
      <div className="login-col login-left-container">
        <img className="" src={loanImg} alt="" />
      </div>
      <div
        className={`login-right-container`}
      >
        <img src={LogoImg} style={{ height: "150px" }}></img>
        <h1>Sign up with your email!</h1>
        <UsetAuthForm formType="SignUp" />
        <p className="sign-up mt-3">
          Already have an account? <Link to="/">SignIn Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
