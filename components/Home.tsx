import React from "react"

const Home = ({ publicKey, balance }) => (
  <div className="page home">
    <h2>Wallet Overview</h2>
    <div className="info-card">
      <div className="info-item">
        <span className="label">Public Key:</span>
        <span className="value">
          {publicKey.slice(0, 10)}...{publicKey.slice(-4)}
        </span>
      </div>
      <div className="info-item">
        <span className="label">Balance:</span>
        <span className="value">
          {balance !== null ? `${balance} SOL` : "Loading..."}
        </span>
      </div>
    </div>
  </div>
)

export default Home
