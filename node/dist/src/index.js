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
const wss = new ws_1.default.Server({ port: 4000 });
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
                const roomId = generateRoomId();
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
                ws.send(JSON.stringify({ event: types_1.SocketEmit.RoomCreated, data: roomId }));
                break;
            }
            case types_1.SocketEvent.JoinRoom: {
                console.log('JoinRoom event triggered in room:', data.roomId);
                const room = rooms.find((r) => r.id === data.roomId);
                if (room) {
                    const randomColor = getRandomColor(room);
                    const player = { id: ws.id, score: 0, color: randomColor, submission: '' };
                    room.players.push(player);
                    ws.send(JSON.stringify({ event: types_1.SocketEmit.RoomJoined, data: data.roomId }));
                }
                else {
                    ws.send(JSON.stringify({ event: types_1.SocketEmit.RoomNotFound }));
                }
                break;
            }
            case types_1.SocketEvent.StartGame:
                console.log('StartGame event triggered in room:', data.roomId);
                const startGameRoom = rooms.find((r) => r.id === data.roomId);
                if (startGameRoom) {
                    startGameRoom.gameStarted = true;
                    wss.clients.forEach((client) => {
                        if (client.readyState === ws_1.default.OPEN) {
                            client.send(JSON.stringify({ event: types_1.SocketEmit.GameStarted }));
                        }
                    });
                }
                break;
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
                    client.send(JSON.stringify({ event: types_1.SocketEmit.PlayerLeft, data: ws.id }));
                }
            });
        }
    });
});
wss.on('listening', () => {
    console.log('Node server started on on 4000');
});
// Helper function to generate a random room ID
function generateRoomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomId = '';
    for (let i = 0; i < 6; i++) {
        roomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomId;
}
//# sourceMappingURL=index.js.map