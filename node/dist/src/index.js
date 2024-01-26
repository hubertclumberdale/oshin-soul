"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
FEATURES: TO IMPLEMENT
Server
Game Management

Create the game
Instantiate the WebSocket and save the Unity reference
Add players to the game
Listen for phone connections and save them in a list
Start the game
Notify everyone (Unity and players) that the game has started
Incomplete Sentence
Notify everyone of the incomplete sentence
Turns
Keep track of turns. Start a new turn until the game is over
Mode
Keep track of the current mode (lobby, movement, compose, vote, win, end)
Time
Notify when the movement mode starts and ends
Winner
Keep track of the score for each player. When the game ends, the player with the highest score wins
Start a second round
Notify that a new round has started
End the game
Notify the winner
Player Management
Player movement using x, y
Player submission
*/
const ws_1 = __importDefault(require("ws"));
const types_1 = require("../types");
const wss = new ws_1.default.Server({ port: 7002 });
const rooms = [];
function getRandomColor(room) {
    const colors = Object.values(types_1.Color);
    const pickedColors = room.players.map((player) => player.color);
    const availableColors = colors.filter((color) => !pickedColors.includes(color));
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
}
wss.on('connection', (ws) => {
    console.log('A user connected');
    ws.on('message', (message) => {
        const { event, data } = JSON.parse(message);
        console.log('Received event:', event, 'with data:', data);
        switch (event) {
            case types_1.SocketEvent.CreateRoom: {
                console.log('CreateRoom event triggered in room:', ws.id);
                // Create a new room
                const roomId = generateId();
                const room = {
                    id: roomId,
                    players: [],
                    unity: ws.id,
                    gameStarted: false,
                    incompleteSentence: '',
                    turns: 0,
                    currentMode: types_1.Mode.Lobby,
                    playersAreMoving: false,
                    winner: null,
                    roundNumber: 0,
                };
                rooms.push(room);
                ws.send(JSON.stringify({ event: types_1.SocketBroadcast.RoomCreated, data: { roomId } }));
                console.log('Room created:', room);
                break;
            }
            case types_1.SocketEvent.JoinRoom: {
                console.log('JoinRoom event triggered in room:', data.roomId);
                console.log(data.roomId);
                console.log(rooms);
                const room = rooms.find((room) => room.id == data.roomId);
                console.log(room);
                if (room) {
                    const randomColor = getRandomColor(room);
                    const player = { id: generateId(), score: 0, ready: false, color: randomColor, submission: '' };
                    room.players.push(player);
                    console.log('Player joined room:', player);
                    const message = { event: types_1.SocketBroadcast.RoomJoined, data: { roomId: data.roomId, playerId: player.id } };
                    ws.send(JSON.stringify(message));
                }
                else {
                    console.log('Room not found');
                    const message = { event: types_1.SocketBroadcast.RoomNotFound, };
                    ws.send(JSON.stringify(message));
                }
                break;
            }
            case types_1.SocketEvent.PlayerReady: {
                console.log('PlayerReady event triggered in room:', data.roomId);
                const room = rooms.find((room) => room.id == data.roomId);
                if (room) {
                    console.log(room.players);
                    const player = room.players.find((player) => player.id === data.playerId);
                    if (player) {
                        console.log('Player found:', player);
                        const { ready } = data;
                        player.ready = ready;
                        if (ready) {
                            console.log('Player is ready:', player);
                            const allPlayersReady = room.players.every((player) => player.ready);
                            if (allPlayersReady) {
                                console.log('All players are ready');
                                room.gameStarted = true;
                                room.currentMode = types_1.Mode.Movement;
                                const gameStarted = { event: types_1.SocketBroadcast.MovementPhase, data: { roomId: data.roomId } };
                                const startTimer = { event: types_1.SocketBroadcast.StartMovementPhaseTimer, data: { roomId: data.roomId } };
                                wss.clients.forEach((client) => {
                                    if (client.readyState === ws_1.default.OPEN) {
                                        client.send(JSON.stringify(gameStarted));
                                        client.send(JSON.stringify(startTimer));
                                    }
                                });
                            }
                        }
                        else {
                            console.log('Player is not ready:', player);
                        }
                    }
                    else {
                        console.log('Player not found');
                    }
                }
                else {
                    console.log('Room not found');
                    const message = { event: types_1.SocketBroadcast.RoomNotFound, };
                    ws.send(JSON.stringify(message));
                }
                break;
            }
            case types_1.SocketEvent.PlayerMovement: {
                console.log('PlayerMovement event triggered in room:', data.roomId);
                const room = rooms.find((room) => room.id == data.roomId);
                if (room) {
                    const player = room.players.find((player) => player.id === data.playerId);
                    if (player) {
                        console.log('Player found:', player);
                        const { direction } = data;
                        const message = { event: types_1.SocketBroadcast.PlayerMovement, data: { roomId: data.roomId, playerId: data.playerId, direction } };
                        wss.clients.forEach((client) => {
                            if (client.readyState === ws_1.default.OPEN) {
                                client.send(JSON.stringify(message));
                            }
                        });
                    }
                    else {
                        console.log('Player not found');
                    }
                }
                else {
                    console.log('Room not found');
                    const message = { event: types_1.SocketBroadcast.RoomNotFound, };
                    ws.send(JSON.stringify(message));
                }
                break;
            }
            case types_1.SocketEvent.MovementPhaseTimerFinished: {
                console.log('TimerFinished event triggered in room:', data.roomId);
                const room = rooms.find((room) => room.id == data.roomId);
                if (room) {
                    const message = { event: types_1.SocketBroadcast.ComposePhase, data: { roomId: data.roomId } };
                    wss.clients.forEach((client) => {
                        if (client.readyState === ws_1.default.OPEN) {
                            client.send(JSON.stringify(message));
                        }
                    });
                }
                else {
                    console.log('Room not found');
                    const message = { event: types_1.SocketBroadcast.RoomNotFound, };
                    ws.send(JSON.stringify(message));
                }
                break;
            }
            default:
                console.log('Unknown event:', event);
                break;
        }
    });
    ws.on('close', () => {
        console.log('A user disconnected');
        const room = rooms.find((r) => r.players.some((p) => p.id === ws.id));
        if (room) {
            room.players = room.players.filter((p) => p.id !== ws.id);
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: types_1.SocketBroadcast.PlayerLeft, data: ws.id }));
                }
            });
        }
    });
});
wss.on('listening', () => {
    console.log('Node server started on on 4000');
});
function generateId() {
    return `${Math.floor(Math.random() * 1000)}`;
}
//# sourceMappingURL=index.js.map