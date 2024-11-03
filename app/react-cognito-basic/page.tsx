"use client";

import { useState } from "react";

import SignUpForm from "./sing-up-form";
import SignInForm from "./sing-in-form";
import ConfirmAccountForm from "./confirm-account-form";

const PAGES = {
  signUp: {
    component: SignUpForm,
    value: "signUp",
  },
  confirm: {
    component: ConfirmAccountForm,
    value: "confirm",
  },
  signIn: {
    component: SignInForm,
    value: "signIn",
  },
};

const ACTIVE_BACKGROUND = "#93e1d5";

type PageKey = keyof typeof PAGES;

export default function Page() {
  const [page, setPage] = useState<PageKey>("signUp");

  const clickHandler = (
    event: { preventDefault: () => void },
    value: PageKey
  ) => {
    event.preventDefault();
    setPage(value);
  };

  const Component = PAGES[page].component;

  return (
    <main style={{ maxWidth: 600, margin: "20px auto" }}>
      <nav style={{ width: "100%", display: "flex", gap: 12 }}>
        <a
          href=""
          style={{
            border: "1px solid",
            padding: 20,
            backgroundColor:
              page === PAGES.signUp.value ? ACTIVE_BACKGROUND : "",
          }}
          onClick={(event) => clickHandler(event, "signUp")}
        >
          Sign Up
        </a>
        <a
          href=""
          style={{
            border: "1px solid",
            padding: 20,
            backgroundColor:
              page === PAGES.confirm.value ? ACTIVE_BACKGROUND : "",
          }}
          onClick={(event) => clickHandler(event, "confirm")}
        >
          Confirm
        </a>
        <a
          href=""
          style={{
            border: "1px solid",
            padding: 20,
            backgroundColor:
              page === PAGES.signIn.value ? ACTIVE_BACKGROUND : "",
          }}
          onClick={(event) => clickHandler(event, "signIn")}
        >
          Sing In
        </a>
      </nav>

      <Component />
    </main>
  );
}
