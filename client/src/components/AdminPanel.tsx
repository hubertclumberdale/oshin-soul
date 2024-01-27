import { Button, Card, Chip } from "@mui/joy";
import React from "react";
import { SocketEvent } from "src/types";

interface AdminPanelProps {
  ws: WebSocket;
  roomId: string | undefined;
  endMovementTimer: () => void;
}

const AdminPanel = ({ ws, roomId, endMovementTimer }: AdminPanelProps) => {
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
    <Card size="sm">
      <Card size="sm" orientation="horizontal">
        <Button size="sm" onClick={createTestRoom}>
          Create Room
        </Button>
        <Chip>{roomId ? roomId : "No Room Id"}</Chip>
      </Card>
      <Card size="sm" orientation="horizontal">
        <Button size="sm" onClick={endMovementTimer}>
          End Movement Timer
        </Button>
      </Card>
    </Card>
  );
};

export default AdminPanel;
