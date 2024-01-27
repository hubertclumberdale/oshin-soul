import { Box } from "@mui/joy";
import React from "react";
import Join from "src/components/join";
import { SocketEvent, SocketMessage } from "src/types";

interface JoinPhaseProps {
  ws: WebSocket;
}

const JoinPhase = ({ ws }: JoinPhaseProps) => {
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
    >
      <Join joinRoom={joinRoom} />
    </Box>
  );
};

export default JoinPhase;
