"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketBroadcast = exports.SocketEvent = exports.Color = exports.Mode = void 0;
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
    SocketEvent["CreateRoom"] = "create-room";
    SocketEvent["JoinRoom"] = "join-room";
    SocketEvent["PlayerReady"] = "player-ready";
    SocketEvent["PlayerMovement"] = "player-movement";
    SocketEvent["MovementPhaseTimerFinished"] = "movement-phase-timer-finished";
})(SocketEvent || (exports.SocketEvent = SocketEvent = {}));
var SocketBroadcast;
(function (SocketBroadcast) {
    SocketBroadcast["RoomCreated"] = "room-created";
    SocketBroadcast["RoomJoined"] = "room-joined";
    SocketBroadcast["RoomNotFound"] = "room-not-found";
    SocketBroadcast["PlayerLeft"] = "player-left";
    SocketBroadcast["PlayerMovement"] = "player-movement";
    SocketBroadcast["StartMovementPhaseTimer"] = "start-movement-phase-timer";
    SocketBroadcast["MovementPhase"] = "movement-phase";
    SocketBroadcast["ComposePhase"] = "compose-phase";
    SocketBroadcast["VotePhase"] = "vote-phase";
    SocketBroadcast["WinPhase"] = "win-phase";
    SocketBroadcast["EndPhase"] = "end-phase";
})(SocketBroadcast || (exports.SocketBroadcast = SocketBroadcast = {}));
//# sourceMappingURL=types.js.map