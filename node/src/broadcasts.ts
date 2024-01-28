import WebSocket from "ws";
import { Phase, Player, Room, SocketBroadcast, SocketMessage } from "../types";
import { cleanRoom } from "./actions";

export const startLobbyPhase = (
    {
        wss,
        room
    }: {
        wss: WebSocket.Server,
        room: Room
    }
) => {
    console.log('Cleaning up room and players');
    room.players.forEach((player) => {
        player.ready = false;
        player.words = [];
        player.voted = false;
    });
    room.currentMode = Phase.Lobby;

    cleanRoom({ room });

    console.log('Starting lobby phase');

    const message: SocketMessage = { command: SocketBroadcast.LobbyPhase, data: { roomId: room.id } };
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

export const startMovementPhase = (
    {
        wss,
        room,
        sentence
    }: {
        wss: WebSocket.Server,
        room: Room
        sentence: string
    }
) => {
    console.log('Starting movement phase')
    room.currentMode = Phase.Movement;
    room.players.forEach((player) => {
        player.ready = false;
    })

    const gameStarted: SocketMessage = { command: SocketBroadcast.MovementPhase, data: { roomId: room.id, sentence } }
    const startTimer: SocketMessage = { command: SocketBroadcast.StartMovementPhaseTimer, data: { roomId: room.id } }
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
    const message: SocketMessage = { command: SocketBroadcast.ComposePhase, data: { roomId: room.id } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });

    room.players.forEach((player) => {
        const playerMessage: SocketMessage = { command: SocketBroadcast.PlayerWords, data: { roomId: room.id, playerId: player.id, words: player.words } }
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(playerMessage));
            }
        });
    });
    const startTimer = { command: SocketBroadcast.StartComposePhaseTimer, data: { roomId: room.id } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(startTimer));
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
    const choices = room.choices
    console.log("Sending choices to players:", choices)
    const message: SocketMessage = { command: SocketBroadcast.VotePhase, data: { roomId: room.id, choices } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
    const startTimer = { command: SocketBroadcast.StartVotePhaseTimer, data: { roomId: room.id } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(startTimer));
        }
    });
}

export const playerJoinedRoom = ({
    ws,
    wss,
    room,
    player,
}: {
    ws: WebSocket,
    wss: WebSocket.Server,
    room: Room,
    player: Player
}) => {
    console.log('Player joined room:', player);
    const message: SocketMessage = { command: SocketBroadcast.RoomJoined, data: { roomId: room.id, playerId: player.id } }
    ws.send(JSON.stringify(message));
    console.log("room.unity", room.unity)
    if (room.unity) {
        room.unity.send(JSON.stringify(message));
    }

}

export const startWinPhase = ({
    wss,
    room
}: {
    wss: WebSocket.Server,
    room: Room
}) => {
    console.log('Starting win phase');
    room.currentMode = Phase.Win;
    if (!room.choices) {
        const message: SocketMessage = { command: SocketBroadcast.WinPhase, data: { roomId: room.id, winningChoice: { choice: 'No one won! Fuck YOU!!!', score: 0, playerId: '-1' } } }
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    const winningChoice = room.choices?.reduce((prev, current) => (prev.score > current.score) ? prev : current)
    const message: SocketMessage = { command: SocketBroadcast.WinPhase, data: { roomId: room.id, winningChoice } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
export const startGameOverPhase = ({
    wss,
    room
}: {
    wss: WebSocket.Server,
    room: Room
}) => {
    console.log('Game finished');
    room.currentMode = Phase.GameOver
    const message: SocketMessage = { command: SocketBroadcast.GameOverPhase, data: { roomId: room.id, players: room.players } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}