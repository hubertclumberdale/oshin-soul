import { useEffect, useState } from "react";
import "./App.css";
import Lobby from "./components/lobby";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameMode, setGameMode] = useState<string>("");

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:4000");
    setWs(websocket);
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setGameMode("lobby");
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };
  }, [ws]);
  return (
    <div className="App">
      {!ws && <div>Connecting to server...</div>}
      {ws && gameMode === "lobby" && <Lobby webSocket={ws} />}
    </div>
  );
}

export default App;
