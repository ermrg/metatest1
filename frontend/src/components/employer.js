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

  async function getEmployees(url = "") {
    if (!url) {
      url = api_host + "/user_svc/employees/";
    }
    const meta = await axios.get(url, {
      headers: { authorization: AccountCTX.access_token },
    });
    setEmployees_obj(meta.data);
  }
  function serachEmployee(query) {
    let url = api_host + "/user_svc/employees/";
    if (query) {
      url += "?query=" + query;
    }
    console.log(query);
    getEmployees(url);
  }
  return AccountCTX.access_token ? (
    <EmployerDetail
      employees={employees}
      getEmployees={getEmployees}
      serachEmployee={serachEmployee}
    />
  ) : (
    <>
      <div className="container p-5">
        <h1 className="text-muted">Employeer Dashboard</h1>
        <hr />
        <Button
          onClick={() => AccountCTX.connectWallet({ role: "employer" })}
          className="btn btn-primary text-white"
        >
          Employer Login With MetaMask
        </Button>
        {/* <hr /> */}
        <a href="/" className="btn btn-success m-3">
          Home
        </a>
      </div>
    </>
  );
}
function EmployerDetail(props) {
  const AccountCTX = useContext(AccountInfoContext);
  const { employees, getEmployees, serachEmployee } = props;
  const [query, setQuery] = useState("");

  function handleChange(e) {
    setQuery(e.target.value);
  }
  function search() {
    serachEmployee(query);
  }
  console.log(query);
  return (
    <>
      <div className="container">
        <h1>Employee List</h1>
        {employees ? (
          <>
            <div className="pagination m-3 d-flex justify-content-between">
              <div>
                {employees.previous && (
                  <Button
                    type="button"
                    className="btn btn-sm btn-warning m-2"
                    onClick={() => getEmployees(employees.previous)}
                  >
                    Prev
                  </Button>
                )}

                {employees.next && (
                  <Button
                    type="button"
                    className="btn btn-sm m-2"
                    onClick={() => getEmployees(employees.next)}
                  >
                    Next
                  </Button>
                )}
              </div>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control mr-2"
                  onChange={handleChange}
                  placeholder="Serach By Name"
                />
                <Button className="ml-2" onClick={search}>
                  Search
                </Button>
              </div>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>SSN</th>
                  <th>Yearly Salary</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.results.map((emp, key) => (
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
                    <td>${emp.salary}</td>
                    <td>{emp.title}</td>
                    <td>
                      <a
                        type="button"
                        href={`/edit-employee/${emp.id}`}
                        className="btn btn-danger"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p>
              {employees.count && (
                <Button
                  type="button"
                  className="btn btn-sm btn-secondary m-2"
                  title="Total"
                >
                  Total {employees.count}
                </Button>
              )}
              <span>Per Page: {employees.results.length}</span>
            </p>
            <p></p>
          </>
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
      </div>
    </>
  );
}

export default Employer;
