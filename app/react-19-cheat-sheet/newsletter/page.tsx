"use client";

import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError("");

        if (!emailRegex.test(value)) {
            setError("Invalid email");
            return;
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "0 auto", fontSize: 24 }}>
            <form onSubmit={handleSubmit}>
                <input
                    style={{ width: "100%", padding: 8, fontSize: 20 }}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter your email"
                />
                <button
                    style={{ width: "100%", padding: 8, fontSize: 20, margin: "20px 0" }}
                    type="submit"
                >
                    Submit
                </button>
            </form>

            {error && <p style={{ color: "red", fontSize: 20 }}>{error}</p>}
        </div>
    );
}
