import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
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
        </div>
      )}
    </div>
  )
}

export default IndexPopup
