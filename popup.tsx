import {
  ConfirmedSignatureInfo,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from "@solana/web3.js"
import * as bip39 from "bip39"
import React, { useEffect, useState } from "react"
import {
  FaEye,
  FaEyeSlash,
  FaHistory,
  FaPaperPlane,
  FaSignOutAlt
} from "react-icons/fa"

import "./style.css"

const NETWORK = "https://api.devnet.solana.com"

function IndexPopup() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>([])
  const [showTransactions, setShowTransactions] = useState(false)

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("walletMnemonic")
    if (storedMnemonic) {
      importWallet(storedMnemonic)
    }
  }, [])

  useEffect(() => {
    if (publicKey) {
      fetchBalance()
      fetchTransactions()
    }
  }, [publicKey])

  const createWallet = async () => {
    const newMnemonic = bip39.generateMnemonic()
    saveWallet(newMnemonic)
  }

  const importWallet = async (userMnemonic?: string) => {
    const mnemonicToUse = userMnemonic || prompt("Enter your mnemonic phrase")
    if (mnemonicToUse && bip39.validateMnemonic(mnemonicToUse)) {
      saveWallet(mnemonicToUse)
    } else {
      alert("Invalid mnemonic phrase")
    }
  }

  const saveWallet = async (mnemonicToSave: string) => {
    setMnemonic(mnemonicToSave)
    localStorage.setItem("walletMnemonic", mnemonicToSave)
    const seed = await bip39.mnemonicToSeed(mnemonicToSave)
    const keypair = Keypair.fromSeed(seed.slice(0, 32))
    setPublicKey(keypair.publicKey.toString())
  }

  const fetchBalance = async () => {
    if (publicKey) {
      const connection = new Connection(NETWORK, "confirmed")
      const balance = await connection.getBalance(new PublicKey(publicKey))
      setBalance(balance / LAMPORTS_PER_SOL)
    }
  }

  const sendSOL = async () => {
    if (!publicKey || !mnemonic) {
      alert("Please create or import a wallet first")
      return
    }

    const connection = new Connection(NETWORK, "confirmed")
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const fromKeypair = Keypair.fromSeed(seed.slice(0, 32))

    try {
      const toPublicKey = new PublicKey(recipient)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: LAMPORTS_PER_SOL * parseFloat(amount)
        })
      )

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeypair]
      )

      alert(`Transaction sent! Signature: ${signature}`)
      fetchBalance()
      fetchTransactions()
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const fetchTransactions = async () => {
    if (publicKey) {
      const connection = new Connection(NETWORK, "confirmed")
      const signatures = await connection.getSignaturesForAddress(
        new PublicKey(publicKey)
      )
      setTransactions(signatures)
    }
  }

  const logout = () => {
    localStorage.removeItem("walletMnemonic")
    setPublicKey(null)
    setBalance(null)
    setMnemonic(null)
    setShowMnemonic(false)
    setTransactions([])
    setShowTransactions(false)
  }

  return (
    <div className="container">
      <h1 className="title">Solana Wallet</h1>
      {!publicKey ? (
        <div className="wallet-actions">
          <button className="button primary" onClick={createWallet}>
            Create New Wallet
          </button>
          <button className="button secondary" onClick={() => importWallet()}>
            Import Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-info">
          <div className="info-card">
            <h2>Wallet Details</h2>
            <div className="info-item">
              <span className="label">Public Key:</span>
              <span className="value">
                {publicKey.slice(0, 20)}...{publicKey.slice(-4)}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Balance:</span>
              <span className="value">
                {balance !== null ? `${balance} SOL` : "Loading..."}
              </span>
            </div>
          </div>

          {mnemonic && (
            <div className="mnemonic-section">
              <button
                className="button secondary"
                onClick={() => setShowMnemonic(!showMnemonic)}>
                {showMnemonic ? <FaEyeSlash /> : <FaEye />}{" "}
                {showMnemonic ? "Hide" : "Show"} Mnemonic
              </button>
              {showMnemonic && <div className="mnemonic">{mnemonic}</div>}
            </div>
          )}

          <div className="send-sol-section">
            <h2>Send SOL</h2>
            <input
              type="text"
              placeholder="Recipient Public Key"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Amount (SOL)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
            <button className="button primary" onClick={sendSOL}>
              <FaPaperPlane /> Send SOL
            </button>
          </div>

          <div className="transaction-history">
            <button
              className="button secondary"
              onClick={() => setShowTransactions(!showTransactions)}>
              <FaHistory /> {showTransactions ? "Hide" : "Show"} Transaction
              History
            </button>
            {showTransactions && (
              <div className="transaction-list">
                {transactions.map((tx, index) => (
                  <div key={index} className="transaction-item">
                    <span className="transaction-signature">
                      {tx.signature.slice(0, 20)}...
                    </span>
                    <span className="transaction-date">
                      {new Date(tx.blockTime! * 1000).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="button danger" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
