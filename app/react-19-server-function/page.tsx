'use client'

import { useActionState } from "react";

import Loader from "@/app/react-contact-form/components/loader";
import { updateName } from "@/app/react-19-server-function/actions";


export default function Page() {

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

    return <div style={{
        maxWidth: 600, margin: "0 auto", fontSize: 22
    }}>
        <h1 style={{ marginBottom: 40 }}>React 19: Server Functions</h1>
        <fieldset style={{ padding: "20px 12px" }}>
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
    </div>
}
