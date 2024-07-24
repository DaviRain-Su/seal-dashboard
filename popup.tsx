import { useState } from "react"

import "./style.css" // 我们将创建这个文件来存放CSS

function IndexPopup() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <h1 className="title">Hello World!</h1>
      <p className="subtitle">Welcome to your beautiful Plasmo Extension!</p>
      <div className="counter">
        <button className="button" onClick={() => setCount(count - 1)}>
          -
        </button>
        <span className="count">{count}</span>
        <button className="button" onClick={() => setCount(count + 1)}>
          +
        </button>
      </div>
      <p className="info">You've clicked {count} times</p>
    </div>
  )
}

export default IndexPopup
