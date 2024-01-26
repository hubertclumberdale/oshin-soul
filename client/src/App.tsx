import { useEffect, useState } from "react";
import "./App.css";
import Lobby from "./components/lobby";
import { Mode, SocketBroadcast, SocketEvent } from "src/types";
import Movement from "./components/movement";
import Join from "src/components/join";
function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameMode, setGameMode] = useState<string>("");
  const [roomId, setRoomId] = useState<number>();
  const [error, setError] = useState<string>("");
  const [ready, setReady] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<number>();

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:7002");
    setWs(websocket);
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setGameMode(Mode.Join);
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.event) {
        case SocketBroadcast.RoomJoined:
          console.log("Room joined", message.data.roomId);
          setRoomId(message.data.roomId);
          setPlayerId(message.data.playerId);
          setGameMode(Mode.Lobby);

          break;
        case SocketBroadcast.RoomNotFound:
          console.log("Room not found");
          setError("Room not found");

          break;
        case SocketEvent.GameStarted:
          console.log("Game started");
          setGameMode(Mode.Movement);

          break;
        default:
          break;
      }
    };
  }, [ws]);

  const joinRoom = (roomId: string) => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        event: SocketEvent.JoinRoom,
        data: {
          roomId,
        },
      })
    );
  };

  const toggleReady = () => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        event: SocketEvent.PlayerReady,
        data: {
          ready: !ready,
          roomId,
          playerId,
        },
      })
    );
    setReady(!ready);
  };

  const onMovement = (direction: { x: number; y: number }) => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        event: SocketEvent.PlayerMovement,
        data: {
          direction,
        },
      })
    );
  };

  const createTestRoom = () => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        event: SocketEvent.CreateRoom,
        data: {},
      })
    );
  };

  const endMovementTimer = () => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        event: SocketEvent.MovementPhaseTimerFinished,
        data: {},
      })
    );
  }

  return (
    <div className="App">
      <h2>Utilities</h2>
      <h3>Room id: {roomId}</h3>
      <button onClick={createTestRoom}>Create Test Room </button>
      <button onClick={endMovementTimer}>End Movement Timer</button>
      <hr></hr>
      {error && <div>{error}</div>}
      {!ws && <div>Connecting to server...</div>}

      {gameMode === Mode.Join && <Join joinRoom={joinRoom} />}
      {gameMode === Mode.Lobby && (
        <Lobby ready={ready} toggleReady={toggleReady} />
      )}
      {gameMode === Mode.Movement && <Movement onMovement={onMovement} />}

      {/*  {gameMode === Mode.Compose && <Lobby />}
      {gameMode === Mode.Vote && <Lobby />}
      {gameMode === Mode.Win && <Lobby />}
      {gameMode === Mode.End && <Lobby />} */}
    </div>
  );
}

export default App;
