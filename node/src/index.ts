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
import { Color, Phase, Player, Room, SocketBroadcast, SocketEvent, SocketMessage } from '../types';
import { createRoom, joinRoom } from './events';
const wss = new WebSocket.Server({ port: 7002 });

const rooms: Room[] = [];


wss.on('connection', (ws: WebSocket) => {
    console.log('A user connected');

    ws.on('message', (message: string) => {
        const { event, data } = JSON.parse(message) as SocketMessage;
        console.log('Received event:', event, 'with data:', data);

        switch (event) {
            case SocketEvent.CreateRoom: {

                createRoom({
                    ws,
                    wss,
                    rooms
                })

                break;
            }

            case SocketEvent.JoinRoom: {
                joinRoom({
                    ws,
                    wss,
                    rooms,
                    data
                })
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
                                room.currentMode = Phase.Movement;
                                const gameStarted: SocketMessage = { event: SocketBroadcast.MovementPhase, data: { roomId: data.roomId } }
                                const startTimer: SocketMessage = { event: SocketBroadcast.StartMovementPhaseTimer, data: { roomId: data.roomId } }
                                wss.clients.forEach((client) => {
                                    if (client.readyState === WebSocket.OPEN) {
                                        client.send(JSON.stringify(gameStarted));
                                        client.send(JSON.stringify(startTimer));
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
                    const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
                    ws.send(JSON.stringify(message));
                }
                break;
            }

            case SocketEvent.PlayerMovement: {
                console.log('PlayerMovement event triggered in room:', data.roomId);
                const room = rooms.find((room) => room.id == data.roomId);
                if (room) {
                    const player = room.players.find((player) => player.id === data.playerId);
                    if (player) {
                        const { direction } = data
                        const message: SocketMessage = { event: SocketBroadcast.PlayerMovement, data: { roomId: data.roomId, playerId: data.playerId, direction } }
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(message));
                            }
                        });
                    } else {
                        console.log('Player not found');
                    }
                } else {
                    console.log('Room not found');
                    const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
                    ws.send(JSON.stringify(message));
                }
                break;
            }

            case SocketEvent.MovementPhaseTimerFinished: {
                console.log('TimerFinished event triggered in room:', data.roomId);
                const room = rooms.find((room) => room.id == data.roomId);
                if (room) {
                    const message: SocketMessage = { event: SocketBroadcast.ComposePhase, data: { roomId: data.roomId } }
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(message));
                        }
                    });
                } else {
                    console.log('Room not found');
                    const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
                    ws.send(JSON.stringify(message));
                }
                break;
            }

            case SocketEvent.PlayerChoice: {
                console.log('PlayerChoice event triggered in room:', data.roomId);
                const room = rooms.find((room) => room.id == data.roomId);
                if (room) {
                    const player = room.players.find((player) => player.id === data.playerId);
                    if (player) {
                        const { choice } = data
                        player.choice = choice;
                        const allPlayersSubmitted = room.players.every((player) => player.choice !== '');
                        if (allPlayersSubmitted) {
                            console.log('All players have submitted their choice');
                            room.currentMode = Phase.Vote;
                            const message: SocketMessage = { event: SocketBroadcast.VotePhase, data: { roomId: data.roomId } }
                            wss.clients.forEach((client) => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify(message));
                                }
                            });
                        }

                    } else {
                        console.log('Player not found');
                    }
                } else {
                    console.log('Room not found');
                    const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
                    client.send(JSON.stringify({ event: SocketBroadcast.PlayerLeft, data: ws.id }));
                }
            });
        }
    });
});



wss.on('listening', () => {
    console.log('Node server started on on 7002')
})
