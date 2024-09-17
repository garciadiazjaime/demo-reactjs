"use client";

import { MetaMaskInpageProvider } from "@metamask/providers";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

function Button(props: { connectWalletHandler: () => void; address: string }) {
  const styles = {
    display: "inline-block",
    padding: "20px 40px",
    border: "5px solid black",
    fontSize: 24,
    cursor: "pointer",
  };

  if (props.address) {
    const shortAddress = `${props.address.slice(0, 7)}...${props.address.slice(
      -5
    )}`;
    return <div style={styles}>Wallet: {shortAddress}</div>;
  }

  if (typeof window !== "undefined" && window.ethereum) {
    return (
      <div style={styles} onClick={props.connectWalletHandler}>
        Connect wallet
      </div>
    );
  }

  return (
    <a
      href="https://metamask.io/"
      target="_blank"
      rel="nofollow"
      style={styles}
    >
      Install Metamask
    </a>
  );
}

export default function Page() {
  const [clientSide, setClientSide] = useState(false);
  const [address, setAddress] = useState("");

  const connectWalletHandler = async () => {
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
      params: [],
    });

    if (!Array.isArray(accounts) || !accounts.length) {
      return;
    }

    setAddress(accounts[0]);
  };

  useEffect(() => {
    setClientSide(true);
  }, []);

  if (!clientSide) {
    return <></>;
  }

  return (
    <div
      style={{
        margin: "0 auto",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button connectWalletHandler={connectWalletHandler} address={address} />
    </div>
  );
}
