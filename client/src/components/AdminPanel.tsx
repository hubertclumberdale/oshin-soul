import { Box, Button, Card, Chip, Typography } from "@mui/joy";
import React from "react";
import { SocketEvent } from "src/types";

interface AdminPanelProps {
  ws: WebSocket;
  roomId: string | undefined;
}

const AdminPanel = ({ ws, roomId }: AdminPanelProps) => {
  const createTestRoom = () => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        event: SocketEvent.CreateRoom,
        data: {},
      })
    );
  };

  return (
    <Card orientation="horizontal" sx={{ justifyContent: "space-between" }}>
      <Button size="sm" onClick={createTestRoom}>
        Create Room
      </Button>
      <Chip>{roomId ? roomId : "No Room Id"}</Chip>
    </Card>
  );
};

export default AdminPanel;
