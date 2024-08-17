"use client";

import { useRef, useEffect, useState } from "react";

declare global {
  interface Window {
    parentMethod: () => void;
  }
}

export default function () {
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLIFrameElement | null>(null);

  const print = (message: string) => {
    console.log({ message, log });
    const newLog = [...log, message];
    setLog((prev: string[]) => {
      console.log({ prev });
      return [...prev, message];
    });
  };

  useEffect(() => {
    if (!ref.current?.contentWindow) {
      return;
    }

    ref.current.contentWindow.document.body.onclick = function () {
      print("2. iframe click triggered, storage set");
      localStorage.setItem("id", "unique-id");
    };

    window.parentMethod = function () {
      const uniqueID = localStorage.getItem("id");
      print(`1. parentMethod called, uniqueID: ${uniqueID}`);

      setTimeout(() => {
        print(`3. delay done, uniqueID: ${localStorage.getItem("id")}`);
      }, 0);
    };

    return () => {
      localStorage.removeItem("id");
    };
  }, []);

  return (
    <main>
      <section style={{ border: "1px solid black", padding: 12, fontSize: 42 }}>
        <div>Parent app</div>
        <iframe
          ref={ref}
          src="/javascript-next-tick/child-app.html"
          style={{
            width: "100%",
            minHeight: 400,
            border: "none",
            marginTop: 20,
          }}
        />
      </section>

      <section
        style={{ border: "1px dotted black", minHeight: 300, marginTop: 20 }}
      >
        <div
          style={{
            fontWeight: "bold",
            opacity: 0.7,
            fontSize: 24,
            padding: 12,
          }}
        >
          output [same as console]:
        </div>
        <div style={{ fontFamily: "monospace" }}>
          {log.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </section>

      <a
        href="https://github.com/garciadiazjaime/"
        style={{
          textDecoration: "underline",
          fontSize: 24,
          display: "block",
          textAlign: "center",
          marginTop: 20,
        }}
        rel="nofollow"
      >
        github repository
      </a>
    </main>
  );
}
