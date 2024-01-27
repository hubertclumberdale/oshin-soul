import { Box, Button, IconButton, Card } from "@mui/joy";
import { useState } from "react";
import thumbUp from "src/asset/thumb-up.png";
import thumbDown from "src/asset/thumb-down.png";
import { useEffect } from "react";
import { Choice, Votes } from "src/types";
import WithMotion from "src/hoc/WithMotion";

interface VotePhaseProps {
  choices: Choice[];
  onSubmit: (votes: Votes) => void;
}
const VotePhase = ({ choices, onSubmit }: VotePhaseProps) => {
  const [votes, setVotes] = useState<Votes>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    console.log(votes);
  }, [votes]);

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
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowY: "auto",
      }}
      className="VotePhase"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          flexGrow: 1,
          justifyContent: "center",
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
        {choices.map((choice) => (
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}
          >
            <Card
              size="sm"
              key={choice.playerId}
              sx={{ minWidth: "70%", userSelect: "none", textAlign: "center" }}
            >
              {choice.choice} lorem ipsum dolor sit amet consectetur adipisicing
            </Card>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                variant="soft"
                color="primary"
                size="sm"
                onClick={() => handleVote(choice.playerId, 1)}
                disabled={votes[choice.playerId] === -1}
                sx={{ userSelect: "none" }}
              >
                <img
                  src={thumbUp}
                  alt="thumb up"
                  style={{ width: 32, height: 32 }}
                />
              </IconButton>

              <IconButton
                variant="soft"
                color="primary"
                size="sm"
                onClick={() => handleVote(choice.playerId, -1)}
                disabled={votes[choice.playerId] === 1}
                sx={{ userSelect: "none" }}
              >
                <img
                  src={thumbDown}
                  alt="thumb down"
                  style={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      <Button onClick={onClick} disabled={isSubmitted}>
        Submit
      </Button>
    </Box>
  );
};

export default WithMotion(VotePhase);
