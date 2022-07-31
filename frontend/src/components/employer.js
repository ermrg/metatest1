import React from "react";
import AccountInfoContext from "./ctx/account-context";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import UserTable from "./UserTable";
import axios from "axios";
import { Table } from "react-bootstrap";
const api_host = "http://127.0.0.1:8000";

function Employer(props) {
  const AccountCTX = useContext(AccountInfoContext);
  const navigate = useNavigate();
  const [employees, setEmployees_obj] = useState(null);

  useEffect(() => {
    AccountCTX.loginCheck();
  }, []);

  useEffect(() => {
    if (AccountCTX.user_obj && AccountCTX.user_obj.role == "employee") {
      navigate("/employee");
    }
    if (AccountCTX.access_token) {
      getEmployees();
    }
  }, [AccountCTX.access_token]);
  async function getEmployees() {
    const meta = await axios.get(api_host + "/user_svc/get-employee", {
      headers: { authorization: AccountCTX.access_token },
    });
    setEmployees_obj(meta.data.data);
  }
  console.log(employees);

  return AccountCTX.access_token ? (
    <EmployerDetail employees={employees} />
  ) : (
    <>
      <Button
        onClick={() => AccountCTX.connectWallet({ role: "employer" })}
        className="btn btn-primary text-white"
      >
        Employer Login With MetaMask
      </Button>
      <hr />
      <a href="/" className="btn btn-success m-3">
        Home
      </a>
    </>
  );
}
function EmployerDetail(props) {
  const AccountCTX = useContext(AccountInfoContext);

  return (
    <>
      <h1>Employee List</h1>
      {props.employees ? (
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
            {props.employees.map((emp, key) => (
              <tr key={key}>
                <td>{emp.id}</td>
                <td>
                  <h4>{emp.name}</h4>
                  <p>{emp.web3_address}</p>
                </td>
                <td>{emp.email}</td>
                <td>{emp.age}</td>
                <td>{emp.sex}</td>
                <td>{emp.ssn}</td>
                <td>
                  <Button className="btn btn-danger">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        "No Employee Yet"
      )}
      <hr />
      <Button onClick={AccountCTX.logout} className="btn-main">
        Logout
      </Button>
      <a href="/" className="btn btn-success m-3">
        Home
      </a>
    </>
  );
}

export default Employer;
