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
      <button onClick={onReadyForNextRound}>Next Round</button>
    </div>
  );
};
export default WithMotion(WinPhase);
