"use client";

import { useState } from "react";

export default function Dictionary() {
    const [counter, setCounter] = useState({ value: 0 });

    const invalidIncrement = () => {
        counter.value += 1; // wrong way ❌
        setCounter(counter);
    };

    const validIncrement = () => {
        const newCounter = {
            ...counter,
            value: counter.value + 1,
        }; // right way ✅
        setCounter(newCounter);
    };

    return (
        <div style={{ maxWidth: 420, margin: "0 auto", fontSize: 24 }}>
            <p style={{ margin: "20px 0" }}>Count: {counter.value}</p>
            <button
                style={{ width: "100%", padding: 20, fontSize: 26, cursor: "pointer" }}
                onClick={invalidIncrement}
            >
                Invalid Increment (property ❌)
            </button>

            <button
                style={{
                    width: "100%",
                    padding: 20,
                    fontSize: 26,
                    cursor: "pointer",
                    marginTop: 20,
                }}
                onClick={validIncrement}
            >
                Valid Increment (object ✅){" "}
            </button>
        </div>
    );
}
