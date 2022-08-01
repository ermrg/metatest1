import React from "react";
import "./styles.css";

import "bootstrap/dist/css/bootstrap.css";

import { AccountInfoContextProvider } from "./components/ctx/account-context";
import Home from "./components/home";
import Employee from "./components/employee";
import Employer from "./components/employer";
import EditEmployee from "./components/edit_employee";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <AccountInfoContextProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/employer" element={<Employer />} />
            <Route exact path="/edit-employee/:id" element={<EditEmployee />} />
            <Route exact path="/employee" element={<Employee />} />
            <Route exact path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </AccountInfoContextProvider>
  );
}
