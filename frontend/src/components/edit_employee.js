import React from "react";
import AccountInfoContext from "./ctx/account-context";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
const api_host = "http://127.0.0.1:8000";

function EditEmployee(props) {
  const AccountCTX = useContext(AccountInfoContext);
  useEffect(() => {
    AccountCTX.loginCheck();
  }, []);
  return AccountCTX.access_token ? <EditEmployeeFrom /> : "";
}
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
function EditEmployeeFrom() {
  const AccountCTX = useContext(AccountInfoContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(initialEmployee);
  useEffect(() => {
    getEmployeById();
  }, [id]);
  async function getEmployeById() {
    const meta = await axios.get(api_host + "/user_svc/employee/" + id, {
      headers: { authorization: AccountCTX.access_token },
    });
    setEmployee(meta.data.data);
  }

  function handleChange(e) {
    setEmployee((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));
  }

  async function updateEmployee(e) {
    e.preventDefault();
    let data = await axios.put(
      api_host + "/user_svc/employee/" + id + "/",
      employee,
      {
        headers: { authorization: AccountCTX.access_token },
      }
    );
    navigate("/employee");
  }

  return (
    <>
      <div className="container p-5">
        <h1 className="text-muted">Update Employee Info</h1>
        <hr />
        {employee && (
          <div className="bg-white border rounded border-gray-200 p-2 shadow-sm">
            <h4>
              Public Id:{" "}
              <span className="text-success">{employee.web3_address}</span>
            </h4>
        <hr />

            <div className="row">
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    name="name"
                    id="name"
                    className="form-control"
                    type="text"
                    value={employee.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    name="email"
                    id="email"
                    className="form-control"
                    type="email"
                    value={employee.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    name="address"
                    id="address"
                    className="form-control"
                    type="text"
                    value={employee.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    name="age"
                    id="age"
                    className="form-control"
                    type="number"
                    value={employee.age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="sex">Sex</label>
                  <select
                    name="sex"
                    id="sex"
                    className="form-control"
                    value={employee.sex}
                    onChange={handleChange}
                  >
                    <option value={"Other"}>I don't want to say</option>
                    <option value={"Male"}>Male</option>
                    <option value={"Female"}>Female</option>
                  </select>
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="ssn">SSN</label>
                  <input
                    name="ssn"
                    id="ssn"
                    className="form-control"
                    type="text"
                    value={employee.ssn}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {AccountCTX.user_obj && AccountCTX.user_obj.role == "employer" ? (
                <>
                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="salary">Yearly Salary</label>
                      <input
                        name="salary"
                        id="salary"
                        className="form-control bg-dark text-white"
                        type="text"
                        value={employee.salary}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        name="title"
                        id="title"
                        className="form-control bg-dark text-white"
                        type="text"
                        value={employee.title}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="salary">Yearly Salary</label>
                      <h4>${employee.salary}</h4>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <h4>{employee.title}</h4>
                    </div>
                  </div>
                </>
              )}
              <div className="col-3 m-auto mt-3">
                <Button onClick={updateEmployee}>Update</Button>
              </div>
            </div>
          </div>
        )}

        <hr />
        <a href="/" className="btn btn-success m-3">
          Home
        </a>
      </div>
    </>
  );
}
export default EditEmployee;
