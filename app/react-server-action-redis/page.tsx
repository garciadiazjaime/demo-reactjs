'use client'

import { useEffect, useState } from "react";
import { writeToRedis, readFromRedis } from "./actions";

export default function Page() {
    const [inputValue, setInputValue] = useState("");
    const [name, setName] = useState("");

    const handleButtonClick = async () => {
        await writeToRedis(inputValue);
        setInputValue("");
        await fetchName();
    };

    const fetchName = async () => {
        const nameFromRedis = await readFromRedis();
        setName(nameFromRedis);
    };

    useEffect(() => {
        fetchName();
    }, []);

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
            <h1 style={{ color: "#333", marginBottom: "20px" }}>Redis Server Action</h1>
            <p style={{ color: "#555", marginBottom: "20px" }}>
                This is a simple example of a server action using Redis.
            </p>
            <p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{
                        width: "80%",
                        padding: "10px",
                        fontSize: "16px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                    maxLength={50}
                    placeholder="say hi"
                />
                <button
                    onClick={handleButtonClick}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginLeft: "10px",
                    }}
                >
                    Submit
                </button>
            </p>
            {name && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        color: "#333",
                        fontSize: "18px",
                    }}
                >
                    <strong>Stored Name:</strong> {name}
                </div>
            )}
        </div>
    );
}
