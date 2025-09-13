"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

import Loader from "@/app/react-contact-form/components/loader";

const submit = async (code: string) => {
    const response = await fetch("/.netlify/functions/react-recaptcha-v3-nextjs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
    });

    return response.json();
};

export default function Page() {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const loginClickHandler = (event: { preventDefault: () => void }) => {
        if (process.env.NEXT_PUBLIC_RE_CAPTCHA_STATUS !== "1") {
            return null;
        }
        event.preventDefault();

        setFeedback("");
        setLoading(true);

        window.grecaptcha.enterprise.ready(async () => {
            const token = await window.grecaptcha.enterprise.execute(
                process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY,
                { action: "LOGIN" }
            );

            const response = await submit(token as string);

            setLoading(false);
            setFeedback(response);
        });
    };

    return (
        <main
            style={{
                maxWidth: 600,
                margin: "0 auto",
                fontSize: 18,
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Script
                src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY}`}
            />
            <h1
                style={{
                    padding: "20px 0",
                    textAlign: "center",
                    color: "#333",
                    fontSize: "28px",
                }}
            >
                Recaptcha
            </h1>
            <a
                onClick={loginClickHandler}
                style={{
                    width: "100%",
                    margin: "12px 0",
                    display: "block",
                    padding: "15px",
                    border: "2px solid #007BFF",
                    textAlign: "center",
                    cursor: "pointer",
                    color: "#007BFF",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "background-color 0.3s, color 0.3s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007BFF") &&
                    (e.currentTarget.style.color = "#fff")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent") &&
                    (e.currentTarget.style.color = "#007BFF")
                }
            >
                Submit
            </a>
            {loading && <Loader />}
            {feedback && (
                <pre
                    style={{
                        fontFamily: "monospace",
                        backgroundColor: "#e9ecef",
                        padding: "10px",
                        borderRadius: "4px",
                        overflowX: "auto",
                        color: "#333",
                    }}
                >
                    {JSON.stringify(feedback, null, 2)}
                </pre>
            )}
            {process.env.NEXT_PUBLIC_RE_CAPTCHA_STATUS !== "1" && (
                <p
                    style={{
                        color: "#dc3545",
                        textAlign: "center",
                        marginTop: "20px",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                >
                    This form is disabled for now, as it has reached the monthly quota for reCAPTCHA v3. Please contact me if you have any questions.
                </p>
            )}
        </main>
    );
}
