import { Connection, PublicKey } from "@solana/web3.js"
import React, { useEffect, useState } from "react"

const NETWORK = "https://api.devnet.solana.com"

const History = ({ publicKey }) => {
  const [transactions, setTransactions] = useState([])
  const [showTransactions, setShowTransactions] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      const connection = new Connection(NETWORK, "confirmed")
      const txs = await connection.getSignaturesForAddress(
        new PublicKey(publicKey)
      )
      setTransactions(txs)
    }
    fetchTransactions()
  }, [publicKey])

  return (
    <div className="page history">
      <h2>Transaction History</h2>
      <button
        className="button secondary"
        onClick={() => setShowTransactions(!showTransactions)}>
        📜 {showTransactions ? "Hide" : "Show"} Transaction History
      </button>
      {showTransactions && (
        <div className="transaction-list">
          {transactions.map((tx, index) => (
            <div key={index} className="transaction-item">
              <span className="transaction-signature">
                {tx.signature.slice(0, 20)}...
              </span>
              <span className="transaction-date">
                {new Date(tx.blockTime * 1000).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History
