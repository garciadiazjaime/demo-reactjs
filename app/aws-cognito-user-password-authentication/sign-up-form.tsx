"use client";

import { useState, useEffect } from "react";

import Loader from "@/app/react-contact-form/components/loader";
import { EMAIL_REGEX } from "@/app/react-contact-form/components/support";

import { signUp } from "./support"
import { publish } from "./events";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [emailTouch, setEmailTouch] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordTouch, setPasswordTouch] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!emailTouch) {
      setEmailTouch(true);
    }

    setEmail(event.target.value);
  };

  const passwordHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (!passwordTouch) {
      setPasswordTouch(true);
    }

    setPassword(event.target.value);
  };

  const resetForm = () => {
    setEmail("");
    setEmailTouch(false);
    setEmailValid(false);

    setPassword("");
    setPasswordTouch(false);
    setPasswordValid(false);

    setTimeout(() => {
      setFeedback("");
    }, 4_000);
  };

  const sendHandler = async () => {
    if (!emailTouch) {
      setEmailTouch(true);
    }

    if (!passwordTouch) {
      setPasswordTouch(true);
    }

    if (!emailValid || !passwordValid) {
      return;
    }

    setLoading(true);
    setFeedback("");

    await signUp(email, password)
      .then(() => {
        setFeedback("password sent successfully");
        resetForm();
        publish("page-change", "confirm-account");
      })
      .catch((error) => {
        setFeedback(error.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getEmailColor = () => {
    if (!emailTouch) {
      return;
    }

    if (!emailValid) {
      return "red";
    }

    return "";
  };

  const getPasswordColor = () => {
    if (!passwordTouch) {
      return;
    }

    if (!passwordValid) {
      return "red";
    }

    return "";
  };

  const signInClickHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    publish("page-change", "sign-in");
  }

  useEffect(() => {
    if (!emailTouch) {
      return;
    }

    setEmailValid(EMAIL_REGEX.test(email));
  }, [email, emailTouch]);

  useEffect(() => {
    if (!passwordTouch) {
      return;
    }

    setPasswordValid(!!password.length);
  }, [password, passwordTouch]);

  return (
    <>
      <fieldset style={{ margin: "12px 0", padding: 12 }}>
        <legend>Sign Up</legend>
        <label
          style={{ marginTop: 20, display: "block", color: getEmailColor() }}
        >
          * Email:
        </label>
        <input
          style={{
            width: "calc(100% - 16px)",
            fontSize: 24,
            padding: "12px 6px",
          }}
          onChange={emailHandler}
          value={email}
        />

        <label
          style={{ marginTop: 20, display: "block", color: getPasswordColor() }}
        >
          * Password:
        </label>
        <input
          type="password"
          style={{
            width: "calc(100% - 16px)",
            fontSize: 24,
            padding: "12px 6px",
          }}
          onChange={passwordHandler}
          value={password}
        />
      </fieldset>
      <div style={{ margin: "12px 0" }}>
        <button
          style={{
            width: "100%",
            fontSize: 24,
            padding: "12px 0px",
            cursor: "pointer",
          }}
          onClick={sendHandler}
          disabled={loading}
        >
          Send
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {loading && <Loader />}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontSize: 24,
            color: feedback.includes("successfully") ? "green" : "red",
          }}
        >
          {feedback}
        </div>
      </div>

      <fieldset style={{ padding: 20, marginTop: 100 }}>
        <legend>If you have an account</legend>
        <a style={{ textAlign: "center", border: "1px solid black", padding: 20, cursor: "pointer", marginTop: 20, display: "block" }} href="" onClick={signInClickHandler}>Sign In</a>
      </fieldset>
    </>
  );
}
