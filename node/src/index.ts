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
import WebSocket from 'ws';
const wss = new WebSocket.Server({ port: 4000 });

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

wss.on(SocketEvent.Connection, (ws) => {
    console.log('A user connected');

    // Handle WebSocket events for room management
    ws.on(SocketEvent.CreateRoom, () => {
        console.log('CreateRoom event triggered in room:', ws.id);
        // Create a new room
        const roomId = generateRoomId();
        const room: Room = {
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
            const player: Player = { id: ws.id, score: 0, color: randomColor, submission: '' };
            room.players.push(player);
            ws.send(JSON.stringify({ event: SocketEmit.RoomJoined, data: roomId }));
        } else {
            ws.send(JSON.stringify({ event: SocketEmit.RoomNotFound }));
        }
    });


    ws.on(SocketEvent.StartGame, (roomId) => {
        console.log('StartGame event triggered in room:', roomId);
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            room.gameStarted = true;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
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
                if (client.readyState === WebSocket.OPEN) {
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
                if (client.readyState === WebSocket.OPEN) {
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
                if (client.readyState === WebSocket.OPEN) {
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
                if (client.readyState === WebSocket.OPEN) {
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
            room.playersAreMoving = false
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
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
                if (client.readyState === WebSocket.OPEN) {
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
                if (client.readyState === WebSocket.OPEN) {
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
                    if (client.readyState === WebSocket.OPEN) {
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
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: SocketEmit.PlayerLeft, data: ws.id }));
                }
            });
        }
    });
});



wss.on('listening', () => {
    console.log('Node server started on on 4000')
})

// Helper function to generate a random room ID
function generateRoomId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomId = '';
    for (let i = 0; i < 6; i++) {
        roomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomId;
}
