import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from "@solana/web3.js"
import * as bip39 from "bip39"
import { useEffect, useState } from "react"

import "./style.css"

const NETWORK = "https://api.devnet.solana.com"

function IndexPopup() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    if (publicKey) {
      fetchBalance()
    }
  }, [publicKey])

  const createWallet = async () => {
    const newMnemonic = bip39.generateMnemonic()
    setMnemonic(newMnemonic)
    const seed = await bip39.mnemonicToSeed(newMnemonic)
    const keypair = Keypair.fromSeed(seed.slice(0, 32))
    setPublicKey(keypair.publicKey.toString())
  }

  const importWallet = async () => {
    const userMnemonic = prompt("Enter your mnemonic phrase")
    if (userMnemonic && bip39.validateMnemonic(userMnemonic)) {
      setMnemonic(userMnemonic)
      const seed = await bip39.mnemonicToSeed(userMnemonic)
      const keypair = Keypair.fromSeed(seed.slice(0, 32))
      setPublicKey(keypair.publicKey.toString())
    } else {
      alert("Invalid mnemonic phrase")
    }
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
      fetchBalance() // 更新余额
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Solana Wallet</h1>
      {!publicKey ? (
        <div className="wallet-actions">
          <button className="button create" onClick={createWallet}>
            Create New Wallet
          </button>
          <button className="button import" onClick={importWallet}>
            Import Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-info">
          <div className="info-item">
            <span className="label">Public Key:</span>
            <span className="value">{publicKey}</span>
          </div>
          <div className="info-item">
            <span className="label">Balance:</span>
            <span className="value">
              {balance !== null ? `${balance} SOL` : "Loading..."}
            </span>
          </div>
          {mnemonic && (
            <div className="mnemonic-section">
              <button
                className="button toggle-mnemonic"
                onClick={() => setShowMnemonic(!showMnemonic)}>
                {showMnemonic ? "Hide" : "Show"} Mnemonic
              </button>
              {showMnemonic && <div className="mnemonic">{mnemonic}</div>}
            </div>
          )}
          <div className="send-sol-section">
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
            <button className="button send" onClick={sendSOL}>
              Send SOL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
