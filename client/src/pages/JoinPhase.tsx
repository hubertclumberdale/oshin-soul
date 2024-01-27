import { Box } from "@mui/joy";
import React, { useState } from "react";
import { SocketEvent, SocketMessage } from "src/types";
import { Button, Input } from "@mui/joy";

interface JoinPhaseProps {
  ws: WebSocket;
}

const JoinPhase = ({ ws }: JoinPhaseProps) => {
  const [roomId, setRoomId] = useState("");

  const handleRoomInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRoomId(event.target.value);
  };

  const handleJoinRoomClick = () => {
    if (!ws) return;

    const message: SocketMessage = {
      event: SocketEvent.JoinRoom,
      data: {
        roomId,
      },
    };
    ws.send(JSON.stringify(message));
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        gap: 3,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="JoinPhase"
    >
      <Input
        size="lg"
        value={roomId}
        onChange={handleRoomInputChange}
        placeholder="Insert room id"
      />
      <Button size="lg" onClick={handleJoinRoomClick}>
        Join room
      </Button>
    </Box>
  );
};

export default JoinPhase;
