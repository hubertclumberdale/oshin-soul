import { Box, Card } from "@mui/joy";
import React from "react";
import Sentence from "src/components/Sentence";
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
      <Card>
        <Sentence sentence={"The X jumps over the X".split(" ")} disabled />
      </Card>
      <Box sx={{ position: "absolute", bottom: 32, right: 32 }}>
        <Movement onMovement={onMovement} />
      </Box>
    </Box>
  );
};

export default MovementPhase;
