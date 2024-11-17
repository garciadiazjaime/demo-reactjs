'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'


const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;

function Search({ setCode }: { setCode: (code: string) => void }) {
    const searchParams = useSearchParams()
    console.log({ searchParams, LINKEDIN_CLIENT_ID })

    const code = searchParams.get('code') as string
    console.log({ code })
    setCode(code)

    return <></>
}


export default function Page() {
    const [code, setCode] = useState('')

    const getAuthorizationClickHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        const callback = `${location.origin}${location.pathname}`
        console.log({ callback })
        window.location.replace(
            `https://api.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${callback}&scope=profile%20email%20openid`,
        );
    }

    const getAccessTokenClickHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        const callback = encodeURIComponent(`${location.origin}${location.pathname}`)
        const response = await fetch(`/.netlify/functions/linkedin-authorization`, {
            method: "POST",
            body: JSON.stringify({
                code,
                callback
            }),
        });

        console.log({ response })

        const data = await response.text()
        console.log({ data })
    }


    return <div style={{ maxWidth: 400, margin: "0 auto", padding: 12 }}>
        <a href="" onClick={getAuthorizationClickHandler} style={{ padding: 20, border: '1px solid black', display: "block", textAlign: "center" }}>Authorize</a>
        <br />
        <a href="" onClick={getAccessTokenClickHandler} style={{ padding: 20, border: '1px solid black', display: "block", textAlign: "center" }}>Get Token</a>
        <Suspense>
            <Search setCode={setCode} />
        </Suspense>
    </div>
}
