"use client";

import { useRef, useState } from "react";

import ReCAPTCHA from "react-google-recaptcha";

import Loader from "@/app/react-contact-form/components/loader";

const submit = async (code: string) => {
    const response = await fetch("/react-recaptcha-v3-nextjs/api", {
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

    const reCaptchaRef = useRef<ReCAPTCHA>(null);

    async function onReCaptchaChange(value: string | null) {
        const response = await submit(value as string);

        setLoading(false);
        setFeedback(response);
    }

    const loginClickHandler = (event: { preventDefault: () => void }) => {
        setFeedback("");
        setLoading(true);
        event.preventDefault();
        reCaptchaRef?.current?.execute();
    };

    return (
        <main style={{ maxWidth: 600, margin: "0 auto", fontSize: 24 }}>
            <ReCAPTCHA
                ref={reCaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY as string}
                size="invisible"
                onChange={onReCaptchaChange}
            />
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
