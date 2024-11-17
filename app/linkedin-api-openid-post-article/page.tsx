'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'


const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;

function Search({ setCode }: { setCode: (code: string) => void }) {
    const searchParams = useSearchParams()

    const code = searchParams.get('code') as string
    console.log({ code })
    if (code) {
        setCode(code)
    }

    return <></>
}


export default function Page() {
    const [code, setCode] = useState('')
    const [userInfo, setUserInfo] = useState('')

    const getAuthorizationClickHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        const callback = encodeURIComponent(`${location.origin}${location.pathname}`)
        window.location.replace(
            `https://api.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${callback}&scope=profile%20email%20openid`,
        );
    }

    useEffect(() => {
        if (!code) {
            return
        }

        const getUserInfo = async () => {
            const response = await fetch(`/.netlify/functions/linkedin-authorization`, {
                method: "POST",
                body: JSON.stringify({
                    code,
                }),
            });

            const data = await response.json()
            console.log(data)
            const accessToken = data.access_token
            sessionStorage.setItem('linkedin_access_token', accessToken)

            const responseUser = await fetch(`/.netlify/functions/linkedin-userinfo`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('linkedin_access_token')}`,
                },
            });

            console.log({ responseUser })

            const user = await responseUser.json()
            console.log(user)
            setUserInfo(user)
        }

        getUserInfo()
    }, [code])


    return <div style={{ maxWidth: 400, margin: "0 auto", padding: 12 }}>
        <a href="" onClick={getAuthorizationClickHandler} style={{ padding: 20, border: '1px solid black', display: "block", textAlign: "center" }}>Authorize</a>
        <Suspense>
            <Search setCode={setCode} />
        </Suspense>
        <div>
            <pre>{userInfo && JSON.stringify(userInfo, null, 2)}</pre>
        </div>
    </div>
}
