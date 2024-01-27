import WebSocket from 'ws';

import { Color, Phase, Player, Room, SocketBroadcast, SocketData, SocketMessage } from "../types";

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

export const createRoom = ({
    ws,
    wss,
    rooms
}: {
    ws: WebSocket,
    wss: WebSocket.Server,
    rooms: Room[]
}) => {
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
    ws.send(JSON.stringify({ event: SocketBroadcast.RoomCreated, data: { roomId } }));
    console.log('Room created:', room);
}

export const joinRoom = ({
    ws,
    wss,
    rooms,
    data
}: {
    ws: WebSocket,
    wss: WebSocket.Server,
    rooms: Room[]
    data: SocketData
}) => {
    console.log('JoinRoom event triggered in room:', data.roomId);
    console.log(data.roomId)
    console.log(rooms)
    const room = rooms.find((room) => room.id == data.roomId);
    console.log(room)
    if (room) {
        const randomColor = getRandomColor(room);
        const player: Player = { id: generateId(), score: 0, ready: false, color: randomColor, choice: '', words: [] };
        room.players.push(player);
        console.log('Player joined room:', player);
        const message: SocketMessage = { event: SocketBroadcast.RoomJoined, data: { roomId: data.roomId, playerId: player.id } }
        ws.send(JSON.stringify(message));
    } else {
        console.log('Room not found');
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}