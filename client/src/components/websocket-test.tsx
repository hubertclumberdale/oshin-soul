/* 


io.on(SocketEvent.Connection, (socket) => {
    console.log('A user connected');

    // Handle socket events for room management
    socket.on(SocketEvent.CreateRoom, () => {
        console.log('CreateRoom event triggered in room:', socket.id);
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
        console.log('JoinRoom event triggered in room:', roomId);
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
            room.playersAreMoving = false
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
});*/

import React, { useEffect, useState } from "react";

enum SocketEvent {
  UpdateScore = "updateScore",
  StartNewRound = "startNewRound",
  EndGame = "endGame",
  PlayerMovement = "playerMovement",
  PlayerSubmission = "playerSubmission",
  Disconnect = "disconnect",
}

enum SocketEmit {
  NewRoundStarted = "newRoundStarted",
  GameEnded = "gameEnded",
  PlayerMoved = "playerMoved",
  SubmissionReceived = "submissionReceived",
  PlayerLeft = "playerLeft",
}

interface Player {
  id: string;
  score: number;
  submission: string;
}

interface Room {
  id: string;
  roundNumber: number;
  players: Player[];
  incompleteSentence: string;
  winner: string;
}

const WebsocketTest: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Connection
  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3000"); // replace with your server address
    setWs(websocket);
    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      console.log("WebSocket connected");
    }

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };
  }, [ws]);

  
  return (
    <div>
      <h1>Websocket Test</h1>
      <p>Rooms: {rooms.length}</p>
      <p>Players: {rooms.length > 0 ? rooms[0].players.length : 0}</p>
    </div>
  );
};

export default WebsocketTest;
