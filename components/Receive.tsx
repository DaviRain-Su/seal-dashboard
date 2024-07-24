import React from "react"

const Receive = ({ publicKey }) => (
  <div className="page receive">
    <h2>Receive SOL</h2>
    <p>Your wallet address:</p>
    <div className="address-display">{publicKey}</div>
    {/* 可以添加二维码显示 */}
  </div>
)

export default Receive
