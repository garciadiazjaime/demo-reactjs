'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { jwtDecode } from "jwt-decode";

import Loader from '@/app/react-contact-form/components/loader'


const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;

function Search({ setCode }: { setCode: (code: string) => void }) {
    const searchParams = useSearchParams()

    const code = searchParams.get('code') as string

    if (code) {
        setCode(code)
    }

    return <></>
}


export default function Page() {
    const [code, setCode] = useState('')
    const [userInfo, setUserInfo] = useState('')
    const [loading, setLoading] = useState(false)

    const getAuthorizationClickHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()
        setLoading(true)

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

            sessionStorage.setItem('linkedin_access_token', data.access_token)
            sessionStorage.setItem('linkedin_jwt_token', data.id_token)

            const responseUser = await fetch(`/.netlify/functions/linkedin-userinfo`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('linkedin_access_token')}`,
                },
            });

            const user = await responseUser.json()

            setUserInfo(user)
            setLoading(false)
        }

        getUserInfo()
    }, [code])

    useEffect(() => {
        const jwt = sessionStorage.getItem('linkedin_jwt_token')

        if (!jwt) {
            return
        }

        const data = jwtDecode(jwt)

        if (data) {
            setUserInfo(data as unknown as string)
        }
    }, [])


    return <div style={{ maxWidth: 400, margin: "0 auto", padding: 12 }}>
        <h1 style={{ marginBottom: 20 }}>LinkedIn Get User Info</h1>
        {!userInfo && <a href="" onClick={getAuthorizationClickHandler} style={{ padding: 20, border: '1px solid black', display: "block", textAlign: "center" }}>Authorize</a>}
        <Suspense>
            <Search setCode={setCode} />
        </Suspense>
        <div>
            <pre>{userInfo && JSON.stringify(userInfo, null, 2)}</pre>
        </div>
        {loading && <Loader />}
    </div>
}
