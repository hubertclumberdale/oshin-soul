import { Button, Input } from "@mui/joy";
import React, { useState } from "react";

interface JoinProps {
  joinRoom: (roomName: string) => void;
}
const Join = ({ joinRoom }: JoinProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    console.log("Joining room:", inputValue);
    joinRoom(inputValue);
  };

  return (
    <>
      <Input
        size="lg"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Insert room number"
      />
      <Button size="lg" onClick={handleButtonClick}>
        Join room
      </Button>
    </>
  );
};

export default Join;
