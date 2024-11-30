"use client";

import Link from "next/link";
import { useState } from "react";
import { Amplify } from "aws-amplify";
import {
    signUp,
    confirmSignUp,
} from "aws-amplify/auth";

import Loader from "@/app/react-contact-form/components/loader";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
            userPoolClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID as string,
        },
    },
});

function generatePassword() {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

    let allChars = lowercaseChars;
    allChars += uppercaseChars;
    allChars += numberChars;
    allChars += symbolChars;

    let password = "";
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars.charAt(randomIndex);
    }

    return password;
}

export default function Page() {
    const [OTP, setOTP] = useState("");
    const [username, setUsername] = useState("");
    const [accountConfirmed, setAccountConfirmed] = useState(false);
    const [accountCreated, setAccountCreated] = useState(false);
    const [loading, setLoading] = useState(false);

    const usernameChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUsername(event.target.value);
    };

    const OTPChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOTP(event.target.value);
    };

    async function createAccountClickHandler(event: React.MouseEvent) {
        event.preventDefault();
        if (!username) {
            return;
        }

        setLoading(true);
        const password = generatePassword();

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
        setLoading(false);
    }

    async function confirmAccountClickHandler(event: React.MouseEvent) {
        event.preventDefault();

        if (!OTP) {
            return;
        }

        setLoading(true);
        const response = await confirmSignUp({ username, confirmationCode: OTP });

        setAccountConfirmed(response.isSignUpComplete);
        setLoading(false);
    }

    return (
        <section style={{ fontSize: 24, maxWidth: 600, margin: "0 auto" }}>
            <h1>Passworless Login</h1>

            <div style={{ background: "#f2f2cd", padding: 20, margin: "20px 0" }}>
                if you have an account already, please {" "}
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
                >
                    Create Account
                </a>
            </div>
            {accountCreated && (
                <div style={{ background: "#f2f2cd", padding: 20, margin: "40px 0 0" }}>
                    Account created! Check your email for the confirmation code.
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

            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                {loading && <Loader />}
            </div>
        </section>
    );
}
