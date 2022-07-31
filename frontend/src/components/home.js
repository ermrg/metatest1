import React from "react";
import AccountInfoContext from "./ctx/account-context";
import { useEffect, useState, useContext } from "react";
function Home(props) {
  const AccountCTX = useContext(AccountInfoContext);

  useEffect(() => {
    AccountCTX.loginCheck();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          {!AccountCTX.user_obj ||
          (AccountCTX.user_obj && AccountCTX.user_obj.role != "employee") ? (
            <div className="col">
              <div className="bg-primary p-5 rounded">
                <a href="/employer" className="text-white text-decoration-none">
                  <h3>Employer </h3>
                  Dashboard
                </a>
              </div>
            </div>
          ) : (
            ""
          )}
          {!AccountCTX.user_obj ||
          (AccountCTX.user_obj && AccountCTX.user_obj.role != "employer") ? (
            <div className="col">
              <div className="bg-danger p-5 rounded">
                <a href="/employee" className="text-white text-decoration-none">
                  <h3>Employee </h3>
                  Dashboard
                </a>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
