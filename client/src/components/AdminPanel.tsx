import { Button, Card, Chip, Typography } from "@mui/joy";
import { Phase, SocketEvent } from "src/types";

interface AdminPanelProps {
  ws: WebSocket;
  roomId: string | undefined;
  gameMode: string;
  playerId: string | undefined;
  endMovementTimer: () => void;
  addPackToPlayer: () => void;
}

const AdminPanel = ({
  ws,
  roomId,
  gameMode,
  playerId,
  endMovementTimer,
  addPackToPlayer,
}: AdminPanelProps) => {
  const createTestRoom = () => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        command: SocketEvent.CreateRoom,
        data: {},
      })
    );
  };

  return (
    <Card size="sm" sx={{ mb: 1 }}>
      <Typography fontSize="sm">AdminPanel</Typography>
      {gameMode === Phase.Join && (
        <Card size="sm" orientation="horizontal">
          <Button size="sm" onClick={createTestRoom}>
            Create Room
          </Button>
          <Chip>{roomId ? roomId : "No Room Id"}</Chip>
        </Card>
      )}
      {gameMode === Phase.Movement && (
        <Card size="sm" orientation="horizontal">
          <Button size="sm" onClick={endMovementTimer}>
            End Movement Timer
          </Button>
        </Card>
      )}
      {gameMode === Phase.Movement && (
        <Card size="sm" orientation="horizontal">
          <Button size="sm" onClick={addPackToPlayer}>
            Add Random Pack to Player
          </Button>
        </Card>
      )}
      <Card size="sm" orientation="horizontal">
        <Chip>{playerId ? "Player Id: "+ playerId : "No Player Id"}</Chip>
      </Card>
    </Card>
  );
};

export default AdminPanel;
