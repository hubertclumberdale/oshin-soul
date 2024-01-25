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
    console.log("Joining room:", inputValue)
    joinRoom(inputValue);
  };

  return (
    <div>
      <h1>Join</h1>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleButtonClick}>Join room</button>
    </div>
  );
};

export default Join;
