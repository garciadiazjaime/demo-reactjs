'use client'

import { useState, useActionState } from "react";

import Loader from "@/app/react-contact-form/components/loader";

async function updateName(name: string): Promise<string> {
    const response = await fetch("/.netlify/functions/form-placeholder", {
        method: "POST",
        body: JSON.stringify({ name }),
    })

    if (!response.ok) {
        const { message } = await response.json();
        return message
    }

    return "";
}

function BeforeForm() {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setIsPending(true);
        const error = await updateName(name);
        setIsPending(false);

        if (error) {
            setError(error);
            return;
        }
    };

    return <fieldset style={{ padding: "20px 12px" }}>
        <legend>Old way</legend>

        <div style={{ paddingRight: 12 }}>
            Name
        </div>

        <input value={name} onChange={(event) => setName(event.target.value)} style={{ fontSize: 24, width: "100%", padding: 12, margin: "12px 0" }} />

        <button onClick={handleSubmit} disabled={isPending} style={{ width: "100%", fontSize: 24, padding: 12, marginBottom: 20 }}>
            Save
        </button>

        <div style={{ minHeight: 60 }}>
            {isPending && <Loader />}

            {error && <p>{error}</p>}
        </div>
    </fieldset>
}

function AfterForm() {
    const [error, submitAction, isPending]: [string, (formData: FormData) => void, boolean] = useActionState(
        async (_previousState: string, formData: FormData): Promise<string> => {
            const error = await updateName(formData.get("name") as string);
            if (error) {
                return error;
            }

            return ""
        },
        "",
    );

    return <fieldset style={{ padding: "20px 12px" }}>
        <legend>New way</legend>

        <div style={{ paddingRight: 12 }}>
            Name
        </div>

        <form action={submitAction}>
            <input type="text" name="name" style={{ fontSize: 24, width: "100%", padding: 12, margin: "12px 0" }} />

            <button type="submit" disabled={isPending} style={{ width: "100%", fontSize: 24, padding: 12, marginBottom: 20 }}>Save</button>
        </form>

        <div style={{ minHeight: 60 }}>
            {isPending && <Loader />}

            {error && <p>{error}</p>}
        </div>
    </fieldset>
}

export default function Page() {
    return <div style={{
        maxWidth: 600, margin: "0 auto", fontSize: 24
    }}>
        <h1 style={{ marginBottom: 40 }}>React 19: New hook useActionState</h1>

        <BeforeForm />

        <div style={{ height: 40 }}></div>

        <AfterForm />
    </ div>
}
