
interface LobbyProps {
  ready: boolean;
  toggleReady: () => void;
}
const Lobby = ({ ready, toggleReady }: LobbyProps) => {
  return (
    <div>
      <h1>Lobby</h1>
      <h3>Player is {ready ? 'ready' : 'not ready'}</h3>
      <button onClick={toggleReady}>Ready</button>
    </div>
  );
};

export default Lobby;
