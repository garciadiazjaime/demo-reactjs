"use client";

import { useState } from "react";

export default function Page() {
  const [counter, setCounter] = useState(0);

  const incrementClickHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setCounter((prevCounter) => prevCounter + 1);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <a
        href="#"
        style={{
          display: "inline-block",
          padding: "20px 40px",
          fontSize: 28,
          border: "1px solid black",
          width: "100%",
          textAlign: "center",
          marginTop: 40,
        }}
        onClick={incrementClickHandler}
      >
        Increment {counter}
      </a>
    </div>
  );
}
