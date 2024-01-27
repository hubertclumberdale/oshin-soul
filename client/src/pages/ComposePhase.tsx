import { useEffect, useState } from "react";

type GridWord = {
  word: string;
  originalPosition: number;
};

interface ComposePhaseProps {
  sentence: string;
  words: string[];
  onSubmit: (sentence: string) => void
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
    const sentenceString = localSentence.join(' ');
    onSubmit(sentenceString);
  };

  return (
    <div>
      <div>
        {localSentence.map((word, index) => (
          <span
            key={index}
            onClick={() => word !== "X" && handleChosenWordClick(word)}
          >
            {word}{" "}
          </span>
        ))}
      </div>
      <div>
        {grid.map((wordObj, index) => (
          <button key={index} onClick={() => handleGridWordClick(wordObj.word)}>
            {wordObj.word}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={localSentence.includes("X")}>Submit</button>
    </div>
  );
};

export default ComposePhase;
