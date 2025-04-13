# React Cheat Sheet

I've worked with React for a couple of years and really enjoy it, so here's a short list of useful things to know about React.

- Functional Component
- useState
- useEffect Hook
- Rendering Arrays
- Forms
- Context

## 1. Functional Component

```javascript
export default function Greeting({ name = "world" }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
}
```

Whenever you work with React, you start with a Component. There's also the "Class Component," which is just a different syntax, but honestly, I've only been using Functional Components for the past few years, no need to worry about those boring class components.

Notice how you can set a default value. If the component doesn’t receive a prop for `name`, it will default to `"world"`.

From a design pattern perspective, this is called a **stateless component**. Stateless components are useful when building an interface, as they delegate control to other components and focus only on rendering.

## 2. `useState`

```javascript
"use client";

import { useState } from "react";

import { Greeting } from "../greeting/page";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Greeting name="jaime" />

      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

`useState` is one of the most used features in React, you’ll find it in most projects. One thing to keep in mind is that `useState` runs on the client (browser), so you always need to add the directive `"use client";`. This tells React it's a client component. If you don’t add it, React will throw an error.

Alright, let’s break down the syntax:

```javascript
const [count, setCount] = useState(0);
```

- Creates a variable: `count`
- Creates a setter: `setCount`
- Lets you define a default value: `0`

Anytime a **setter** is called (in this case, `setCount`), the component will **rerender**, that’s how you’ll see the new value of `count`.

> **Note:** `useState` can store any type of value. But be careful when working with objects, updating a property inside an object won’t trigger a rerender. As a good practice, it’s better to create a completely new object and pass it to the setter instead of mutating existing objects.

### 2.1 `useState` working with object

```javascript
"use client";

import { useState } from "react";

export default function Dictionary() {
  const [counter, setCounter] = useState({ value: 0 });

  const invalidIncrement = () => {
    counter.value += 1; // wrong way ❌
    setCounter(counter);
  };

  const validIncrement = () => {
    const newCounter = {
      ...counter,
      value: counter.value + 1,
    }; // right way ✅
    setCounter(newCounter);
  };

  return (
    <div>
      <p>Count: {counter.value}</p>
      <button onClick={invalidIncrement}>
        Invalid Increment (property ❌)
      </button>

      <button onClick={validIncrement}>Valid Increment (object ✅) </button>
    </div>
  );
}
```

## 3. `useEffect Hook`

`useEffect` is another widely used feature in React. If you're working on a very simple, static website, you might not need it. But in most React projects, you'll find it being used.

To me, the name isn't very intuitive, but basically, it lets you run code whenever an **effect** (aka dependency) happens. This **effect** is usually triggered when:

a) The page loads `[]`

or

b) A prop is updated `[prop]`

```javascript
useEffect(() => {
  // code to execute
}, []); // list of dependencies; if empty, it runs when the page loads
```

Now, let’s look at some code that fetches the temperature of a selected city from a public RESTful API.

> Notice how both `useEffect` and `useState` are used.

```javascript
"use client";

import { useEffect, useState } from "react";

const cities = {
  chicago: {
    latitude: 41.8335928,
    longitude: -87.8966843,
  },
  paris: {
    latitude: 34.0200392,
    longitude: -118.7413689,
  },
};

