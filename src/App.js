import logo from "./logo.svg";
import "./App.css";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/SignUp/SignUp";
import LoanDashboard from "./Components/LoanDetails/loanDetails";
import Admin from "./Components/Admin/Admin";
import ProtectedRoute from "./Components/CommonComponents/ProtectedRoute";
function App() {
  return (
    <div className="App">
      {/* <Login/> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      <ToastContainer />
      <Routes>
        <Route path="/" Component={Login}></Route>
        <Route path="/SignUp" Component={Signup}></Route>
        <Route path="/dashboard" element={<ProtectedRoute Component={LoanDashboard}/>}></Route>
        <Route path ="/Admin" element={<ProtectedRoute  Component={Admin} ComponnetType="Admin" />}></Route>
      </Routes>
    </div>
  );
}

export default App;
