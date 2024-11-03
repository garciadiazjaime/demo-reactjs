"use client";

import { useState, useEffect } from "react";

import Loader from "@/app/react-contact-form/components/loader";
import { EMAIL_REGEX } from "@/app/react-contact-form/components/support";

import { confirmSignUp } from "./support";

export default function ConfirmAccountForm() {
  const [email, setEmail] = useState("");
  const [emailTouch, setEmailTouch] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const [code, setCode] = useState("");
  const [codeTouch, setCodeTouch] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!emailTouch) {
      setEmailTouch(true);
    }

    setEmail(event.target.value);
  };

  const codeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!codeTouch) {
      setCodeTouch(true);
    }

    setCode(event.target.value);
  };

  const resetForm = () => {
    setEmail("");
    setEmailTouch(false);
    setEmailValid(false);

    setCode("");
    setCodeTouch(false);
    setCodeValid(false);

    setTimeout(() => {
      setFeedback("");
    }, 4_000);
  };

  const sendHandler = async () => {
    if (!emailTouch) {
      setEmailTouch(true);
    }

    if (!codeTouch) {
      setCodeTouch(true);
    }

    if (!emailValid || !codeValid) {
      return;
    }

    setLoading(true);
    setFeedback("");

    confirmSignUp(email, code)
      .then((response) => {
        console.log({ response });
        setFeedback("Account confirmed successfully, you can Log in now.");
        resetForm();
      })
      .catch((error) => {
        setFeedback(error.message);
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

  const getCodeColor = () => {
    if (!codeTouch) {
      return;
    }

    if (!codeValid) {
      return "red";
    }

    return "";
  };

  useEffect(() => {
    if (!emailTouch) {
      return;
    }

    setEmailValid(EMAIL_REGEX.test(email));
  }, [email, emailTouch]);

  useEffect(() => {
    if (!codeTouch) {
      return;
    }

    setCodeValid(!!code.length);
  }, [code, codeTouch]);

  return (
    <>
      <fieldset style={{ margin: "12px 0", padding: 12 }}>
        <legend>Confirm</legend>
        <label
          style={{ marginTop: 20, display: "block", color: getEmailColor() }}
        >
          Email *
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
          style={{ marginTop: 20, display: "block", color: getCodeColor() }}
        >
          Code *
        </label>
        <input
          style={{
            width: "calc(100% - 16px)",
            fontSize: 24,
            padding: "12px 6px",
          }}
          onChange={codeHandler}
          value={code}
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
    </>
  );
}
