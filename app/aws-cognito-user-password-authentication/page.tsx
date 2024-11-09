'use client'

import { useState, useEffect } from "react"
import SignUpForm from "./sign-up-form"
import ConfirmAccountForm from "./confirm-account-form"
import SignInForm from "./sign-in-form"
import Dashboard from "./dashboard"
import Layout from "./layout"

import { subscribe, publish, unsubscribe } from "./events"


export default function Page() {
    const [page, setPage] = useState("")

    const logInClickHandler = (event: { preventDefault: () => void }) => {
        event.preventDefault()
        publish("page-change", "sign-in")
    }

    const signUpClickHandler = (event: { preventDefault: () => void }) => {
        event.preventDefault()
        publish("page-change", "sign-up")
    }

    useEffect(() => {
        subscribe("page-change", (event: CustomEventInit) => {
            const view = event.detail
            console.log(view)
            setPage(view)
        });

        return () => {
            unsubscribe("page-change", () => { })
        }
    }, [])

    if (page === "dashboard") {
        return <Dashboard />
    }

    if (page === "sign-up") {
        return <SignUpForm />
    }

    if (page === "confirm-account") {
        return <ConfirmAccountForm />
    }

    if (page === "sign-in") {
        return <SignInForm />
    }

    return (
        <Layout>
            Welcome, please
            < a href="" onClick={logInClickHandler} style={{ border: "1px solid black", padding: 20, display: "block", marginTop: 20 }
            }> Log In</a >
            <div style={{ marginTop: 20 }}>
                or
            </div>
            <a href="" onClick={signUpClickHandler} style={{ border: "1px solid black", padding: 20, display: "block", marginTop: 20 }}>Sign Up</a>
        </Layout>)
}
