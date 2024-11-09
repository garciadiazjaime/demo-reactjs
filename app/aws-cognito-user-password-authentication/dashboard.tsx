import { useState } from "react"
import { deleteAccount } from "./support"

import { publish } from "./events"

export default function Dashboard() {
    const [feedback, setFeedback] = useState("")

    const logOutClickHandler = (event: { preventDefault: () => void }) => {
        event.preventDefault()
        publish("page-change", "")
    }

    const deleteAccountHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        await deleteAccount().then(() => {
            publish("page-change", "")
        }).catch((error) => {
            setFeedback(error.toString())
        })


    }

    return (<div>
        <h1>Dashboard</h1>
        <div>
            <div>You are logged in now!</div>
            <a href="" onClick={logOutClickHandler} style={{ padding: 20, border: "1px solid black", display: "block", marginTop: 20 }}>Log Out</a>
            <a href="" onClick={deleteAccountHandler} style={{ padding: 20, border: "1px solid black", display: "block", marginTop: 20 }}>Delete Account</a>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    fontSize: 24,
                    color: "red",
                }}
            >
                {feedback}
            </div>
        </div>
    </div>)
}