export default function Weather() {
  const [temperature, setTemperature] = useState();
  const [city, setCity] = useState("chicago");

  useEffect(() => {
    const fetchWeather = async () => {
      const currentCity = cities[city];
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${currentCity.latitude}&longitude=${currentCity.longitude}&current=temperature_2m`
      );
      const data = await response.json();
      setTemperature(data.current.temperature_2m);
    };

    fetchWeather();
  }, [city]);

  return (
    <div>
      <p>
        Temperature in {city}
        {temperature}
      </p>
      <div>
        <button onClick={() => setCity("chicago")}>Chicago</button>

        <button onClick={() => setCity("paris")}>Paris</button>
      </div>
    </div>
  );
}
```

Whenever `city` is updated by either of the two buttons, `useEffect` detects the change and runs its code. Inside `useEffect`, a **setter** is called, which triggers a rerender of the component. That’s how the UI knows:

a) Which city to display  
b) The temperature value returned by the API

Keep in mind that `useEffect` always runs at least once, when the page first loads.

## 4. Rendering Arrays

When working with data, you’ll often deal with arrays. In React, `map` is commonly used to render lists.

Let’s take a look at the following code:

```javascript
export default function TodoList() {
  const todo = [
    "Create project",
    "Write code for the module A",
    "Deploy the app",
  ];

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todo.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

Two things to mention:

a) Notice how the `todo` array is iterated using `.map()`. In this example, `todo` is hardcoded inside the component, but in most cases, the data will come from a RESTful API.

b) React requires a `key` when rendering items from an array. This helps with efficient updates. No need to overthink it, just remember to always add a **unique** key.

## 5. Forms

Forms are a common use case, sooner or later, you'll need to work with one.

Let’s take a look at the following code:

```javascript
"use client";

import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(value)) {
      setError("Invalid email");
      return;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
```

A couple of things to mention here:

a) `onSubmit` handler

Whenever the form is submitted (via `<button type="submit">`), the helper `handleSubmit` will be executed. The first thing it does is prevent the default event with `e.preventDefault();`. This is pretty standard, so try to use it when handling clicks.

b) Controlled element

In React, when working with an input, there are two approaches: **controlled element** or **uncontrolled element**.

A **controlled element** means the input is tied to a state variable:

```javascript
<input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
```

Whenever the user types something, `setValue` updates `value`, which triggers a rerender. This happens so quickly that you don’t notice it. However, one of the advantages of **controlled elements** is that you can run validations as the user types. Since it's tied to a state variable, you can also hook it up to `useEffect`, maybe for analytics.

An **uncontrolled element** is when you don't use state. In my experience, even though it's a bit more code, I always go with **controlled elements**, so I’d recommend the same to you.

Now, this form is very simple, only one field. On submit, it checks the email format using a regex. If the format is invalid, it updates the `error` state variable, which ends up rendering the error: "Invalid email."

In a real-world example, after validation, the data would be sent to the backend.

## 6. Context

When working on a medium to large application, you'll most likely come across `Context`. `Context` allows you to share properties among components without the need for **prop drilling**, which is when you pass props from a parent component to child components, often through multiple levels of the component hierarchy. This isn't ideal, and `Context` is one alternative.

Let’s take a look at the following code:

```javascript
"use client";

import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemedComponent = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#000",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      <p>Current theme: {theme}</p>
      <button
        style={{
          backgroundColor: theme === "light" ? "#000" : "#fff",
          color: theme === "light" ? "#fff" : "#000",
        }}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default function ThemePage() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  );
}
```

A couple of things to mention:

a) A context is created using `createContext()`. At this point, it’s just a reference, nothing has been set yet.

b) The provider is defined:

```javascript
const [theme, setTheme] = useState("light");

...

<ThemeContext.Provider value={{ theme, setTheme }}>
```

Notice how both the state variable and the setter are passed to the `context`. This is important because it allows other components to read the `theme` value from the provider and even update it using the `setTheme` setter.

c) A child component consumes the context using `useContext(ThemeContext)`.

```javascript
const { theme, setTheme } = useContext(ThemeContext);

...
<p>Current theme: {theme}</p>

<button
  style={{
    backgroundColor: theme === "light" ? "#000" : "#fff",
  }}
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
```

In this case, the child component gets access to the context, including the `theme` value and the `setTheme` setter. You can see how `theme` is rendered and also conditionally used to adjust the button's style. Additionally, clicking the button toggles the value of `theme`.

When `setTheme` is called, `theme` is updated, and any component connected to the context will receive the new value and rerender.

In this example, everything is in one place: context, provider, and consumer. But in a real project, you’d likely have these in separate files and import them where needed.

> **Note:** Context is helpful when you need to share values among components, but it can get messy easily. So, when working with `context`, try to define a **domain** and keep one context per domain. You can have multiple contexts, but keep in mind that the more contexts you have, the more complexity is added. Personally, I prefer to keep it simple and only add more contexts when absolutely necessary.

## 7. Router

Every web app needs routing, and at the time of writing, there's a bit of a battle between JavaScript frameworks. I’ve worked with Next.js, and like any tool, it has its strengths and areas for improvement. But overall, it’s worked well, so I’d recommend using it. Frameworks like Next.js handle a lot of things, including routing.

In the end, any framework can do it, and honestly, users won’t feel much of a difference. What really matters is focusing on performance and providing a great user experience. You can achieve that with or without a framework.

## 8. React 19

React 19 brought some interesting features, and I’ve been using a few of them in my projects, like `useActionState` and `Server Functions`.

I wrote an article about [React 19 and the New Features](https://devm.io/javascript/react-19-new-features), so if you're interested, feel free to check it out.

---

That’s it, thanks for reading.

# Links

[Demo](https://demo.garciadiazjaime.com/react-19-cheat-sheet)
[CodeBase](https://github.com/garciadiazjaime/demo-reactjs/blob/main/app/react-19-cheat-sheet)

# Get in touch

I would love to hear your feedback and if you have any questions please send me a line, I’ll be more than happy to answer them.

[x@jaumint](https://x.com/jaumint)

[linkedin@jaimegd](https://www.linkedin.com/in/jaimegd/)
