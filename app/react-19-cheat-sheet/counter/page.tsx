"use client";

import { useState } from "react";

import Greeting from "../greeting";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", fontSize: 24 }}>
      <Greeting name="jaime" />

      <p style={{ margin: "20px 0" }}>Count: {count}</p>

      <button
        style={{ width: "100%", padding: 20, fontSize: 30, cursor: "pointer" }}
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}
