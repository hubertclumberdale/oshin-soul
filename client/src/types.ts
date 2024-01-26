
export enum Mode {
    Join = 'join',
    Lobby = 'lobby',
    Movement = 'movement',
    Compose = 'compose',
    Vote = 'vote',
    Win = 'win',
    End = 'end',
}

// Room Management
export interface Room {
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

export interface SocketData {
    roomId: string
    ready: boolean
    playerId: string
}

export interface SocketMessage {
    event: SocketEvent | SocketBroadcast;
    data?: Partial<SocketData>;
}

export enum Color {
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

export interface Player {
    id: string;
    score: number;
    color: Color;
    ready: boolean,
    submission: string
}


export enum SocketEvent {
    CreateRoom = 'create-room',
    JoinRoom = 'join-room',
    PlayerReady = 'player-ready',
    GameStarted = 'game-started',
    PlayerMovement = 'player-movement',
}

export enum SocketBroadcast {
    RoomCreated = 'room-created',
    RoomJoined = 'room-joined',
    RoomNotFound = 'room-not-found',
    PlayerLeft = 'player-left',
}