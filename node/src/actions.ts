import WebSocket from 'ws'
import { Color, Direction, Phase, Player, Room, SocketBroadcast, SocketMessage } from "../types";

function generateId(): string {
    return `${Math.floor(Math.random() * 1000)}`
}

function getRandomColor(room: Room): Color {
    const colors = Object.values(Color);
    const pickedColors = room.players.map((player) => player.color);
    const availableColors = colors.filter((color) => !pickedColors.includes(color));
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
}

export const createRoom = (
    {
        ws,
        rooms
    }: {
        ws: WebSocket,
        rooms: Room[]
    }
) => {
    console.log('CreateRoom event triggered in room:', ws.id);
    // Create a new room
    const roomId = generateId();
    const room: Room = {
        id: roomId,
        players: [],
        unity: ws.id,
        gameStarted: false,
        incompleteSentence: '',
        turns: 0,
        currentMode: Phase.Lobby,
        playersAreMoving: false,
        winner: null,
        roundNumber: 0,
    };
    rooms.push(room);
    return room
}

export const addNewPlayer = ({
    room
}: {
    room: Room
}) => {
    const randomColor = getRandomColor(room);
    const player: Player = { id: generateId(), score: 0, ready: false, color: randomColor, choice: '', words: [] };
    room.players.push(player);
    return player
}

export const movePlayer = ({
    roomId,
    playerId,
    direction,
    wss
}: {
    roomId: string,
    playerId: string,
    direction: Direction,
    wss: WebSocket.Server
}) => {
    const message: SocketMessage = { event: SocketBroadcast.PlayerMovement, data: { roomId: roomId, playerId: playerId, direction } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}