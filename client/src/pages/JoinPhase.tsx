import { Box } from "@mui/joy";
import React, { useState } from "react";
import { SocketEvent, SocketMessage } from "src/types";
import { Button, Input } from "@mui/joy";
import { motion } from "framer-motion"; // Import motion from framer-motion
import WithMotion from "src/hoc/WithMotion";

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
    <motion.div
      style={{ flexGrow: 1 }}
      initial={{ opacity: 0, x: 100 }} // Initial state (hidden)
      animate={{ opacity: 1, x: 0 }} // Final state (visible)
    >
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
    </motion.div>
  );
};

export default WithMotion(JoinPhase);
