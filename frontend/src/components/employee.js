import React from "react";
import AccountInfoContext from "./ctx/account-context";
import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import UserTable from "./UserTable";
import axios from "axios";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const api_host = "http://127.0.0.1:8000";
const initialEmployee = {
  name: "",
  email: "",
  age: "",
  sex: "Other",
  address: "",
  salary: "",
  title: "",
  ssn: "",
};
function Employee(props) {
  const AccountCTX = useContext(AccountInfoContext);

  useEffect(() => {
    AccountCTX.loginCheck();
  }, []);

  return AccountCTX.access_token ? (
    <EmployeeDetail />
  ) : (
    <>
      <Button
        onClick={() => AccountCTX.connectWallet({ role: "employee" })}
        className="btn btn-danger text-white"
        variant="outline-warning"
      >
        Employee Login With MetaMask
      </Button>
      <hr />
      <a href="/" className="btn btn-success m-3">
        Home
      </a>
    </>
  );
}
function EmployeeDetail() {
  const AccountCTX = useContext(AccountInfoContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (AccountCTX.user_obj && AccountCTX.user_obj.role == "employer") {
      navigate("/employer");
    }
  }, []);

  const [employee, setEmployee] = useState(initialEmployee);
  useEffect(() => {
    getEmployeById();
  }, [AccountCTX.user_obj.id]);
  async function getEmployeById() {
    const meta = await axios.get(
      api_host + "/user_svc/employee/" + AccountCTX.user_obj.id,
      {
        headers: { authorization: AccountCTX.access_token },
      }
    );
    setEmployee(meta.data.data);
  }
  return AccountCTX.user_obj ? (
    <>
      <div className="container p-5">
          <h1>Employee Profile</h1>
        <div className="bg-white border rounded border-gray-200 p-2 shadow-sm">
          <div className="bg-info p-3">
            <h4>Name: {employee.name}</h4>
            <p>{employee.web3_address}</p>
          </div>
          <div className="bg-warning p-3 m-4 rounded text-danger">
            <p className="lebel h4 text-muted m-3">Email: {employee.email}</p>
            <p className="lebel h4 text-muted m-3">Address: {employee.address}</p>
            <p className="lebel h4 text-muted m-3">Age: {employee.age}</p>
            <p className="lebel h4 text-muted m-3">Sex: {employee.sex}</p>
            <p className="lebel h4 text-muted m-3">SSN: {employee.ssn}</p>
            <p className="lebel h4 text-muted m-3">Y. Salary: ${employee.salary}</p>
            <p className="lebel h4 text-muted m-3">Title: {employee.title}</p>
            <a
              type="button"
              href={`/edit-employee/${employee.id}`}
              className="btn btn-danger"
            >
              Edit
            </a>
          </div>
       
          <hr />
          <Button onClick={AccountCTX.logout} className="btn-main">
            Logout
          </Button>
          <a href="/" className="btn btn-success m-3">
            Home
          </a>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}

export default Employee;
