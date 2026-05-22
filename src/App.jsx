import React, { useState, useEffect } from "react";

// Wpisz tutaj IP swojego ESP32 z Serial Monitora
const ESP_IP = "http://192.168.0.180/api/led";

export default function LampController() {
  const [brightness, setBrightness] = useState(0);

  // Opcjonalne: pobranie początkowego stanu przy montowaniu
  useEffect(() => {
    fetch(ESP_IP)
      .then((res) => res.json())
      .then((data) => setBrightness(data.brightness))
      .catch((err) => console.error("Błąd połączenia:", err));
  }, []);

  const changeBrightness = async (val) => {
    setBrightness(val);
    try {
      // Prosty GET z parametrem ?val=...
      await fetch(`${ESP_IP}?val=${val}`);
    } catch (error) {
      console.error("Nie udało się wysłać danych do ESP:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold tracking-wider">
          Sterowanie Lampkami
        </h1>

        {/* Kontrolka wizualna */}
        <div
          className="w-24 h-24 rounded-full bg-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] transition-all duration-200"
          style={{ opacity: brightness > 0 ? brightness / 255 : 0.1 }}
        />

        <div className="w-full space-y-2">
          <label className="flex justify-between text-sm text-gray-400">
            <span>0%</span>
            <span>{Math.round((brightness / 255) * 100)}%</span>
          </label>

          <input
            type="range"
            min="0"
            max="255"
            value={brightness}
            onChange={(e) => changeBrightness(e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => changeBrightness(0)}
            className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors font-semibold"
          >
            Wyłącz
          </button>
          <button
            onClick={() => changeBrightness(255)}
            className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors font-semibold"
          >
            MAX
          </button>
        </div>
      </div>
    </div>
  );
}
