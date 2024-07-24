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
import React, { useState } from "react"

const NETWORK = "https://api.devnet.solana.com"

const Send = ({ publicKey, balance, updateBalance, network }) => {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")

  const sendSOL = async () => {
    try {
      const connection = new Connection(network, "confirmed")
      const mnemonic = localStorage.getItem("mnemonic")
      if (!mnemonic) {
        throw new Error("Mnemonic not found")
      }
      const seed = await bip39.mnemonicToSeed(mnemonic)
      const fromKeypair = Keypair.fromSeed(seed.slice(0, 32))

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL
        })
      )

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeypair]
      )

      console.log("Transaction sent:", signature)
      alert("Transaction successful!")
      setRecipient("")
      setAmount("")
      await updateBalance(publicKey)
    } catch (error) {
      console.error("Error sending transaction:", error)
      alert("Error sending transaction: " + error.message)
    }
  }

  return (
    <div className="page send">
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
      <button onClick={sendSOL} className="button primary">
        Send SOL
      </button>
    </div>
  )
}

export default Send
