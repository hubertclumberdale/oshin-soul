import { Box, Typography } from "@mui/joy";
import React from "react";
import Lobby from "src/components/lobby";

interface LobbyPhaseProps {
  ready: boolean;
  toggleReady: () => void;
}

const LobbyPhase = ({ ready, toggleReady }: LobbyPhaseProps) => {
  return (
    <Box
      onClick={toggleReady}
      sx={{
        userSelect: "none",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: (theme) =>
          ready ? theme.palette.success.solidBg : theme.palette.danger.solidBg,
      }}
    >
      <Typography fontSize="xl" fontWeight="bold">
        {ready ? "Ready" : "Not Ready"}
      </Typography>
      {/* <Lobby ready={ready} toggleReady={toggleReady} /> */}
    </Box>
  );
};

export default LobbyPhase;
