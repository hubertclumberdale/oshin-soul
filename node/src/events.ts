import WebSocket from 'ws';

import { Phase, Room, SocketBroadcast, SocketData, SocketMessage } from "../types";
import { playerJoinedRoom, startComposePhase, startMovementPhase, startVotePhase, startWinPhase } from './broadcasts';
import { chooseSentence, addNewPlayer, createRoom, movePlayer, addWordsToPlayer, assignVotesToChoices } from './actions';
import { numberOfRounds } from '../config/game';

export const onCreateRoom = ({
    ws,
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
    ws.send(JSON.stringify({ event: SocketBroadcast.RoomCreated, data: { roomId: newRoom.id } }));
    console.log('Room created:', newRoom);
}

export const onJoinRoom = ({
    ws,
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
            roomId: data.roomId,
            player: newPlayer
        })
    } else {
        console.log('Room not found');
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
            const { direction } = data
            movePlayer({
                roomId: data.roomId,
                playerId: data.playerId,
                direction,
                wss
            })
        } else {
            console.log('Player not found');
        }
    } else {
        console.log('Room not found');
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
                client.send(JSON.stringify({ event: SocketBroadcast.PlayerLeft, data: ws.id }));
            }
        });
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
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
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
        const message: SocketMessage = { event: SocketBroadcast.RoomNotFound, }
        ws.send(JSON.stringify(message));
    }
}