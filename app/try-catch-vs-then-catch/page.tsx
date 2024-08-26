"use client";

import { useEffect, useState } from "react";

const getListUsingThen = () => {
  const url = "/.netlify/functions/chicagomusiccompass";

  const results = fetch(url)
    .then((response) => response.json())
    .catch(() => []);

  return results;
};

const getListUsingAwait = async () => {
  const url = "/.netlify/functions/chicagomusiccompass";

  try {
    const response = await fetch(url);
    const results = await response.json();

    return results;
  } catch (error) {
    return [];
  }
};

interface Event {
  name: string;
}

export default function Page() {
  const [list1, setList1] = useState<Event[]>([]);
  const [list2, setList2] = useState<Event[]>([]);

  useEffect(() => {
    getListUsingThen().then((list) => setList1(list));
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const list = await getListUsingAwait();
      setList2(list);
    };

    fetch();
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ margin: "20px 0" }}>Try/Catch vs .then().catch()</h1>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ margin: "12px 0", borderBottom: "1px dotted black" }}>
          List using `then()`
        </h2>
        <ul style={{ listStyle: "none" }}>
          {list1.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ margin: "12px 0", borderBottom: "1px dotted black" }}>
          List using `await()`
        </h2>
        <ul style={{ listStyle: "none" }}>
          {list2.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </div>

      <a
        href="https://github.com/garciadiazjaime/demo-reactjs/blob/main/app/try-catch-vs-then-catch/page.tsx"
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
