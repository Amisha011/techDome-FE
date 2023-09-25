import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import "./Admin.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [allLoans, setAllLoans] = useState([]);
  const [show, setShow] = useState(false);
  const [selcetedLoan, setSelectedLoan] = useState({});
  const userType = localStorage.getItem("userType");

  const getallLoans = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllLoans`);
    setAllLoans(response.data);
  };
  const handleApproveLoan = async () => {
    var startDate = new Date(); // Start date is today
    var weeklyAmount = selcetedLoan?.amount / selcetedLoan?.terms; // Replace this with your weekly amount
    var numInstallments = selcetedLoan.terms; // Number of installments
    var endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (numInstallments - 1) * 7); // Calculate end date

    var installmentObjects = [];
    for (var i = 0; i < numInstallments; i++) {
      var installmentDate = new Date(startDate);
      installmentDate.setDate(installmentDate.getDate() + i * 7);
      var integerAmount = parseInt(weeklyAmount);
      // Create an object for each installment
      var installmentObject = {
        date: installmentDate.toDateString(),
        weeklyAmount: integerAmount,
        status: "Pending",
      };

      installmentObjects.push(installmentObject);
    }

    const res = await axios
      .patch(`${process.env.REACT_APP_API_URL}/updateLoanStatus/${selcetedLoan._id}`, {
        loanStatus: "Approved",
        installments: installmentObjects,
        loanApproveDate: new Date(),
      })
      .then((res) => {
        setSelectedLoan({});
        setShow(false);
        toast.success("Approved Loan Request Successfully");
        getallLoans();
      })
      .catch((err) => toast.err(err));
    setSelectedLoan({});
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    getallLoans();
  }, []);

  useEffect(() => {
    if (userType !== "Admin") {
      navigate("/");
    }
  }, []);

  return (
    <div style={{ margin: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Admin Portal</h1>
        <button onClick={handleLogout} className="logOut-btn">
          LogOut
        </button>
      </div>
      <div className="pendingreq-text" style={{ alignItems: "start" }}>
        <span style={{ textAlign: "left" }}>Pending Loan Requests</span>
      </div>
      <div className="loanReq-container">
        {allLoans && allLoans.length > 0 ? (
          allLoans.map((loanData) => {
            return (
              <div className="loan-body-Admin">
                <div>
                  <span>
                    <b>UserId: </b>
                    {loanData?.userId}
                  </span>
                </div>
                <div>
                  <span>
                    <b>CreatedAt: </b>
                    {moment(loanData?.createdAt).format("Do MMM' YY")}
                  </span>
                </div>
                <div>
                  <span>
                    <b>Amount: </b>
                    {loanData?.amount}
                  </span>
                </div>
                <div>
                  <span>
                    <b>Terms: </b>
                    {loanData?.terms}
                  </span>
                </div>
                <div>
                  {loanData?.loanStatus === "Pending" ? (
                    <button
                    style={{backgroundColor:"red"}}
                      onClick={() => {
                        setShow(true);
                        setSelectedLoan(loanData);
                      }}
                      className="approveButton-Admin"
                    >
                      Approve
                    </button>
                  ) : (
                    <button 
                    style={{backgroundColor:"green"}}
                     disabled={true} className="approveButton-Admin">
                      {loanData?.loanStatus}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="pendingreq-text">
            <span>No Pending request found</span>
          </div>
        )}
      </div>
      <Modal
        size="md"
        className="warning-modal loanReq-modal"
        show={show}
        onHide={() => {
          setShow(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <span>Are you sure you want to Approve Loan request ?</span>
          <div className="btn-container">
            <button
              className="cancelBtn"
              onClick={() => setShow(false)}
              
            >
              No
            </button>
            <button
              className="YesBtn"
              onClick={handleApproveLoan}
              
            >
              Yes
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Admin;
