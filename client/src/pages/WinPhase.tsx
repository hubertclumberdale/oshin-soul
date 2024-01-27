import { Button } from "@mui/joy";
import WithMotion from "src/hoc/WithMotion";
import { Choice } from "src/types";

interface WinPhaseProps {
  winningChoice?: Choice;
  onReadyForNextRound: () => void;
}

const WinPhase = ({ winningChoice, onReadyForNextRound }: WinPhaseProps) => {
  return (
    <div>
      <h1>Win Phase</h1>
      <h3>{winningChoice?.choice}</h3>
      <Button onClick={onReadyForNextRound}>Next Round</Button>
    </div>
  );
};
export default WithMotion(WinPhase);
