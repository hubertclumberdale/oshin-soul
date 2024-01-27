import WebSocket from "ws";
import { Phase, Player, Room, SocketBroadcast, SocketMessage } from "../types";

export const startMovementPhase = (
    {
        wss,
        room
    }: {
        wss: WebSocket.Server,
        room: Room
    }
) => {
    console.log('Starting movement phase')
    room.gameStarted = true;
    room.currentMode = Phase.Movement;
    const gameStarted: SocketMessage = { event: SocketBroadcast.MovementPhase, data: { roomId: room.id } }
    const startTimer: SocketMessage = { event: SocketBroadcast.StartMovementPhaseTimer, data: { roomId: room.id } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(gameStarted));
            client.send(JSON.stringify(startTimer));
        }
    });
}

export const startComposePhase = ({
    wss,
    room
}: {
    wss: WebSocket.Server,
    room: Room
}) => {
    room.currentMode = Phase.Compose;
    const message: SocketMessage = { event: SocketBroadcast.ComposePhase, data: { roomId: room.id } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

export const startVotePhase = ({
    wss,
    room
}: {
    wss: WebSocket.Server,
    room: Room
}) => {
    console.log('All players have submitted their choice, starting vote phase');
    room.currentMode = Phase.Vote;
    const message: SocketMessage = { event: SocketBroadcast.VotePhase, data: { roomId: room.id } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

export const playerJoinedRoom = ({
    ws,
    roomId,
    player,
}: {
    ws: WebSocket,
    roomId: string,
    player: Player
}

) => {
    console.log('Player joined room:', player);
    const message: SocketMessage = { event: SocketBroadcast.RoomJoined, data: { roomId, playerId: player.id } }
    ws.send(JSON.stringify(message));
}