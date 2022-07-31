import React, { useEffect, useState } from "react";
import "./App.css";

async function connect(onConnected) {
  if (!window.ethereum) {
    alert("Get MetaMask!");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  onConnected(accounts[0]);
}

async function checkIfWalletIsConnected(onConnected) {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      const account = accounts[0];
      onConnected(account);
      return;
    }
  }
}

export default function MetaMaskAuth() {
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected(setUserAddress);
  }, []);

  return userAddress ? (
    <div>
      <h3>Connected Successfully !!</h3>
      <br />
      <p className="address">{userAddress}</p>
    </div>
  ) : (
    <button className="button" onClick={() => connect(setUserAddress)}>
      Connect to MetaMask
    </button>
  );
}
