"use client";

import Link from "next/link";
import { useState } from "react";
import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp } from "aws-amplify/auth";

import Loader from "@/app/react-contact-form/components/loader";
import { generatePassword, validateEmail } from "@/app/react-aws-cognito-passwordless-login/support"

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
            userPoolClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID as string,
        },
    },
});

export default function Page() {
    const [OTP, setOTP] = useState("");
    const [username, setUsername] = useState("");
    const [accountConfirmed, setAccountConfirmed] = useState(false);
    const [accountCreated, setAccountCreated] = useState(false);
    const [accountCreationFeedback, setAccountCreationFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [accountConfirmedFeedback, setAccountConfirmedFeedback] = useState("");

    const usernameChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUsername(event.target.value);
    };

    const OTPChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOTP(event.target.value);
    };

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Enter") {
            createAccountClickHandler(event as unknown as React.MouseEvent);
        }
    }

    function OTPKeyDownHandler(event: React.KeyboardEvent) {
        if (event.key === "Enter") {
            confirmAccountClickHandler(event as unknown as React.MouseEvent);
        }
    }

    async function createAccountClickHandler(event: React.MouseEvent) {
        event.preventDefault();

        setAccountCreationFeedback("");
        setAccountConfirmedFeedback("");

        if (!username || !validateEmail(username)) {
            setAccountCreationFeedback("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        const password = generatePassword();

        try {
            await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email: username,
                    },
                },
            });
            setAccountCreated(true);
            setAccountCreationFeedback("");
        } catch (error) {
            if (error instanceof Error) {
                setAccountCreationFeedback(error.message);
            } else {
                setAccountCreationFeedback("An unknown error occurred.");
            }
        }

        setLoading(false);
    }

    async function confirmAccountClickHandler(event: React.MouseEvent) {
        event.preventDefault();

        if (!OTP) {
            setAccountConfirmedFeedback("Please enter the confirmation code.");
            return;
        }

        setLoading(true);
        setAccountConfirmedFeedback("");
        setAccountCreationFeedback("");

        try {
            const response = await confirmSignUp({ username, confirmationCode: OTP });

            setAccountConfirmed(response.isSignUpComplete);
        } catch (error) {
            setAccountConfirmedFeedback("Error confirming account. Please try again.");
        }


        setLoading(false);
    }

    return (
        <section style={{ fontSize: 24, maxWidth: 600, margin: "0 auto" }}>
            <h1>Passworless Login</h1>

            <div style={{ background: "#f2f2cd", padding: 20, margin: "20px 0" }}>
                if you have an account already, please{" "}
                <Link
                    href="/react-aws-cognito-passwordless-login/login"
                    style={{ textDecoration: "underline" }}
                >
                    log in
                </Link>
            </div>

            <h2>Step 1: Create Account</h2>
            <small>Enter your email:</small>
            <div>
                <input
                    type="text"
                    onChange={usernameChangeHandler}
                    value={username}
                    style={{ width: "100%", fontSize: 24, margin: "12px 0", padding: 12 }}
                    tabIndex={1}
                    onKeyDown={handleKeyDown}
                />
                <a
                    style={{
                        padding: 20,
                        border: "1px solid black",
                        cursor: "pointer",
                        display: "block",
                        textAlign: "center",
                    }}
                    onClick={createAccountClickHandler}
                    onKeyDown={handleKeyDown}
                    tabIndex={2}
                >
                    Create Account
                </a>
            </div>
            {accountCreated && (
                <div style={{ background: "#f2f2cd", padding: 20, margin: "40px 0 0" }}>
                    Account created! Check your email for the confirmation code.
                </div>
            )}
            {accountCreationFeedback && (
                <div style={{ background: "#f9dfde", padding: 20, margin: "40px 0 0" }}>
                    {accountCreationFeedback}
                </div>
            )}

            <div style={{ margin: "40px 0 0" }}>
                <h2>Step 2: Confirm Account</h2>
                <small>Enter the confirmation code you received on your email:</small>
                <input
                    type="text"
                    onChange={OTPChangeHandler}
                    value={OTP}
                    style={{ width: "100%", fontSize: 24, margin: "12px 0", padding: 12 }}
                    tabIndex={3}
                    onKeyDown={OTPKeyDownHandler}
                />
                <a
                    style={{
                        padding: 20,
                        border: "1px solid black",
                        cursor: "pointer",
                        display: "block",
                        textAlign: "center",
                    }}
                    onClick={confirmAccountClickHandler}
                    tabIndex={4}
                    onKeyDown={OTPKeyDownHandler}
                >
                    Confirmed Account
                </a>
            </div>

            {accountConfirmed && (
                <div style={{ background: "#f2f2cd", padding: 20, margin: "40px 0 0" }}>
                    Account confirmed! You can now{" "}
                    <Link
                        href="/react-aws-cognito-passwordless-login/login"
                        style={{ textDecoration: "underline" }}
                    >
                        log in
                    </Link>
                </div>
            )}

            {accountConfirmedFeedback && (
                <div style={{ background: "#f9dfde", padding: 20, margin: "40px 0 0" }}>
                    {accountConfirmedFeedback}
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                {loading && <Loader />}
            </div>
        </section>
    );
}
