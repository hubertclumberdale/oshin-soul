interface MovementProps {
  onMovement: (direction: { x: number; y: number }) => void;
}

const Movement = ({onMovement}: MovementProps) => {
  return (
    <div>
      <h1>Movement</h1>
    </div>
  );
};
export default Movement;
