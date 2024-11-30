"use client";

import { useState } from "react";
import Link from "next/link";
import { Amplify } from "aws-amplify";
import { signIn, confirmSignIn, signOut } from "aws-amplify/auth";

import Loader from "@/app/react-contact-form/components/loader";

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
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [requestOTP, setRequestOTP] = useState(false);
    const [loading, setLoading] = useState(false);

    const usernameChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUsername(event.target.value);
    };

    const OTPChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOTP(event.target.value);
    };

    async function getOTPClickHandler(event: React.MouseEvent) {
        event.preventDefault();

        setLoading(true);

        await signOut();

        await signIn({
            username,
            options: { authFlowType: "USER_AUTH" },
        });

        await confirmSignIn({ challengeResponse: "EMAIL_OTP" });

        setRequestOTP(true);
        setLoading(false);
    }

    async function loginClickHandler(event: React.MouseEvent) {
        event.preventDefault();

        setLoading(true);
        const response = await confirmSignIn({ challengeResponse: OTP });

        setIsSignedIn(response.isSignedIn);
        localStorage.setItem("isSignedIn", "true")
        setLoading(false);
    }

    return (
        <section style={{ fontSize: 24, maxWidth: 600, margin: "0 auto" }}>
            <h1>Passworless Login</h1>

            <div style={{ background: "#f2f2cd", padding: 20, margin: "20px 0" }}>
                if you don&apos;t have an account, first {" "}
                <Link
                    href="/react-aws-cognito-passwordless-login/sign-up"
                    style={{ textDecoration: "underline" }}
                >
                    create one
                </Link>
            </div>

            <div style={{ margin: "40px 0 0" }}>
                <h2>Step 1: Request OTP</h2>
                <small>Enter your email to request a one-time password (OTP):</small>
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
                    onClick={getOTPClickHandler}
                >
                    Get One-Time Password
                </a>
            </div>

            {requestOTP && (
                <div style={{ background: "#f2f2cd", padding: 20, margin: "40px 0 0" }}>
                    OTP sent! Check your email.
                </div>
            )}

            <div style={{ margin: "40px 0 0" }}>
                <h2>Step 2: Log in</h2>
                <small>To log in, enter the OTP you received in your email:</small>
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
                    onClick={loginClickHandler}
                >
                    Log in
                </a>
            </div>

            {isSignedIn && (
                <div style={{ background: "#f2f2cd", padding: 20, margin: "40px 0 0" }}>
                    You signed in successfully! You can now go to your{" "}
                    <Link
                        href="/react-aws-cognito-passwordless-login/profile"
                        style={{ textDecoration: "underline" }}
                    >
                        Profile
                    </Link>
                </div>

            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                {loading && <Loader />}
            </div>
        </section>
    );
}
