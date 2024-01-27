
export enum Phase {
    Join = 'join',
    Lobby = 'lobby',
    Movement = 'movement',
    Compose = 'compose',
    Vote = 'vote',
    Win = 'win',
    GameOver = 'game-over',
}

export type Votes = Record<string, number>

export interface Choice {
    playerId: string
    choice: string
    score: number
}
// Room Management
export interface Room {
    id: string;
    players: Player[]; // Updated to use Player interface
    unity: string
    incompleteSentence: string;
    currentMode: Phase;
    winner: string | null;
    roundNumber: number;
    choices: Choice[]
}

export interface SocketData {
    roomId: string
    ready: boolean
    playerId: string
    direction: Direction
    choice: string
    sentence: string
    obtainedPack: string
    words: string[]
    roundNumber: number
    choices: Choice[]
    votes: Votes
    winningChoice: Choice
    players: Player[]
}

export interface Direction {
    x: number
    y: number
}
export interface SocketMessage {
    command: SocketEvent | SocketBroadcast;
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
    words: string[]
    voted: boolean
}


export enum SocketEvent {
    CreateRoom = 'create-room',
    JoinRoom = 'join-room',
    PlayerReady = 'player-ready',
    PlayerMovement = 'player-movement',
    MovementPhaseTimerFinished = 'movement-phase-timer-finished',
    PlayerChoice = 'player-choice',
    PlayerPickUp = 'player-pick-up',
    ComposePhaseTimerFinished = 'compose-phase-timer-finished',
    VoteSubmitted = 'vote-submitted',
    VotePhaseTimerFinished = 'vote-phase-timer-finished',
    ReadyForNextRound = 'ready-for-next-round',
    NewGame = 'new-game',
}

export enum SocketBroadcast {
    RoomCreated = 'room-created',
    RoomJoined = 'room-joined',
    RoomNotFound = 'room-not-found',
    PlayerLeft = 'player-left',
    PlayerMovement = 'player-movement',
    StartMovementPhaseTimer = 'start-movement-phase-timer',
    LobbyPhase = 'lobby-phase',
    MovementPhase = 'movement-phase',
    ComposePhase = 'compose-phase',
    VotePhase = 'vote-phase',
    WinPhase = 'win-phase',
    GameOverPhase = 'game-over-phase',
    PlayerWords = 'player-words',
    StartComposePhaseTimer = 'start-compose-phase-timer',
    StartVotePhaseTimer = 'start-vote-phase-timer',
}