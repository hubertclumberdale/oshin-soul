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
import VotePhase from "src/pages/VotePhase";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameMode, setGameMode] = useState<string>("");
  const [roomId, setRoomId] = useState<string>();
  const [ready, setReady] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>();
  const [sentence, setSentence] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);

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
      const message = JSON.parse(event.data) as SocketMessage;
      if (!message.event || !message.data) return;
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
          console.log(message.data.sentence);
          const sentence = message.data.sentence;
          if (sentence) {
            setSentence(sentence);
            setGameMode(Phase.Movement);
          }

          break;
        case SocketBroadcast.ComposePhase:
          console.log("Compose phase started");
          setGameMode(Phase.Compose);

          break;

        case SocketBroadcast.PlayerWords:
          console.log("Player words received");
          console.log(message.data.words);
          const words = message.data.words;
          if (words) {
            setWords(words);
          }
          break;

        case SocketBroadcast.VotePhase:
          console.log("Vote phase started");
          setGameMode(Phase.Vote);

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

  const onSentenceSubmit = (sentence: string) => {
    if (!ws) return;
    const message: SocketMessage = {
      event: SocketEvent.PlayerChoice,
      data: {
        roomId,
        playerId,
        choice: sentence,
      },
    };
    ws.send(JSON.stringify(message));
  };

  const addPackToPlayer = () => {
    if (!ws) return;

    const packs = ["animals", "jail", "holy", "napoletano", "slurs"];
    const randomChosenPack = packs[Math.floor(Math.random() * packs.length)];
    const message: SocketMessage = {
      event: SocketEvent.PlayerPickUp,
      data: {
        roomId,
        playerId,
        obtainedPack: randomChosenPack,
      },
    };
    ws.send(JSON.stringify(message));
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
      className="App"
    >
      {ws ? (
        <>
          <AdminPanel
            ws={ws}
            roomId={roomId}
            gameMode={gameMode}
            endMovementTimer={endMovementTimer}
            addPackToPlayer={addPackToPlayer}
          />
          {/* Phase 1 - insert room number */}
          {gameMode === Phase.Join && <JoinPhase ws={ws} />}

          {/* Phase 2 - wait in lobby, tutorial */}
          {gameMode === Phase.Lobby && (
            <LobbyPhase
              ready={ready}
              toggleReady={toggleReady}
              onMovement={onMovement}
            />
          )}

          {/* Phase 3 - Movement */}
          {gameMode === Phase.Movement && (
            <MovementPhase sentence={sentence} onMovement={onMovement} />
          )}

          {/* Phase 4 - Compose */}
          {gameMode === Phase.Compose && (
            <ComposePhase
              onSubmit={onSentenceSubmit}
              sentence={sentence}
              words={words}
            />
          )}

          {/* Phase 4 - Compose */}
          {gameMode === Phase.Vote && (
            <>
              <VotePhase
                choices={[
                  { choice: "the quick brown fox", playerId: "123", votes: 0 },
                  {
                    choice: "jumps over the lazy dog",
                    playerId: "232",
                    votes: 0,
                  },
                  {
                    choice: "lorem ipsum dolor sit amet",
                    playerId: "3223",
                    votes: 0,
                  },
                  {
                    choice: "consectetur adipiscing elit",
                    playerId: "4123",
                    votes: 0,
                  },
                ]}
                onSubmit={(votes) => {
                  console.log(votes);
                }}
              />
            </>
          )}
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
