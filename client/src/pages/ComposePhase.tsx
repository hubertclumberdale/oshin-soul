import { Box, Button, Card, Chip } from "@mui/joy";
import { useEffect, useState } from "react";
import Sentence from "src/components/Sentence";

type GridWord = {
  word: string;
  originalPosition: number;
};

interface ComposePhaseProps {
  sentence: string;
  words: string[];
  onSubmit: (sentence: string) => void;
}

const ComposePhase = ({ sentence, words, onSubmit }: ComposePhaseProps) => {
  const [localSentence, setLocalSentence] = useState<string[]>([]);
  const [originalGrid, setOriginalGrid] = useState<GridWord[]>([]);
  const [grid, setGrid] = useState<GridWord[]>([]);

  useEffect(() => {
    setLocalSentence(sentence.split(" "));
    const grid = words.map((word, index) => ({
      word,
      originalPosition: index,
    }));
    setOriginalGrid(grid);
    setGrid(grid);
  }, [sentence, words]);

  const handleGridWordClick = (word: string) => {
    const sentenceCopy = [...localSentence];
    const wordIndex = sentenceCopy.indexOf("X");
    if (wordIndex !== -1) {
      sentenceCopy[wordIndex] = word;
      setLocalSentence(sentenceCopy);
      setGrid(grid.filter((w) => w.word !== word));
    }
  };

  const handleChosenWordClick = (word: string) => {
    if (words.includes(word)) {
      const sentenceCopy = [...localSentence];
      const wordIndex = sentenceCopy.indexOf(word);
      if (wordIndex !== -1) {
        sentenceCopy[wordIndex] = "X";
        setLocalSentence(sentenceCopy);
        const originalPosition = originalGrid.find(
          (w) => w.word === word
        )?.originalPosition;
        setGrid(
          [
            ...grid.filter((w) => w.word !== word),
            { word, originalPosition: originalPosition ?? grid.length },
          ].sort((a, b) => a.originalPosition - b.originalPosition)
        );
      }
    }
  };

  const handleSubmit = () => {
    const sentenceString = localSentence.join(" ");
    onSubmit(sentenceString);
  };

  return (
    <Box
      sx={{
        widht: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Card orientation="horizontal" sx={{ minWidth: "100%", height: "50%" }}>
        <Sentence
          sentence={localSentence}
          words={words}
          handleChosenWordClick={handleChosenWordClick}
          disabled={false}
        />
      </Card>
      <Card
        orientation="horizontal"
        sx={{ flexWrap: "wrap", minWidth: "100%", height: "50%" }}
      >
        <Box
          sx={{
            display: "flex",
            height: "min-content",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {grid.map((wordObj, index) => (
            <Chip
              disabled={!localSentence.includes("X")}
              color="primary"
              size="lg"
              key={index}
              onClick={() => handleGridWordClick(wordObj.word)}
              sx={{ minHeight: 50 }}
            >
              {wordObj.word}
            </Chip>
          ))}
        </Box>
      </Card>
      <Button onClick={handleSubmit} disabled={localSentence.includes("X")}>
        Submit
      </Button>
    </Box>
  );
};

export default ComposePhase;
