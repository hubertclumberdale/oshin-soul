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
const wss = new ws_1.default.Server({ port: 4000 });
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
wss.on(SocketEvent.Connection, (ws) => {
    console.log('A user connected');
    // Handle WebSocket events for room management
    ws.on(SocketEvent.CreateRoom, () => {
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
            currentMode: Mode.Lobby,
            playersAreMoving: false,
            winner: null,
            roundNumber: 0,
        };
        rooms.push(room);
        ws.send(JSON.stringify({ event: SocketEmit.RoomCreated, data: roomId }));
    });
    ws.on(SocketEvent.JoinRoom, (roomId, playerName) => {
        console.log('JoinRoom event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const randomColor = getRandomColor(room);
            const player = { id: ws.id, score: 0, color: randomColor, submission: '' };
            room.players.push(player);
            ws.send(JSON.stringify({ event: SocketEmit.RoomJoined, data: roomId }));
        }
        else {
            ws.send(JSON.stringify({ event: SocketEmit.RoomNotFound }));
        }
    });
    ws.on(SocketEvent.StartGame, (roomId) => {
        console.log('StartGame event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.gameStarted = true;
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.GameStarted }));
                }
            });
        }
    });
    ws.on(SocketEvent.IncompleteSentence, (roomId, sentence) => {
        console.log('IncompleteSentence event triggered in room:', roomId);
        // Notify everyone in a specific room of the incomplete sentence
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.incompleteSentence = sentence;
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.IncompleteSentence, data: sentence }));
                }
            });
        }
    });
    ws.on(SocketEvent.NextTurn, (roomId) => {
        console.log('NextTurn event triggered in room:', roomId);
        // Start a new turn in a specific room until the game is over
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.turns++;
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.NewTurn, data: room.turns }));
                }
            });
        }
    });
    ws.on(SocketEvent.ChangeMode, (roomId, mode) => {
        console.log('ChangeMode event triggered in room:', roomId);
        // Change the current mode in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.currentMode = mode;
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.ModeChanged, data: mode }));
                }
            });
        }
    });
    ws.on(SocketEvent.StartMovementMode, (roomId) => {
        console.log('StartMovementMode event triggered in room:', roomId);
        // Notify when the movement mode starts in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.playersAreMoving = true;
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.MovementModeStarted }));
                }
            });
        }
    });
    ws.on(SocketEvent.EndMovementMode, (roomId) => {
        console.log('EndMovementMode event triggered in room:', roomId);
        // Notify when the movement mode ends in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.playersAreMoving = false;
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.MovementModeEnded }));
                }
            });
        }
    });
    ws.on(SocketEvent.UpdateScore, (roomId, playerName, score) => {
        console.log('UpdateScore event triggered in room:', roomId);
        // Update the score for a player in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const player = room.players.find((p) => p.id === ws.id);
            if (player) {
                player.score = score;
            }
        }
    });
    ws.on(SocketEvent.StartNewRound, (roomId) => {
        console.log('StartNewRound event triggered in room:', roomId);
        // Notify that a new round has started in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.roundNumber++;
            room.players.forEach((player) => {
                player.submission = "";
            });
            room.incompleteSentence = "";
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.NewRoundStarted, data: room.roundNumber }));
                }
            });
        }
    });
    ws.on(SocketEvent.EndGame, (roomId) => {
        console.log('EndGame event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.GameEnded, data: room.winner }));
                }
            });
        }
        // Disconnect the WebSocket connection
        ws.close();
    });
    // Handle WebSocket events for player management
    ws.on(SocketEvent.PlayerMovement, (roomId, x, y) => {
        console.log('PlayerMovement event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const player = room.players.find((p) => p.id === ws.id);
            if (player) {
                wss.clients.forEach((client) => {
                    if (client.readyState === ws_1.default.OPEN) {
                        client.send(JSON.stringify({ event: SocketEmit.PlayerMoved, data: { playerId: player.id, x, y } }));
                    }
                });
            }
        }
    });
    ws.on(SocketEvent.PlayerSubmission, (roomId, submission) => {
        console.log('PlayerSubmission event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const player = room.players.find((p) => p.id === ws.id);
            if (player) {
                player.submission = submission;
                ws.send(JSON.stringify({ event: SocketEmit.SubmissionReceived }));
            }
        }
    });
    ws.on(SocketEvent.Disconnect, () => {
        console.log('A user disconnected');
        const room = rooms.find((r) => r.players.some((p) => p.id === ws.id));
        if (room) {
            room.players = room.players.filter((p) => p.id !== ws.id);
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.PlayerLeft, data: ws.id }));
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