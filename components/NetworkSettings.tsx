import React, { useEffect, useState } from "react"

const NetworkSettings = ({ onNetworkChange }) => {
  const [selectedNetwork, setSelectedNetwork] = useState("devnet")
  const [customRPC, setCustomRPC] = useState("")

  const networks = {
    mainnet: "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
    custom: customRPC
  }

  useEffect(() => {
    onNetworkChange(networks[selectedNetwork])
  }, [selectedNetwork, customRPC])

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value)
  }

  const handleCustomRPCChange = (e) => {
    setCustomRPC(e.target.value)
    if (selectedNetwork === "custom") {
      onNetworkChange(e.target.value)
    }
  }

  return (
    <div className="network-settings">
      <h3>Network Settings</h3>
      <select
        value={selectedNetwork}
        onChange={handleNetworkChange}
        className="input">
        <option value="mainnet">Mainnet</option>
        <option value="devnet">Devnet</option>
        <option value="custom">Custom</option>
      </select>
      {selectedNetwork === "custom" && (
        <input
          type="text"
          value={customRPC}
          onChange={handleCustomRPCChange}
          placeholder="Enter custom RPC URL"
          className="input"
        />
      )}
    </div>
  )
}

export default NetworkSettings
