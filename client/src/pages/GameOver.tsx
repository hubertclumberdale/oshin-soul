import { Player } from "src/types";

interface GameOverProps {
  players: Player[];
}
const GameOver = ({ players }: GameOverProps) => {
  return (
    <>
      <h1>Game Over</h1>
      <h3>
        Winner:{" "}
        {players.reduce((prev, curr) => {
          if (curr.score > prev.score) {
            return curr;
          } else {
            return prev;
          }
        }).color}
      </h3>
    </>
  );
};
export default GameOver;
