import { useEffect, useState } from "react";
import "./App.css";
import Lobby from "./components/lobby";
import { Phase, SocketBroadcast, SocketEvent, SocketMessage } from "src/types";
import Movement from "./components/movement";
import Join from "src/components/join";
import Compose from "src/components/compose";
function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameMode, setGameMode] = useState<string>("");
  const [roomId, setRoomId] = useState<string>();
  const [error, setError] = useState<string>("");
  const [ready, setReady] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>();

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:7002");
    setWs(websocket);
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setGameMode(Phase.Join);
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
          setGameMode(Phase.Lobby);

          break;
        case SocketBroadcast.RoomNotFound:
          console.log("Room not found");
          setError("Room not found");

          break;
        case SocketBroadcast.MovementPhase:
          console.log("Movement phase started");
          setGameMode(Phase.Movement);

          break;

        case SocketBroadcast.ComposePhase:
          console.log("Compose phase started");
          setGameMode(Phase.Compose);

          break;
        default:
          break;
      }
    };
  }, [ws]);

  const joinRoom = (roomId: string) => {
    if (!ws) return;

    const message: SocketMessage = {
      event: SocketEvent.JoinRoom,
      data: {
        roomId,
      },
    };
    ws.send(JSON.stringify(message));
  };

  const toggleReady = () => {
    if (!ws) return;
    const message: SocketMessage = {
      event: SocketEvent.PlayerReady,
      data: {
        ready: !ready,
        roomId,
        playerId,
      },
    };
    ws.send(JSON.stringify(message));
    setReady(!ready);
  };

  const onMovement = (direction: { x: number; y: number }) => {
    if (!ws) return;
    const message: SocketMessage = {
      event: SocketEvent.PlayerMovement,
      data: {
        roomId,
        direction,
        playerId
      },
    };
    ws.send(JSON.stringify(message));
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
        data: {
          roomId,
        },
      })
    );
  };

  return (
    <div className="App">
      <h2>Utilities</h2>
      <h3>Room id: {roomId}</h3>
      <button onClick={createTestRoom}>Create Test Room </button>
      <button onClick={endMovementTimer}>End Movement Timer</button>
      <hr></hr>
      {error && <div>{error}</div>}
      {!ws && <div>Connecting to server...</div>}

      {gameMode === Phase.Join && <Join joinRoom={joinRoom} />}
      {gameMode === Phase.Lobby && (
        <Lobby ready={ready} toggleReady={toggleReady} />
      )}
      {gameMode === Phase.Movement && <Movement onMovement={onMovement} />}

      {gameMode === Phase.Compose && <Compose />}
      {/* {gameMode === Mode.Vote && <Lobby />}
      {gameMode === Mode.Win && <Lobby />}
      {gameMode === Mode.End && <Lobby />} */}
    </div>
  );
}

export default App;
