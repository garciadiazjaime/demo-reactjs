'use client';

import { SessionProvider } from "next-auth/react"

import LoginButton from "./login-btn"

export default function Page() {
    return (
        <SessionProvider>
            <LoginButton />
        </SessionProvider>
    );
}   
