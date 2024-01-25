import React, { useState } from "react";

const Lobby = ({ webSocket }: { webSocket: WebSocket }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    console.log("Sending value:", inputValue);
  };

  return (
    <div>
      <h1>Lobby</h1>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleButtonClick}>Join room</button>
    </div>
  );
};

export default Lobby;
