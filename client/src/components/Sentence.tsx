import { Box, Chip, Typography } from "@mui/joy";
import { AnimatePresence, motion } from "framer-motion";

type SentenceProps = ActiveSentenceProps | DisabledSentenceProps;

interface DisabledSentenceProps {
  sentence: string[];
  disabled: true;
}

interface ActiveSentenceProps {
  sentence: string[];
  disabled: false;
  handleChosenWordClick: (word: string) => void;
  words: string[];
}

const MotionChip = motion(Chip);

const Sentence = (props: SentenceProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "min-content",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <AnimatePresence>
        {props.sentence.map((word, index) => (
          <Typography
            key={index}
            onClick={() =>
              !props.disabled &&
              word !== "X" &&
              props.handleChosenWordClick(word)
            }
          >
            {props.disabled && (
              <>
                {word !== "X" ? (
                  <Typography fontSize="xl">{word}</Typography>
                ) : (
                  <Chip
                    color="primary"
                    sx={{ minWidth: 100, textAlign: "center" }}
                  />
                )}
              </>
            )}

            {!props.disabled && (
              <>
                {word !== "X" ? (
                  <>
                    {props.words.includes(word) ? (
                      <MotionChip
                        variant="solid"
                        color="primary"
                        size="lg"
                        sx={{ minWidth: 100, height: 20, textAlign: "center" }}
                        initial={{ opacity: 0, scale: 0, y: 30 }} // Initial state (visible)
                        animate={{ opacity: 1, scale: 1, y: 0 }} // Animate to final state (visible)
                        exit={{ opacity: 0, scale: 0, y: 30 }} // Exit state (hidden)
                      >
                        {word}
                      </MotionChip>
                    ) : (
                      <Typography fontSize="xl">{word}</Typography>
                    )}
                  </>
                ) : (
                  <Chip
                    color="primary"
                    sx={{ minWidth: 100, textAlign: "center" }}
                  />
                )}
              </>
            )}
          </Typography>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default Sentence;
