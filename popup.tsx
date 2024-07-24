import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} from "@solana/web3.js"
import * as bip39 from "bip39"
import React, { useEffect, useState } from "react"

import "./style.css"

import History from "./components/History"
import Home from "./components/Home"
import NetworkSettings from "./components/NetworkSettings"
import Receive from "./components/Receive"
import Send from "./components/Send"

function IndexPopup() {
  const [publicKey, setPublicKey] = useState(null)
  const [balance, setBalance] = useState(null)
  const [mnemonic, setMnemonic] = useState(null)
  const [currentPage, setCurrentPage] = useState("home")
  const [network, setNetwork] = useState("https://api.devnet.solana.com")

  useEffect(() => {
    const loadWallet = async () => {
      const savedPublicKey = localStorage.getItem("publicKey")
      const savedMnemonic = localStorage.getItem("mnemonic")
      if (savedPublicKey && savedMnemonic) {
        setPublicKey(savedPublicKey)
        setMnemonic(savedMnemonic)
        await updateBalance(savedPublicKey)
      }
    }
    loadWallet()
  }, [network])

  const updateBalance = async (address) => {
    const connection = new Connection(network, "confirmed")
    const balance = await connection.getBalance(new PublicKey(address))
    setBalance(balance / LAMPORTS_PER_SOL)
  }

  const createWallet = async () => {
    const mnemonic = bip39.generateMnemonic()
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const keypair = Keypair.fromSeed(seed.slice(0, 32))
    const publicKey = keypair.publicKey.toString()

    setPublicKey(publicKey)
    setMnemonic(mnemonic)
    localStorage.setItem("publicKey", publicKey)
    localStorage.setItem("mnemonic", mnemonic)
    await updateBalance(publicKey)
  }

  const logout = () => {
    setPublicKey(null)
    setMnemonic(null)
    setBalance(null)
    localStorage.removeItem("publicKey")
    localStorage.removeItem("mnemonic")
  }

  const handleNetworkChange = (newNetwork) => {
    setNetwork(newNetwork)
    if (publicKey) {
      updateBalance(publicKey)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home publicKey={publicKey} balance={balance} />
      case "send":
        return (
          <Send
            publicKey={publicKey}
            balance={balance}
            updateBalance={updateBalance}
            network={network}
          />
        )
      case "receive":
        return <Receive publicKey={publicKey} />
      case "history":
        return <History publicKey={publicKey} network={network} />
      default:
        return <Home publicKey={publicKey} balance={balance} />
    }
  }

  return (
    <div className="container">
      <h1 className="title">Solana Wallet</h1>
      <NetworkSettings onNetworkChange={handleNetworkChange} />
      {!publicKey ? (
        <div className="wallet-actions">
          <button className="button primary" onClick={createWallet}>
            Create New Wallet
          </button>
          <button className="button secondary" onClick={() => {}}>
            Import Wallet
          </button>
        </div>
      ) : (
        <>
          {renderPage()}
          <nav className="navigation">
            <button onClick={() => setCurrentPage("home")}>Home</button>
            <button onClick={() => setCurrentPage("send")}>Send</button>
            <button onClick={() => setCurrentPage("receive")}>Receive</button>
            <button onClick={() => setCurrentPage("history")}>History</button>
          </nav>
          <button className="button danger" onClick={logout}>
            🚪 Logout
          </button>
        </>
      )}
    </div>
  )
}

export default IndexPopup
