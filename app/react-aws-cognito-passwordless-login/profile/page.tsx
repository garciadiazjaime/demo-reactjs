"use client";

import { useEffect } from 'react';
import { redirect } from 'next/navigation'
import { Amplify } from "aws-amplify";
import { signOut } from "aws-amplify/auth";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID as string,
            userPoolClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID as string,
        },
    },
});

export default function Page() {
    const logOutClickHandler = async (event: React.MouseEvent) => {
        event.preventDefault();

        await signOut();

        localStorage.removeItem("isSignedIn")
        redirect("/react-aws-cognito-passwordless-login/login");
    };



    useEffect(() => {
        if (localStorage.getItem("isSignedIn") !== "true") {
            redirect("/react-aws-cognito-passwordless-login/login");
        }
    }, []);

    return (
        <div style={{ fontSize: 24, maxWidth: 600, margin: "0 auto" }}>
            <h1>Welcome to your Profile</h1>
            <div style={{ margin: "20px 0 0" }}>
                <a
                    style={{
                        padding: 20,
                        border: "1px solid black",
                        cursor: "pointer",
                        display: "block",
                        textAlign: "center",
                    }}
                    onClick={logOutClickHandler}
                >
                    Log out
                </a>
            </div>
        </div>
    );
}
