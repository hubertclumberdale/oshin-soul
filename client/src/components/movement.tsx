import { Joystick } from 'react-joystick-component';

interface MovementProps {
  onMovement: (direction: { x: number; y: number }) => void;
}

const Movement = ({onMovement}: MovementProps) => {

  const handleMove = (e: any) => {
    onMovement({x: e.x, y: e.y});
  }
  return (
    <div>
      <h1>Movement</h1>
      <Joystick size={100} move={handleMove} ></Joystick>
    </div>
  );
};
export default Movement;
