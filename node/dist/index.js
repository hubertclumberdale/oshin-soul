"use strict";
/*
FEATURES: TO IMPLEMENT
Server
Game Management

Create the game
Instantiate the socket and save the Unity reference
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
var Mode;
(function (Mode) {
    Mode["Lobby"] = "lobby";
    Mode["Movement"] = "movement";
    Mode["Compose"] = "compose";
    Mode["Vote"] = "vote";
    Mode["Win"] = "win";
    Mode["End"] = "end";
})(Mode || (Mode = {}));
var Color;
(function (Color) {
    Color["Red"] = "red";
    Color["Blue"] = "blue";
    Color["Green"] = "green";
    Color["Yellow"] = "yellow";
    Color["Orange"] = "orange";
    Color["Purple"] = "purple";
    Color["Pink"] = "pink";
    Color["Brown"] = "brown";
    Color["White"] = "white";
    Color["Black"] = "black";
})(Color || (Color = {}));
const rooms = [];
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["Connection"] = "connection";
    SocketEvent["CreateRoom"] = "createRoom";
    SocketEvent["JoinRoom"] = "joinRoom";
    SocketEvent["StartGame"] = "startGame";
    SocketEvent["IncompleteSentence"] = "incompleteSentence";
    SocketEvent["NextTurn"] = "nextTurn";
    SocketEvent["ChangeMode"] = "changeMode";
    SocketEvent["StartMovementMode"] = "startMovementMode";
    SocketEvent["EndMovementMode"] = "endMovementMode";
    SocketEvent["UpdateScore"] = "updateScore";
    SocketEvent["StartNewRound"] = "startNewRound";
    SocketEvent["EndGame"] = "endGame";
    SocketEvent["PlayerMovement"] = "playerMovement";
    SocketEvent["PlayerSubmission"] = "playerSubmission";
    SocketEvent["Disconnect"] = "disconnect";
})(SocketEvent || (SocketEvent = {}));
var SocketEmit;
(function (SocketEmit) {
    SocketEmit["RoomCreated"] = "roomCreated";
    SocketEmit["RoomJoined"] = "roomJoined";
    SocketEmit["RoomNotFound"] = "roomNotFound";
    SocketEmit["GameStarted"] = "gameStarted";
    SocketEmit["IncompleteSentence"] = "incompleteSentence";
    SocketEmit["NewTurn"] = "newTurn";
    SocketEmit["ModeChanged"] = "modeChanged";
    SocketEmit["MovementModeStarted"] = "movementModeStarted";
    SocketEmit["MovementModeEnded"] = "movementModeEnded";
    SocketEmit["NewRoundStarted"] = "newRoundStarted";
    SocketEmit["GameEnded"] = "gameEnded";
    SocketEmit["SubmissionReceived"] = "submissionReceived";
    SocketEmit["PlayerLeft"] = "playerLeft";
    SocketEmit["PlayerMoved"] = "playerMoved";
})(SocketEmit || (SocketEmit = {}));
function getRandomColor(room) {
    const colors = Object.values(Color);
    const pickedColors = room.players.map((player) => player.color);
    const availableColors = colors.filter((color) => !pickedColors.includes(color));
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
}
io.on(SocketEvent.Connection, (socket) => {
    console.log('A user connected');
    // Handle socket events for room management
    socket.on(SocketEvent.CreateRoom, () => {
        console.log('CreateRoom event triggered in room:', socket.id);
        // Create a new room
        const roomId = generateRoomId();
        const room = {
            id: roomId,
            players: [],
            unity: socket.id,
            gameStarted: false,
            incompleteSentence: '',
            turns: 0,
            currentMode: Mode.Lobby,
            playersAreMoving: false,
            winner: null,
            roundNumber: 0,
        };
        rooms.push(room);
        socket.join(roomId);
        socket.emit(SocketEmit.RoomCreated, roomId);
    });
    socket.on(SocketEvent.JoinRoom, (roomId, playerName) => {
        console.log('JoinRoom event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const randomColor = getRandomColor(room);
            const player = { id: socket.id, score: 0, color: randomColor, submission: '' };
            room.players.push(player);
            socket.join(roomId);
            socket.emit(SocketEmit.RoomJoined, roomId);
        }
        else {
            socket.emit(SocketEmit.RoomNotFound);
        }
    });
    socket.on(SocketEvent.StartGame, (roomId) => {
        console.log('StartGame event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.gameStarted = true;
            io.to(roomId).emit(SocketEmit.GameStarted);
        }
    });
    socket.on(SocketEvent.IncompleteSentence, (roomId, sentence) => {
        console.log('IncompleteSentence event triggered in room:', roomId);
        // Notify everyone in a specific room of the incomplete sentence
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.incompleteSentence = sentence;
            io.to(roomId).emit(SocketEmit.IncompleteSentence, sentence);
        }
    });
    socket.on(SocketEvent.NextTurn, (roomId) => {
        console.log('NextTurn event triggered in room:', roomId);
        // Start a new turn in a specific room until the game is over
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.turns++;
            io.to(roomId).emit(SocketEmit.NewTurn, room.turns);
        }
    });
    socket.on(SocketEvent.ChangeMode, (roomId, mode) => {
        console.log('ChangeMode event triggered in room:', roomId);
        // Change the current mode in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.currentMode = mode;
            io.to(roomId).emit(SocketEmit.ModeChanged, mode);
        }
    });
    socket.on(SocketEvent.StartMovementMode, (roomId) => {
        console.log('StartMovementMode event triggered in room:', roomId);
        // Notify when the movement mode starts in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.playersAreMoving = true;
            io.to(roomId).emit(SocketEmit.MovementModeStarted);
        }
    });
    socket.on(SocketEvent.EndMovementMode, (roomId) => {
        console.log('EndMovementMode event triggered in room:', roomId);
        // Notify when the movement mode ends in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.playersAreMoving = false;
            io.to(roomId).emit(SocketEmit.MovementModeEnded);
        }
    });
    socket.on(SocketEvent.UpdateScore, (roomId, playerName, score) => {
        console.log('UpdateScore event triggered in room:', roomId);
        // Update the score for a player in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const player = room.players.find((p) => p.id === socket.id);
            if (player) {
                player.score = score;
            }
        }
    });
    socket.on(SocketEvent.StartNewRound, (roomId) => {
        console.log('StartNewRound event triggered in room:', roomId);
        // Notify that a new round has started in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.roundNumber++;
            room.players.forEach((player) => {
                player.submission = "";
            });
            room.incompleteSentence = "";
            io.to(roomId).emit(SocketEmit.NewRoundStarted, room.roundNumber);
        }
    });
    socket.on(SocketEvent.EndGame, (roomId) => {
        console.log('EndGame event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            io.to(roomId).emit(SocketEmit.GameEnded, room.winner);
        }
        // Disconnect the WebSocket connection
        socket.disconnect();
    });
    // Handle socket events for player management
    socket.on(SocketEvent.PlayerMovement, (roomId, x, y) => {
        console.log('PlayerMovement event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const player = room.players.find((p) => p.id === socket.id);
            if (player) {
                io.to(roomId).emit(SocketEmit.PlayerMoved, player.id, x, y);
            }
        }
    });
    socket.on(SocketEvent.PlayerSubmission, (roomId, submission) => {
        console.log('PlayerSubmission event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const player = room.players.find((p) => p.id === socket.id);
            if (player) {
                player.submission = submission;
                io.to(socket.id).emit(SocketEmit.SubmissionReceived);
            }
        }
    });
    socket.on(SocketEvent.Disconnect, () => {
        console.log('A user disconnected');
        const room = rooms.find((r) => r.players.some((p) => p.id === socket.id));
        if (room) {
            room.players = room.players.filter((p) => p.id !== socket.id);
            io.to(room.id).emit(SocketEmit.PlayerLeft, socket.id);
        }
    });
});
server.listen(3000, () => {
    console.log('Server is running on port 3000');
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