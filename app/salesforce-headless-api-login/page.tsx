'use client'

import ReCAPTCHA from 'react-google-recaptcha';

import { useState, useRef } from 'react'
import { login } from "./support"

export default function Page() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userInfo, setUserInfo] = useState("")

    const reCaptchaRef = useRef<ReCAPTCHA>(null);

    const onReCaptchaChange = async (captcha: string | null) => {
        if (!username || !password) {
            setUserInfo("type in username and password")
            return
        }

        setUserInfo("loading")
        const results = await login({ username, password, captcha })

        setUserInfo(results)
    };

    const usernameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const passwordChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const loginClickHandler = () => {
        reCaptchaRef?.current?.execute()
    }

    return <section style={{ width: 400, margin: "0 auto" }}>
        <ReCAPTCHA
            ref={reCaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY as string} // Replace with your site key
            size="invisible"
            onChange={onReCaptchaChange}
        />

        <h1>Login</h1>
        <fieldset>
            <legend>Enter your credentials</legend>
            <div>
                <label>
                    Username:
                    <input type="text" style={{ width: "100%", margin: "0 0 12px 0" }} value={username} onChange={usernameChangeHandler} />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input type="password" style={{ width: "100%", margin: "0 0 12px 0" }} value={password} onChange={passwordChangeHandler} />
                </label>
            </div>
            <div>
            </div>
            <button onClick={loginClickHandler} style={{ width: "100%", margin: "12px 0" }}>Login</button>
        </fieldset>

        <div>
            <pre>{userInfo && JSON.stringify(userInfo, null, 2)}</pre>
        </div>
    </section>
}
