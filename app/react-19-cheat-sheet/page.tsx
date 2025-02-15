import { title } from "process";

export default function Page() {
  const examples = [
    {
      url: "/react-19-cheat-sheet/greeting",
      title: "Functional Component",
    },
    {
      url: "/react-19-cheat-sheet/counter",
      title: "useState",
    },
    {
      url: "/react-19-cheat-sheet/counter-object",
      title: "useState (updating an object)",
    },
    {
      url: "/react-19-cheat-sheet/weather",
      title: "useEffect (Weather)",
    },
    {
      url: "/react-19-cheat-sheet/todo-list",
      title: "Rendering an array (Todo list)",
    },
    {
      url: "/react-19-cheat-sheet/newsletter",
      title: "Form (Newsletter)",
    },
    {
      url: "/react-19-cheat-sheet/theme",
      title: "Context (Theme)",
    },
  ];
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", fontSize: 20 }}>
      <h1>React 19 Cheat Sheet</h1>
      <ul>
        {examples.map((example) => (
          <li
            style={{
              listStyle: "none",
              padding: "20px 0",
              textDecoration: "underline",
            }}
            key={example.url}
          >
            <a href={example.url}>{example.title}</a>
          </li>
        ))}
      </ul>
      <div
        style={{
          height: 3,
          width: "100%",
          backgroundColor: "black",
          margin: "20px 0",
        }}
      ></div>
      <a
        style={{ textDecoration: "underline" }}
        href="https://github.com/garciadiazjaime/demo-reactjs/blob/main/app/react-19-cheat-sheet"
      >
        Codebase
      </a>
    </div>
  );
}
