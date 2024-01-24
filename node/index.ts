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

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server);

enum Mode {
    Lobby = 'lobby',
    Movement = 'movement',
    Compose = 'compose',
    Vote = 'vote',
    Win = 'win',
    End = 'end',
}

// Room Management
interface Room {
    id: string;
    players: Player[]; // Updated to use Player interface
    unity: string
    gameStarted: boolean;
    incompleteSentence: string;
    turns: number;
    currentMode: Mode;
    playersAreMoving: boolean;
    winner: string | null;
    roundNumber: number
}

enum Color {
    Red = 'red',
    Blue = 'blue',
    Green = 'green',
    Yellow = 'yellow',
    Orange = 'orange',
    Purple = 'purple',
    Pink = 'pink',
    Brown = 'brown',
    White = 'white',
    Black = 'black',
}

interface Player {
    id: string;
    score: number;
    color: Color;
    submission: string
}

const rooms: Room[] = [];

enum SocketEvent {
    Connection = 'connection',
    CreateRoom = 'createRoom',
    JoinRoom = 'joinRoom',
    StartGame = 'startGame',
    IncompleteSentence = 'incompleteSentence',
    NextTurn = 'nextTurn',
    ChangeMode = 'changeMode',
    StartMovementMode = 'startMovementMode',
    EndMovementMode = 'endMovementMode',
    UpdateScore = 'updateScore',
    StartNewRound = 'startNewRound',
    EndGame = 'endGame',
    PlayerMovement = 'playerMovement',
    PlayerSubmission = 'playerSubmission',
    Disconnect = 'disconnect',
}

enum SocketEmit {
    RoomCreated = 'roomCreated',
    RoomJoined = 'roomJoined',
    RoomNotFound = 'roomNotFound',
    GameStarted = 'gameStarted',
    IncompleteSentence = 'incompleteSentence',
    NewTurn = 'newTurn',
    ModeChanged = 'modeChanged',
    MovementModeStarted = 'movementModeStarted',
    MovementModeEnded = 'movementModeEnded',
    NewRoundStarted = 'newRoundStarted',
    GameEnded = 'gameEnded',
    SubmissionReceived = 'submissionReceived',
    PlayerLeft = 'playerLeft',
    PlayerMoved = 'playerMoved'
}

function getRandomColor(room: Room): Color {
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
        // Create a new room
        const roomId = generateRoomId();
        const room: Room = {
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
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const randomColor = getRandomColor(room);
            const player: Player = { id: socket.id, score: 0, color: randomColor, submission: '' };
            room.players.push(player);
            socket.join(roomId);
            socket.emit(SocketEmit.RoomJoined, roomId);
        } else {
            socket.emit(SocketEmit.RoomNotFound);
        }
    });


    socket.on(SocketEvent.StartGame, (roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.gameStarted = true;
            io.to(roomId).emit(SocketEmit.GameStarted);
        }
    });

    socket.on(SocketEvent.IncompleteSentence, (roomId, sentence) => {
        // Notify everyone in a specific room of the incomplete sentence
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.incompleteSentence = sentence;
            io.to(roomId).emit(SocketEmit.IncompleteSentence, sentence);
        }
    });

    socket.on(SocketEvent.NextTurn, (roomId) => {
        // Start a new turn in a specific room until the game is over
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.turns++;
            io.to(roomId).emit(SocketEmit.NewTurn, room.turns);
        }
    });

    socket.on(SocketEvent.ChangeMode, (roomId, mode) => {
        // Change the current mode in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.currentMode = mode;
            io.to(roomId).emit(SocketEmit.ModeChanged, mode);
        }
    });

    socket.on(SocketEvent.StartMovementMode, (roomId) => {
        // Notify when the movement mode starts in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.playersAreMoving = true;
            io.to(roomId).emit(SocketEmit.MovementModeStarted);
        }
    });

    socket.on(SocketEvent.EndMovementMode, (roomId) => {
        // Notify when the movement mode ends in a specific room
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.playersAreMoving = false
            io.to(roomId).emit(SocketEmit.MovementModeEnded);
        }
    });

    socket.on(SocketEvent.UpdateScore, (roomId, playerName, score) => {
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
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            io.to(roomId).emit(SocketEmit.GameEnded, room.winner);
        }
        // Disconnect the WebSocket connection
        socket.disconnect();
    });
    

    // Handle socket events for player management
    socket.on(SocketEvent.PlayerMovement, (roomId, x, y) => {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const player = room.players.find((p) => p.id === socket.id);
            if (player) {
                io.to(roomId).emit(SocketEmit.PlayerMoved, player.id, x, y);
            }
        }
    });

    socket.on(SocketEvent.PlayerSubmission, (roomId, submission) => {
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
function generateRoomId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomId = '';
    for (let i = 0; i < 6; i++) {
        roomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomId;
}
