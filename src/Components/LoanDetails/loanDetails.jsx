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
  const [totalCompleteLoans, setTotalCompleteLoans] = useState(0);
  const [totalPendingLoans, setTotalPendingLoans] = useState(0);
  const [totalApprovedLoans, setTotalApprovedLoans] = useState(0);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [repaymentEnteredAmount, setRepaymentEnteredAmount] = useState(0);
  const [selectedLoan, setSelectedLoan] = useState({});
  const [selectedInstallmentIndex, setSelectedInstallmentIndex] = useState(0);
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

    setAllLoans(response?.data);
    const completeLoans = response?.data?.filter(
      (obj) => obj?.loanStatus === "Completed"
    );
    const totalPendingLoans = response.data.filter(
      (obj) => obj?.loanStatus === "Pending"
    );
    const totalApprovedLoans = response.data.filter(
      (obj) => obj?.loanStatus === "Approved"
    );
    setTotalCompleteLoans(completeLoans.length);
    setTotalPendingLoans(totalPendingLoans.length);
    setTotalApprovedLoans(totalApprovedLoans.length);
  };
  const handleInstallmentPayment = async () => {
    var totalPaid;
    const remainingAmount = selectedLoan?.amount - selectedLoan?.totalPaidAmount;
    if (
      repaymentEnteredAmount <
      selectedLoan?.installments[selectedInstallmentIndex]?.weeklyAmount
    ) {
      toast.error("Please enter the required Amount");
      return;
    } else if (
      repaymentEnteredAmount > remainingAmount ||
      repaymentEnteredAmount %
        selectedLoan?.installments[selectedInstallmentIndex]?.weeklyAmount !==
        0
    ) {
      toast.error("Please enter the amount in a way eg: if installment amount is 100 you can pay 100, 200, 300 but not 120");
      return;
    } else {
      var data = repaymentEnteredAmount;
      var installmentInex = selectedInstallmentIndex;
      var arr = selectedLoan?.installments;
      do {
        //selectedLoan.installments[installmentInex].status = "Paid";
        arr[installmentInex].status = "Paid";
        arr[installmentInex].weeklyAmount =
          selectedLoan?.installments[installmentInex].weeklyAmount;
        data -= selectedLoan?.installments[installmentInex]?.weeklyAmount;
        installmentInex += 1;
      } while (data > 0);
    }
    totalPaid = selectedLoan?.totalPaidAmount + parseInt(repaymentEnteredAmount);
    const res = await axios
      .patch(`http://localhost:7000/updateInstallments/${selectedLoan._id}`, {
        installments: arr,
        totalPaidAmount: totalPaid,
      })
      .then((res) => {
        toast.success("Payment Successfully Completed");
        const checkCompletedLoan = selectedLoan?.installments?.every(
          (installment) => installment.status === "Paid"
        );
        if (checkCompletedLoan) {
          const res = axios
            .patch(
              `http://localhost:7000/updateLoanStatus/${selectedLoan._id}`,
              {
                loanStatus: "Completed",
              }
            )
            .then((res) => {
              getallLoans();
              setSelectedInstallmentIndex(0);
              setRepaymentEnteredAmount(0);
              setSelectedLoan({});
              setShowPaymentModal(false);
              setShowLoanDetails(false);
            })
            .catch((err) => toast.err(err));
        } else {
          getallLoans();
          setSelectedInstallmentIndex(0);
          setRepaymentEnteredAmount(0);
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
          <span className="number mb-2">{totalCompleteLoans}</span>
          <span className="text">Total Loans</span>
        </div>
        <div
          className="dashboard-box box-2"
          style={{ backgroundImage: "linearradient(#D4145A , #FBB03B)" }}
        >
          <span className="number mb-2">{totalPendingLoans}</span>
          <span className="text">Pending Loans</span>
        </div>
        <div className="dashboard-box box-3">
          <span className="number mb-2">{totalApprovedLoans}</span>
          <span className="text">Approved Loans</span>
        </div>
        <div className="dashboard-box box-4">
          <span className="number mb-2">{totalCompleteLoans}</span>
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
                  className="d-flex loandetails-top"
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
                    <h2  className="loan-amount" style={{ marginRight: "40px", color: "#0c0c73" }}>
                    Rs.&nbsp;{loanData?.amount}
                    </h2>
                    <OverlayTrigger
                      key="bottom4"
                      placement="bottom"
                      overlay={
                        loanData?.loanStatus !== "Pending" ? (
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
                          if (showLoanDetails) {
                            setShowLoanDetails(false);
                            setSelectedLoan({});
                          } else {
                            setShowLoanDetails(true);
                            setSelectedLoan(loanData);
                          }
                        }}
                        src={downArrow}
                        style={{ height: "15px", cursor:"pointer" }}
                      ></img>
                    </OverlayTrigger>
                  </div>
                </div>
                <div
                  className="d-flex loandetails-bottom"
                  style={{ justifyContent: "space-between" }}
                >
                  <div>
                    <span className="d-flex">
                      <b style={{ color: "#21c707" }}>Start Date:</b>&nbsp;
                      <p style={{ color: "dimgrey", fontWeight: "700" }}>
                        {moment(loanData?.createdAt).format("Do MMM' YY")}
                      </p>
                    </span>
                  </div>
                  <div>
                    <span className="d-flex">
                      <b style={{ color: "red" }}>End Date:</b>&nbsp;
                      <p style={{ color: "slategrey", fontWeight: "700" }}>
                        {loanData?.installments?.length > 0
                          ? moment(
                              loanData?.installments[
                                loanData?.installments.length - 1
                              ]?.date
                            ).format("Do MMM' YY")
                          : "NA"}
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
                        {loanData?.loanStatus}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
              {showLoanDetails && loanData?._id === selectedLoan?._id && (
                <div style={{ margin: "0px 50px" }}>
                  {" "}
                  {loanData?.installments.map((installmentData, index) => {
                    return (
                      <div className="loan-body">
                        <div>
                          <span>
                            <b>Installment {index + 1}</b>
                          </span>
                        </div>
                        <div>
                          <span>
                            <b>Date: </b>
                            {moment(installmentData?.date).format("Do MMM' YY")}
                          </span>
                        </div>
                        <div>
                          <span>
                            <b>Amount: </b>
                           Rs. {installmentData?.weeklyAmount}
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
                              style={{ backgroundColor: "red", width: "72px" }}
                              onClick={() => {
                                if (
                                 index > 0 && loanData?.installments[index - 1].status ==
                                  "Pending" 
                                ) {
                                  toast.error(
                                    "Please Pay The Previous Installment First"
                                  );
                                  return;
                                }
                                setShowPaymentModal(true);
                                setSelectedLoan(loanData);
                                setSelectedInstallmentIndex(index);
                              }}
                              className="approveButton"
                            >
                              Pay
                            </button>
                          ) : (
                            <button
                              disabled={true}
                              className="approveButton"
                              style={{ width: "72px" }}
                            >
                              Paid
                            </button>
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
            defaultValue={repaymentEnteredAmount}
            placeholder="Enter the Amount"
            onChange={(e) => setRepaymentEnteredAmount(e.target.value)}
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
