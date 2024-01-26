"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvent = exports.Color = exports.Mode = void 0;
var Mode;
(function (Mode) {
    Mode["Join"] = "join";
    Mode["Lobby"] = "lobby";
    Mode["Movement"] = "movement";
    Mode["Compose"] = "compose";
    Mode["Vote"] = "vote";
    Mode["Win"] = "win";
    Mode["End"] = "end";
})(Mode || (exports.Mode = Mode = {}));
var Color;
(function (Color) {
    Color["Red"] = "red";
    Color["Blue"] = "blue";
    Color["Green"] = "green";
    Color["Yellow"] = "yellow";
    Color["Orange"] = "orange";
    Color["Purple"] = "purple";
    Color["Pink"] = "pink";
    Color["Brown"] = "brown";
    Color["White"] = "white";
    Color["Black"] = "black";
})(Color || (exports.Color = Color = {}));
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["Connection"] = "connection";
    SocketEvent["CreateRoom"] = "createRoom";
    SocketEvent["JoinRoom"] = "joinRoom";
    SocketEvent["PlayerReady"] = "playerReady";
    SocketEvent["StartGame"] = "startGame";
    SocketEvent["IncompleteSentence"] = "incompleteSentence";
    SocketEvent["NextTurn"] = "nextTurn";
    SocketEvent["ChangeMode"] = "changeMode";
    SocketEvent["StartMovementMode"] = "startMovementMode";
    SocketEvent["EndMovementMode"] = "endMovementMode";
    SocketEvent["UpdateScore"] = "updateScore";
    SocketEvent["StartNewRound"] = "startNewRound";
    SocketEvent["EndGame"] = "endGame";
    SocketEvent["PlayerMovement"] = "playerMovement";
    SocketEvent["PlayerSubmission"] = "playerSubmission";
    SocketEvent["Disconnect"] = "disconnect";
    SocketEvent["RoomCreated"] = "roomCreated";
    SocketEvent["RoomJoined"] = "roomJoined";
    SocketEvent["RoomNotFound"] = "roomNotFound";
    SocketEvent["GameStarted"] = "gameStarted";
    SocketEvent["NewTurn"] = "newTurn";
    SocketEvent["ModeChanged"] = "modeChanged";
    SocketEvent["MovementModeStarted"] = "movementModeStarted";
    SocketEvent["MovementModeEnded"] = "movementModeEnded";
    SocketEvent["NewRoundStarted"] = "newRoundStarted";
    SocketEvent["GameEnded"] = "gameEnded";
    SocketEvent["SubmissionReceived"] = "submissionReceived";
    SocketEvent["PlayerLeft"] = "playerLeft";
    SocketEvent["PlayerMoved"] = "playerMoved";
})(SocketEvent || (exports.SocketEvent = SocketEvent = {}));
//# sourceMappingURL=types.js.map