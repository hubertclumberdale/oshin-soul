
export enum Phase {
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
    currentMode: Phase;
    playersAreMoving: boolean;
    winner: string | null;
    roundNumber: number
}
export interface SocketData {
    roomId: string
    ready: boolean
    playerId: string
    direction: Direction
    choice: string
}


export interface Direction {
    x: number
    y: number
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
    choice: string
    words: string[]
}


export enum SocketEvent {
    CreateRoom = 'create-room',
    JoinRoom = 'join-room',
    PlayerReady = 'player-ready',
    PlayerMovement = 'player-movement',
    MovementPhaseTimerFinished = 'movement-phase-timer-finished',
    PlayerChoice = 'player-choice',

}

export enum SocketBroadcast {
    RoomCreated = 'room-created',
    RoomJoined = 'room-joined',
    RoomNotFound = 'room-not-found',
    PlayerLeft = 'player-left',
    PlayerMovement = 'player-movement',
    StartMovementPhaseTimer = 'start-movement-phase-timer',
    MovementPhase = 'movement-phase',
    ComposePhase = 'compose-phase',
    VotePhase = 'vote-phase',
    WinPhase = 'win-phase',
    EndPhase = 'end-phase',

}