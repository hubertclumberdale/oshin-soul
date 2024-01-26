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
import { Color, Mode, Player, Room, SocketEvent, SocketMessage } from '../types';
const wss = new WebSocket.Server({ port: 7002 });

const rooms: Room[] = [];

function getRandomColor(room: Room): Color {
    const colors = Object.values(Color);
    const pickedColors = room.players.map((player) => player.color);
    const availableColors = colors.filter((color) => !pickedColors.includes(color));
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
}

wss.on('connection', (ws: WebSocket) => {
    console.log('A user connected');

    ws.on('message', (message: string) => {
        const { event, data } = JSON.parse(message) as SocketMessage;
        console.log('Received event:', event, 'with data:', data);

        switch (event) {
            case SocketEvent.CreateRoom: {
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
                    currentMode: Mode.Lobby,
                    playersAreMoving: false,
                    winner: null,
                    roundNumber: 0,
                };
                rooms.push(room);
                ws.send(JSON.stringify({ event: SocketEvent.RoomCreated, data: { roomId } }));
                console.log('Room created:', room);
                break;
            }

            case SocketEvent.JoinRoom: {
                console.log('JoinRoom event triggered in room:', data.roomId);
                console.log(data.roomId)
                console.log(rooms)
                const room = rooms.find((room) => room.id == data.roomId);
                console.log(room)
                if (room) {
                    const randomColor = getRandomColor(room);
                    const player: Player = { id: generateId(), score: 0, ready: false, color: randomColor, submission: '' };
                    room.players.push(player);
                    console.log('Player joined room:', player);
                    const message: SocketMessage = { event: SocketEvent.RoomJoined, data: { roomId: data.roomId, playerId: player.id } }
                    ws.send(JSON.stringify(message));
                } else {
                    console.log('Room not found');
                    const message: SocketMessage = { event: SocketEvent.RoomNotFound, }
                    ws.send(JSON.stringify(message));
                }
                break;
            }

            case SocketEvent.PlayerReady: {
                console.log('PlayerReady event triggered in room:', data.roomId);
                const room = rooms.find((room) => room.id == data.roomId);
                if (room) {
                    console.log(room.players)
                    const player = room.players.find((player) => player.id === data.playerId);
                    if (player) {
                        console.log('Player found:', player);
                        const { ready } = data
                        player.ready = ready;
                        if (ready) {
                            console.log('Player is ready:', player);
                            const allPlayersReady = room.players.every((player) => player.ready);
                            if (allPlayersReady) {
                                console.log('All players are ready');
                                room.gameStarted = true;
                                room.currentMode = Mode.Movement;
                                const message: SocketMessage = { event: SocketEvent.GameStarted, data: { roomId: data.roomId } }
                                wss.clients.forEach((client) => {
                                    if (client.readyState === WebSocket.OPEN) {
                                        client.send(JSON.stringify(message));
                                    }
                                });
                            }
                        } else {
                            console.log('Player is not ready:', player);
                        }
                    } else {
                        console.log('Player not found');
                    }
                } else {
                    console.log('Room not found');
                    const message: SocketMessage = { event: SocketEvent.RoomNotFound, }
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
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: SocketEvent.PlayerLeft, data: ws.id }));
                }
            });
        }
    });
});



wss.on('listening', () => {
    console.log('Node server started on on 4000')
})

function generateId(): string {
    return `${Math.floor(Math.random() * 1000)}`
}
