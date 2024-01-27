import { Box, Chip, Typography } from "@mui/joy";
import React from "react";

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
      {props.sentence.map((word, index) => (
        <Typography
          key={index}
          onClick={() =>
            !props.disabled && word !== "X" && props.handleChosenWordClick(word)
          }
        >
          {props.disabled && (
            <>
              {word !== "X" ? (
                <Typography fontSize="xl">{word}</Typography>
              ) : (
                <Chip color="primary" sx={{ minWidth: 100 }} />
              )}
            </>
          )}

          {!props.disabled && (
            <>
              {word !== "X" ? (
                <>
                  {props.words.includes(word) ? (
                    <Chip
                      variant="solid"
                      color="primary"
                      size="lg"
                      sx={{ minWidth: 100, height: 20 }}
                    >
                      {word}
                    </Chip>
                  ) : (
                    <Typography fontSize="xl">{word}</Typography>
                  )}
                </>
              ) : (
                <Chip color="primary" sx={{ minWidth: 100 }} />
              )}
            </>
          )}
        </Typography>
      ))}
    </Box>
  );
};

export default Sentence;
