"use client";

import { useState } from "react";
import Script from 'next/script'

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
        event.preventDefault();

        setFeedback("");
        setLoading(true);

        window.grecaptcha.enterprise.ready(async () => {
            const token = await window.grecaptcha.enterprise.execute(process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY, { action: 'LOGIN' });

            const response = await submit(token as string);

            setLoading(false);
            setFeedback(response);
        });
    };

    return (
        <main style={{ maxWidth: 600, margin: "0 auto", fontSize: 24 }}>
            <Script src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY}`} />
            <h1 style={{ padding: "20px 0" }}>Recaptcha</h1>
            <a
                onClick={loginClickHandler}
                style={{
                    width: "100%",
                    margin: "12px 0",
                    display: "block",
                    padding: 20,
                    border: "1px solid black",
                    textAlign: "center",
                    cursor: "pointer",
                }}
            >
                Submit
            </a>
            {loading && <Loader />}
            {feedback && (
                <pre style={{ fontFamily: "monospace" }}>
                    {JSON.stringify(feedback, null, 2)}
                </pre>
            )}
        </main>
    );
}
