"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

import Loader from "@/components/Loader";
import tokens from "@/support/tokens";

const MODEL_URL = `${process.env.NEXT_PUBLIC_MODEL_URL!}/model.json`;
const formatter = new Intl.NumberFormat("en-US");

const getTwitter = async (username: string) => {
  const url = `/.netlify/functions/twitter?username=${username}`;
  const response = await fetch(url).catch(() => {});

  if (!response) {
    return;
  }

  const data = await response.json();

  return data;
};

const getTweet = (popularity: number) => {
  const jokes = () => {
    if (!popularity || popularity < 10) {
      return `—so low that even my mom would say, "Who?"`;
    }

    if (popularity < 40) {
      return "—basically, somewhere between a backup dancer in a flash mob and a meme that hasn’t gone viral yet";
    }

    if (popularity < 80) {
      return "—right in that sweet spot between a one-hit wonder and the opening act everyone actually showed up early for!";
    }

    return "—I'd be be so famous even my selfies would have their own fan club!";
  };

  return encodeURIComponent(
    `If I were an artist, my popularity would be ${popularity} out of 100 ${jokes()}. @chimusiccompass chicagomusiccompass.com`
  );
};

const getPopularity = (followers: string, model: any) => {
  // const normalized = Math.log(parseFloat(followers));
  const normalized = parseFloat(followers);
  const x = tf.tensor(normalized).reshape([-1, 1]);
  const result: any = model.predict(x);
  const values = result.arraySync();
  const y = values[0][0].toFixed(2) * 100;

  return y;
};

export default function Page() {
  const [handle, setHandle] = useState("");
  const [popularity, setPopularity] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [model, setModel] = useState<tf.GraphModel>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const reset = () => {
    setPopularity(0);
    setFollowers(0);
    setMessage("");
  };

  const predictClickHandler = async () => {
    if (!handle) {
      return;
    }

    reset();

    setLoading(true);
    const twitter = await getTwitter(handle);
    setLoading(false);

    if (twitter.code) {
      setMessage(twitter.code);
      return;
    }

    if (!twitter || !model) {
      return;
    }

    const { followers_count: followers } = twitter.legacy;
    setFollowers(followers);

    const popularity = getPopularity(followers, model);
    setPopularity(popularity);
  };

  useEffect(() => {
    const fetchModel = async () => {
      const model = await tf.loadGraphModel(MODEL_URL);

      setModel(model);
    };

    fetchModel();
  }, []);

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      reset();
    }

    setHandle(event.target.value);
  };

  return (
    <div style={{ background: tokens.color.blue.small, height: "100vh" }}>
      <div
        style={{
          padding: 12,
          maxWidth: 800,
          margin: "0 auto",
          background: tokens.color.white,
          height: "100vh",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", marginBottom: 42 }}
        >
          <fieldset style={{ marginBottom: 12 }}>
            <legend>Twitter Handle</legend>
            <input
              value={handle}
              onChange={inputOnChange}
              style={{
                fontSize: 42,
                width: "calc(100% - 24px)",
                border: "none",
                padding: 12,
                outline: "none",
              }}
            />
          </fieldset>
          <button onClick={predictClickHandler} style={{ fontSize: 42 }}>
            Predict
          </button>
        </div>

        <div style={{ fontSize: 42 }}>
          <div style={{ fontSize: 32, opacity: 0.6 }}>
            Followers:{" "}
            {followers ? (
              <strong> {formatter.format(followers)}</strong>
            ) : (
              <></>
            )}
          </div>
          <div>
            Popularity:{" "}
            {popularity ? <strong> {popularity.toFixed(0)}</strong> : <></>}
          </div>

          <div
            style={{
              border: `1px solid ${tokens.color.black}`,
              width: "100%",
              height: 48,
              marginTop: 12,
            }}
          >
            <div
              style={{
                width: "1%",
                height: 48,
                background: tokens.color.blue.medium,
                transition: "width 2s, height 4s",
                ...(popularity && {
                  width: `${Math.min(popularity, 100)}%`,
                }),
              }}
            ></div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <div>1</div>
              <div>100</div>
            </div>
          </div>
        </div>

        <div
          style={{
            height: 40,
            padding: "12px 0",
            color: tokens.color.red,
            fontSize: 28,
            fontWeight: "bold",
            marginTop: 12,
          }}
        >
          {loading && <Loader />}
          {message && message}
        </div>

        {popularity ? (
          <a
            href={`https://twitter.com/intent/tweet?text=${getTweet(
              popularity
            )}`}
            target="_blank"
            style={{
              display: "block",
              padding: 12,
              background: "black",
              color: tokens.color.white,
              textDecoration: "none",
              borderRadius: 10,
              textAlign: "center",
              fontSize: 24,
            }}
          >
            Tweet my result
          </a>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
