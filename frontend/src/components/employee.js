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
  return AccountCTX.user_obj ? (
    <>
      <h1>Employee Profile</h1>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Sex</th>
            <th>SSN</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{AccountCTX.user_obj.id}</td>
            <td>
              <h4>{AccountCTX.user_obj.name}</h4>
              <p>{AccountCTX.user_obj.web3_address}</p>
            </td>
            <td>{AccountCTX.user_obj.email}</td>
            <td>{AccountCTX.user_obj.age}</td>
            <td>{AccountCTX.user_obj.sex}</td>
            <td>{AccountCTX.user_obj.ssn}</td>
            <td>
              <Button className="btn btn-danger">Edit</Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <hr />
      <Button onClick={AccountCTX.logout} className="btn-main">
        Logout
      </Button>
      <a href="/" className="btn btn-success m-3">
        Home
      </a>
    </>
  ) : (
    ""
  );
}

export default Employee;
