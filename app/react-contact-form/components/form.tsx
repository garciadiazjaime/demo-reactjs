"use client";

import { useState, useEffect } from "react";

import Loader from "./loader";
import { emailService, EMAIL_REGEX, MESSAGE_LENGTH } from "./support";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [emailTouch, setEmailTouch] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const [message, setMessage] = useState("");
  const [messageTouch, setMessageTouch] = useState(false);
  const [messageValid, setMessageValid] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!emailTouch) {
      setEmailTouch(true);
    }

    setEmail(event.target.value);
  };

  const messageHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    if (!messageTouch) {
      setMessageTouch(true);
    }

    setMessage(event.target.value.slice(0, MESSAGE_LENGTH));
  };

  const resetForm = () => {
    setEmail("");
    setEmailTouch(false);
    setEmailValid(false);

    setMessage("");
    setMessageTouch(false);
    setMessageValid(false);

    setTimeout(() => {
      setFeedback("");
    }, 4_000);
  };

  const sendHandler = async () => {
    if (!emailTouch) {
      setEmailTouch(true);
    }

    if (!messageTouch) {
      setMessageTouch(true);
    }

    if (!emailValid || !messageValid) {
      return;
    }

    setLoading(true);
    setFeedback("");

    await emailService(email, message)
      .then(() => {
        setFeedback("message sent successfully");
        resetForm();
      })
      .catch(() => {
        setFeedback("oops please try again");
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

  const getMessageColor = () => {
    if (!messageTouch) {
      return;
    }

    if (!messageValid) {
      return "red";
    }

    return "";
  };

  useEffect(() => {
    if (!emailTouch) {
      return;
    }

    setEmailValid(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    if (!messageTouch) {
      return;
    }

    setMessageValid(!!message.length);
  }, [message]);

  return (
    <>
      <fieldset style={{ margin: "12px 0", padding: 12 }}>
        <legend>Say Hi</legend>
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
          style={{ marginTop: 20, display: "block", color: getMessageColor() }}
        >
          * Message:
        </label>
        <textarea
          style={{
            width: "calc(100% - 16px)",
            minHeight: 200,
            fontSize: 24,
            padding: "12px 6px",
          }}
          onChange={messageHandler}
          value={message}
        />
        <div style={{ textAlign: "right" }}>
          {message.length} / {MESSAGE_LENGTH}
        </div>
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
