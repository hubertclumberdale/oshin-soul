import { Box } from "@mui/joy";
import React from "react";
import Movement from "src/components/movement";

interface MovementPhaseProps {
  onMovement: (direction: { x: number; y: number }) => void;
}

const MovementPhase = ({ onMovement }: MovementPhaseProps) => {
  return (
    <Box
      sx={{ position: "relative", height: "100%", width: "100%" }}
      className="MovementPhase"
    >
      <Box sx={{ position: "absolute", bottom: 32, right: 32 }}>
        <Movement onMovement={onMovement} />
      </Box>
    </Box>
  );
};

export default MovementPhase;
