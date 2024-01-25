
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
    id: number;
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
    roomId: number
    ready: boolean
    playerId: number
}

export interface SocketMessage {
    event: SocketEvent;
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
    id: number;
    score: number;
    color: Color;
    ready: boolean,
    submission: string
}


export enum SocketEvent {
    Connection = 'connection',
    CreateRoom = 'createRoom',
    JoinRoom = 'joinRoom',
    PlayerReady = 'playerReady',
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
    RoomCreated = 'roomCreated',
    RoomJoined = 'roomJoined',
    RoomNotFound = 'roomNotFound',
    GameStarted = 'gameStarted',
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