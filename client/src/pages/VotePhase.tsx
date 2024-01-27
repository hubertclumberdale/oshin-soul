import { useState } from "react";
import { Choice } from "src/types";

interface VotePhaseProps {
  choices: Choice[];
  onSubmit: (votes: Record<string, number>) => void;
}
const VotePhase = ({ choices, onSubmit }: VotePhaseProps) => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleVote = (choiceId: string, thumbsUp: number) => {
    setVotes((prevVotes) => {
      if (prevVotes[choiceId] === thumbsUp) {
        const newVotes = { ...prevVotes };
        delete newVotes[choiceId];
        return newVotes;
      } else {
        return { ...prevVotes, [choiceId]: thumbsUp };
      }
    });
  };

  const onClick = () => {
    onSubmit(votes);
    setIsSubmitted(true);
  };

  return (
    <div>
      {choices.map((choice) => (
        <div key={choice.playerId}>
          {choice.choice}
          <button
            onClick={() => handleVote(choice.playerId, 1)}
            disabled={votes[choice.playerId] === -1}
          >
            👍
          </button>
          <button
            onClick={() => handleVote(choice.playerId, -1)}
            disabled={votes[choice.playerId] === 1}
          >
            👎
          </button>
        </div>
      ))}
      <button onClick={onClick} disabled={isSubmitted}>
        Submit
      </button>
    </div>
  );
};

export default VotePhase;
