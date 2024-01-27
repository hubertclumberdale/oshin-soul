import { Box } from "@mui/joy";
import React, { useState } from "react";
import { SocketEvent, SocketMessage } from "src/types";
import { Button, Input } from "@mui/joy";
import WithMotion from "src/hoc/WithMotion";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

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
      command: SocketEvent.JoinRoom,
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
        justifyContent: "stretch",
      }}
      className="JoinPhase"
    >
      <Box
        sx={{
          minHeight: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Input
          sx={{ minWidth: 200, maxWidth: 200 }}
          size="lg"
          value={roomId}
          onChange={handleRoomInputChange}
          placeholder="Room ID"
        />
      </Box>

      <Box
        sx={{
          minHeight: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MotionButton
          sx={{ minWidth: 200, maxWidth: 200, minHeight: 100 }}
          size="lg"
          onClick={handleJoinRoomClick}
          animate={{ rotate: [1, -1, 1] }} // Rotate between 2 and -2 degrees
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} // Yoyo effect to alternate between the two states indefinitely
        >
          Join room
        </MotionButton>
      </Box>
    </Box>
  );
};

export default WithMotion(JoinPhase);
