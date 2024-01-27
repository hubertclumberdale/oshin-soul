import { Box, Button } from "@mui/joy";
import Movement from "src/components/movement";

interface LobbyPhaseProps {
  ready: boolean;
  toggleReady: () => void;
  onMovement: (direction: { x: number; y: number }) => void;
}

const LobbyPhase = ({ ready, toggleReady, onMovement }: LobbyPhaseProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        userSelect: "none",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="LobbyPhase"
    >
      <Button
        size="lg"
        onClick={toggleReady}
        color={ready ? "success" : "neutral"}
      >
        {ready ? "Ready" : "Not ready"}
      </Button>
      <Box sx={{ position: "absolute", bottom: 32, right: 32 }}>
        <Movement onMovement={onMovement} />
      </Box>
    </Box>
  );
};

export default LobbyPhase;
