import WebSocket from 'ws';

import { Phase, Room, SocketBroadcast, SocketData, SocketMessage } from "../types";
import { playerJoinedRoom, startComposePhase, startGameOverPhase, startLobbyPhase, startMovementPhase, startVotePhase, startWinPhase } from './broadcasts';
import { chooseSentence, addNewPlayer, createRoom, movePlayer, addWordsToPlayer, assignVotesToChoices, closeRoom } from './actions';
import { numberOfRounds } from '../config/game';

export const onCreateRoom = ({
    ws,
    wss,
    rooms
}: {
    ws: WebSocket,
    wss: WebSocket.Server,
    rooms: Room[]
}) => {
    const newRoom = createRoom({
        ws,
        rooms
    })
    const message: SocketMessage = { command: SocketBroadcast.RoomCreated, data: { roomId: newRoom.id } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    })
    console.log('Room created:', newRoom);
}


export const onJoinRoom = ({
    ws,
    wss,
    rooms,
    data
}: {
    ws: WebSocket,
    wss: WebSocket.Server,
    rooms: Room[]
    data: Partial<SocketData>
}) => {
    console.log('JoinRoom event triggered in room:', data.roomId);
    console.log(data.roomId)
    console.log(rooms)
    const room = rooms.find((room) => room.id == data.roomId);
    console.log(room)
    if (room) {
        const newPlayer = addNewPlayer({
            room
        })

        playerJoinedRoom({
            ws,
            wss,
            roomId: data.roomId,
            player: newPlayer
        })
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}

export const onPlayerReady = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
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
                    const sentence = chooseSentence({
                        room
                    })

                    startMovementPhase({
                        wss,
                        room,
                        sentence
                    })
                }
            } else {
                console.log('Player is not ready:', player);
            }
        } else {
            console.log('Player not found');
        }
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}
export const onPlayerMovement = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('PlayerMovement event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        const player = room.players.find((player) => player.id === data.playerId);
        if (player) {
            const { x, y } = data
            movePlayer({
                roomId: data.roomId,
                playerId: data.playerId,
                x,
                y,
                wss
            })
        } else {
            console.log('Player not found');
        }
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}
export const onMovementPhaseTimerFinished = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('TimerFinished event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        startComposePhase({
            wss,
            room
        })
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}

export const onPlayerPickUp = ({
    ws,
    rooms,
    data
}: {
    ws: WebSocket,
    wss: WebSocket.Server,
    rooms: Room[]
    data: Partial<SocketData>
}) => {
    console.log('PlayerPickUp event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        const player = room.players.find((player) => player.id === data.playerId);

        if (player) {
            addWordsToPlayer({
                obtainedPack: data.obtainedPack,
                player,
            })
        } else {
            console.log('Player not found');
        }
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}

export const onPlayerChoice = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('PlayerChoice event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id === data.roomId);
    if (room) {
        room.choices.push({
            playerId: data.playerId,
            choice: data.choice,
            score: 0
        });
        console.log('Room choices:', room.choices);
        const allPlayersVoted = room.choices.length === room.players.length;
        if (allPlayersVoted) {
            startVotePhase({
                wss,
                room
            })
        }
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}

export const onPlayerDisconnected = (
    {
        ws,
        wss,
        rooms,
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
    }
) => {
    console.log('A user disconnected');
    const room = rooms.find((r) => r.players.some((p) => p.id === ws.id));
    if (room) {
        room.players = room.players.filter((p) => p.id !== ws.id);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ command: SocketBroadcast.PlayerLeft, data: ws.id }));
            }
        });
        if (room.players.length === 0) {
            closeRoom({
                wss,
                rooms,
                room
            })
        }
    }
}

export const onComposePhaseTimerFinished = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('TimerFinished event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        startVotePhase({
            wss,
            room
        })
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}

export const onVoteSubmitted = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('VoteSubmitted event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        assignVotesToChoices({
            room,
            votes: data.votes
        })
        const currentPlayer = room.players.find((player) => player.id === data.playerId);
        currentPlayer.voted = true
        const allPlayersVoted = room.players.every((player) => player.voted);
        if (allPlayersVoted) {
            startWinPhase({
                wss,
                room
            })
        }
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}

export const onVotePhaseTimerFinished = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('TimerFinished event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        assignVotesToChoices({
            room,
            votes: data.votes
        })
        startWinPhase({
            wss,
            room,
        })
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}

export const onPlayerReadyForNextRound = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('PlayerReadyForNextRound event triggered in room:', data.roomId);
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        const player = room.players.find((player) => player.id === data.playerId);
        if (player) {
            player.ready = true;
            const allPlayersReady = room.players.every((player) => player.ready);
            if (allPlayersReady) {
                room.roundNumber += 1;
                if (room.roundNumber < numberOfRounds) {
                    startLobbyPhase({
                        wss,
                        room
                    })
                } else {
                    startGameOverPhase({
                        wss,
                        room
                    })
                }
            }
        } else {
            console.log('Player not found');
        }
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }

}

export const onNewGame = (
    {
        ws,
        wss,
        rooms,
        data
    }: {
        ws: WebSocket,
        wss: WebSocket.Server,
        rooms: Room[]
        data: Partial<SocketData>
    }
) => {
    console.log('NewGame event triggered');
    /* TODO: reset current room variables and set game back to lobby */
    const room = rooms.find((room) => room.id == data.roomId);
    if (room) {
        room.players.forEach((player) => {
            player.ready = false;
        });
        room.roundNumber = 0;
        room.currentMode = Phase.Lobby;
        startLobbyPhase({
            wss,
            room
        })
    } else {
        console.log('Room not found');
        const message: SocketMessage = { command: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}