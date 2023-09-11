import React, { useEffect, useState } from "react";
import "./loanDetails.css";
import "../Admin/Admin.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import downArrow from "../../assets/Images/downArrow.svg";
import moment from "moment";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const LoanDashboard = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [allLoans, setAllLoans] = useState([]);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [installmnetPayAmount, setInstllmentPayAmount] = useState(0);
  const [selcetedLoan, setSelectedLoan] = useState({});
  const [paymentIndex, setPaymentIndex] = useState(0);
  const [shownewLoanModal, setshowNewLoanModal] = useState(false);
  const [loanTerm, setLoanTerm] = useState(0);
  const [newLoanAmount, setNewLoanAmount] = useState(0);
  const userId = localStorage.getItem("userId");
  const [loader, setLoader] = useState(false);
  const handleNewLoan = async () => {
    setLoader(true);
    const formData = {
      userId: userId,
      amount: newLoanAmount,
      terms: loanTerm,
      loanStatus: "Pending",
    };
    const response = await axios
      .post("http://localhost:7000/createLoan", formData)
      .then((res) => {
        setLoader(false);
        toast.success("Loan Created Successfully");
        setshowNewLoanModal(false);
        getallLoans();
      })
      .catch((err) => {
        setLoader(false);
        setshowNewLoanModal(false);
        toast.error(err?.response?.data?.error);
      });
  };
  const getallLoans = async () => {
    const response = await axios.get(
      `http://localhost:7000/getAllLoansById/${userId}`
    );
    setAllLoans(response.data);
  };
  const handleInstallmentPayment = async () => {
    var updatedObject;
    var totalPaid;

    updatedObject = {
      weeklyAmount: parseInt(installmnetPayAmount),
      status: "Paid",
    };
    totalPaid = selcetedLoan.totalPaidAmount + parseInt(installmnetPayAmount);

    const installment = selcetedLoan.installments;
    installment[paymentIndex].weeklyAmount = updatedObject?.weeklyAmount;
    installment[paymentIndex].status = updatedObject?.status;

    const res = await axios
      .patch(`http://localhost:7000/updateInstallments/${selcetedLoan._id}`, {
        installments: installment,
        totalPaidAmount: totalPaid,
      })
      .then((res) => {
        // setSelectedLoan({});
        toast.success("Payment Successfully Completed");
        const remainingInstallment = selcetedLoan.installments.filter(
          (obj) => obj.status === "Pending"
        );const updatedLoanData= allLoans.find((obj)=>obj._id== selcetedLoan._id)
        console.log(updatedLoanData)
        console.log("res",res.data)
        console.log("rem insta", remainingInstallment);
        const remainingAmount =
          selcetedLoan.amount - selcetedLoan.totalPaidAmount;
console.log("rem amt", remainingAmount)
        const newInstallmentAmount = remainingAmount / remainingInstallment.length;
        console.log("newInstallmentAmount",newInstallmentAmount)
        const updatedArray = remainingInstallment.map((data) =>  data.status === "Pending" ? { ...data, weeklyAmount: newInstallmentAmount }: data);
        console.log(updatedArray);
        const checkCompletedLoan = selcetedLoan?.installments?.every(
          (installment) => installment.status === "Paid"
        );
        if (checkCompletedLoan) {
          const res = axios
            .patch(
              `http://localhost:7000/updateLoanStatus/${selcetedLoan._id}`,
              {
                loanStatus: "Completed",
              }
            )
            .then((res) => {
              getallLoans();
              setPaymentIndex(0);
              setInstllmentPayAmount(0);
              setSelectedLoan({});
              setShowPaymentModal(false);
              setShowLoanDetails(false);
            })
            .catch((err) => toast.err(err));
        } else {
          getallLoans();
          setPaymentIndex(0);
          setInstllmentPayAmount(0);
          setSelectedLoan({});
          setShowPaymentModal(false);
          setShowLoanDetails(false);
        }
      })
      .catch((err) => toast.err(err));
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    getallLoans();
  }, []);

  useEffect(() => {
    if (userType !== "user") navigate("/");
  }, []);
  return (
    <div className="loanDashboard-conatiner">
      <div
        className="banner d-flex"
        style={{ justifyContent: "space-between" }}
      >
        <span>Welcome to the TechDome Loan Application !</span>
        <button onClick={handleLogout} className="logOut-btn">
          LogOut
        </button>
      </div>
      <div className="dashboard-header">
        <div
          className="dashboard-box box-1"
          style={{ backgroundImage: "linearradient(#09203F , #537895)" }}
        >
          <span className="number mb-2">2</span>
          <span className="text">Total Loans</span>
        </div>
        <div
          className="dashboard-box box-2"
          style={{ backgroundImage: "linearradient(#D4145A , #FBB03B)" }}
        >
          <span className="number mb-2">3</span>
          <span className="text">Pending Loans</span>
        </div>
        <div className="dashboard-box box-3">
          <span className="number mb-2">2</span>
          <span className="text">Approved Loans</span>
        </div>
        <div className="dashboard-box box-4">
          <span className="number mb-2">2</span>
          <span className="text">Complete Loans</span>
        </div>
      </div>

      <div className="dashboard-loanDetails">
        <h2>Loan details</h2>
        <button onClick={() => setshowNewLoanModal(true)}>Create Loan</button>
      </div>

      {allLoans && allLoans.length > 0 ? (
        allLoans.map((loanData, index) => {
          return (
            <>
              <div className="loanDetailContainer">
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    {/* <span>{moment(loanData.createdAt).format("Do MMM' YY")}</span> */}
                    <h2 style={{ color: "#0c0c73" }}>Loan {index + 1}</h2>
                  </div>
                  <div
                    className="d-flex flex-row"
                    style={{ alignItems: "center" }}
                  >
                    <h2 style={{ marginRight: "50px", color: "#0c0c73" }}>
                      {loanData.amount}
                    </h2>
                    <OverlayTrigger
                      key="bottom4"
                      placement="bottom"
                      overlay={
                        loanData.loanStatus !== "Pending" ? (
                          <span></span>
                        ) : (
                          <Tooltip id={`tooltip-bottom`}>
                            {" "}
                            Loan details will be visible only after Admin
                            Approves it.
                          </Tooltip>
                        )
                      }
                    >
                      <img
                        onClick={() => {
                          console.log("clickec", loanData.loanStatus !== "Pending")

                          loanData.loanStatus !== "Pending" &&
                            setShowLoanDetails(true);
                          setSelectedLoan(loanData);
                          console.log(showLoanDetails)
                        }}
                        src={downArrow}
                        style={{ height: "15px" }}
                      ></img>
                    </OverlayTrigger>
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <div>
                    <span className="d-flex">
                      <b style={{ color: "#21c707" }}>Start Date:</b>&nbsp;
                      <p style={{ color: "dimgrey", fontWeight: "700" }}>
                        {moment(loanData.createdAt).format("Do MMM' YY")}
                      </p>
                    </span>
                  </div>
                  <div>
                    <span className="d-flex">
                      <b style={{ color: "red" }}>End Date:</b>&nbsp;
                      <p style={{ color: "slategrey", fontWeight: "700" }}>
                        {moment(loanData.createdAt).format("Do MMM' YY")}
                      </p>
                    </span>
                  </div>
                  <div>
                    <span className="d-flex">
                      <b style={{ color: "darkblue" }}>No. of Terms:</b>&nbsp;
                      <p style={{ color: "orangered" }}>{loanData.terms}</p>
                    </span>
                  </div>
                  <div>
                    <span className="d-flex">
                      <b style={{ color: "chocolate" }}>Loan Status:</b>&nbsp;
                      <p style={{ color: "olivedrab", fontWeight: "700" }}>
                        {loanData.loanStatus}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
              {showLoanDetails && (
                <div style={{ margin: "0px 50px" }}>
                  {" "}
                  {loanData.installments.map((installmentData, index) => {
                    return (
                      <div className="loan-body">
                        <div>
                          <span>
                            <b>Installment {index + 1}</b>
                          </span>
                        </div>
                        <div>
                          <span>
                            <b>Date</b>
                            {moment(installmentData?.date).format("Do MMM' YY")}
                          </span>
                        </div>
                        <div>
                          <span>
                            <b>Amount: </b>
                            {installmentData?.weeklyAmount}
                          </span>
                        </div>
                        <div>
                          <span>
                            <b>Status: </b>
                            {installmentData?.status}
                          </span>
                        </div>
                        <div>
                          {installmentData?.status === "Pending" ? (
                            <button
                              onClick={() => {
                                setShowPaymentModal(true);
                                setSelectedLoan(loanData);
                                setPaymentIndex(index);
                              }}
                              className="approveButton"
                            >
                              Pay
                            </button>
                          ) : (
                            <span>Paid</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })
      ) : (
        <div>
          <span>No Loan Created yet</span>
        </div>
      )}
      <Modal
        size="md"
        className="warning-modal installmentPayment-modal"
        show={showPaymentModal}
        onHide={() => {
          setShowPaymentModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            borderBottom: "none",
            fontWeight: "700",
            fontSize: "22px",
            color: "#0A1E43",
          }}
        >
          Installment Payment
        </Modal.Header>
        <Modal.Body>
          <span>Amount</span>
          <input
            type="number"
            defaultValue={installmnetPayAmount}
            placeholder="Enter the Amount"
            onChange={(e) => setInstllmentPayAmount(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="btn-container">
            <button
              className="cancelBtn"
              onClick={() => setShowPaymentModal(false)}
              style={{ flex: "0 0 128px" }}
            >
              Cancel
            </button>
            <button
              className="YesBtn"
              onClick={handleInstallmentPayment}
              style={{ flex: "0 0 128px" }}
            >
              Pay
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        size="md"
        className="warning-modal installmentPayment-modal"
        show={shownewLoanModal}
        onHide={() => {
          setshowNewLoanModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            borderBottom: "none",
            fontWeight: "700",
            fontSize: "22px",
            color: "#0A1E43",
          }}
        >
          Create New Loan
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <span>Loan Amount</span>
            <input
              type="number"
              defaultValue={newLoanAmount}
              placeholder="Enter the Amount"
              onChange={(e) => setNewLoanAmount(Number(e.target.value))}
            />
          </div>
          <div
            className="d-flex"
            style={{ flexDirection: "column", marginTop: "21px" }}
          >
            <span>Loan Term</span>
            <input
              type="number"
              defaultValue={loanTerm}
              placeholder="Enter the Term"
              onChange={(e) => setLoanTerm(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="btn-container">
            <button
              className="cancelBtn"
              onClick={() => setshowNewLoanModal(false)}
              style={{ flex: "0 0 128px", width: "106px" }}
            >
              Cancel
            </button>
            <button
              className="YesBtn"
              onClick={handleNewLoan}
              style={{ flex: "0 0 128px", width: "106px" }}
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default LoanDashboard;
