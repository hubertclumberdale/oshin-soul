import { Choice } from "src/types";

interface WinPhaseProps {
    winningChoice?: Choice
}

const WinPhase = ({winningChoice}: WinPhaseProps) => {
  return (
    <div>
      <h1>Win Phase</h1>
      <h3>{winningChoice?.choice}</h3>
    </div>
  );
};
export default WinPhase;
