import "@fontsource/inter";
import { Box } from "@mui/joy";
import { useEffect, useState } from "react";
import { Phase, SocketBroadcast, SocketEvent, SocketMessage } from "src/types";
import "./App.css";
import AdminPanel from "./components/AdminPanel";
import JoinPhase from "./pages/JoinPhase";
import LobbyPhase from "./pages/LobbyPhase";
import MovementPhase from "./pages/MovementPhase";
import ComposePhase from "./pages/ComposePhase";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameMode, setGameMode] = useState<string>("");
  const [roomId, setRoomId] = useState<string>();
  const [ready, setReady] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>();

  // TODO error handling
  // const [error, setError] = useState<string>("");

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
        case SocketBroadcast.RoomCreated:
          console.log("Room created", message.data.roomId);
          setRoomId(message.data.roomId);

          break;
        case SocketBroadcast.RoomJoined:
          console.log("Room joined", message.data.roomId);
          setRoomId(message.data.roomId);
          setPlayerId(message.data.playerId);
          setGameMode(Phase.Lobby);

          break;
        case SocketBroadcast.RoomNotFound:
          console.log("Room not found");
          // TODO error handling
          // setError("Room not found");

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
        playerId,
      },
    };
    ws.send(JSON.stringify(message));
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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 1,
        bgcolor: "background.level1",
      }}
    >
      {ws ? (
        <>
          <AdminPanel
            ws={ws}
            roomId={roomId}
            endMovementTimer={endMovementTimer}
          />
          {gameMode === Phase.Join && <JoinPhase ws={ws} />}
          {gameMode === Phase.Lobby && (
            <LobbyPhase
              ready={ready}
              toggleReady={toggleReady}
              onMovement={onMovement}
            />
          )}
          {gameMode === Phase.Movement && (
            <MovementPhase onMovement={onMovement} />
          )}
          {gameMode === Phase.Compose && <ComposePhase />}
        </>
      ) : (
        <div>Connecting to webSocket..</div>
      )}

      {/* TODO */}
      {/* {error && <div>{error}</div>} */}
      {/* {gameMode === Mode.Vote && <Lobby />} */}
      {/* {gameMode === Mode.Win && <Lobby />} */}
      {/* {gameMode === Mode.End && <Lobby />} */}
    </Box>
  );
}

export default App;
