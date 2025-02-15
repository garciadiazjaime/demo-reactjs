"use client";

import { useEffect, useState } from "react";

const cities: { [key: string]: { latitude: number; longitude: number } } = {
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
    const [temperature, setTemperature] = useState<number | undefined>();
    const [city, setCity] = useState<keyof typeof cities>("chicago");

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
        <div style={{ maxWidth: 420, margin: "0 auto", fontSize: 24 }}>
            <p style={{ margin: "20px 0" }}>
                Temperature in{" "}
                <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                    {city}:{" "}
                </span>
                {temperature} {temperature && "Cº"} {temperature! < 5 && "🥶"}{" "}
                {temperature! > 10 && "☀️"}
            </p>
            <div>
                <button
                    style={{ width: "100%", padding: 20, fontSize: 26 }}
                    onClick={() => setCity("chicago")}
                >
                    Chicago
                </button>
                <button
                    style={{ width: "100%", padding: 20, fontSize: 26, marginTop: 20 }}
                    onClick={() => setCity("paris")}
                >
                    Paris
                </button>
            </div>
        </div>
    );
}
