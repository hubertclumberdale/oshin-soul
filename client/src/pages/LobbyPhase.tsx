import { Box, Button, Card } from "@mui/joy";
import Movement from "src/components/movement";
import withMotion from "src/hoc/WithMotion";
import { motion } from "framer-motion";

interface LobbyPhaseProps {
  ready: boolean;
  toggleReady: () => void;
  onMovement: (direction: { x: number; y: number }) => void;
}

const MotionButton = motion(Button);

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
        gap: 2,
      }}
      className="LobbyPhase"
    >
      <Card sx={{ flexGrow: 1, maxHeight: "50%", overflowY: "auto" }}>
        Tutorialone generate a caso in tono napoletano e poi lo metto in un
        uaglio e lo faccio cuocere per 20 minuti a fuoco lento. Tutorialone
        generate a caso in tono napoletano e poi lo metto in un uaglio e lo
        faccio cuocere per 20 minuti a fuoco lento. Tutorialone generate a caso
        in tono napoletano e poi lo metto in un uaglio e lo faccio cuocere per
        20 minuti a fuoco lento. Tutorialone generate a caso in tono napoletano
        e poi lo metto in un uaglio e lo faccio cuocere per 20 minuti a fuoco
      </Card>
      <Box
        sx={{
          flexGrow: 1,
          maxHeight: "10%",
          overflowY: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MotionButton
          sx={{ minWidth: 200, maxWidth: 200, minHeight: 100 }}
          animate={{ rotate: [1, -1, 1] }} // Rotate between 2 and -2 degrees
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} // Yoyo effect to alternate between the two states indefinitely
          size="lg"
          onClick={toggleReady}
          color={ready ? "success" : "neutral"}
        >
          {ready ? "Ready" : "Not ready"}
        </MotionButton>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          maxHeight: "40%",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", bottom: 32, right: 32 }}>
          <Movement onMovement={onMovement} />
        </Box>
      </Box>
    </Box>
  );
};

export default withMotion(LobbyPhase);
