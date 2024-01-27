using System;
using UnityEngine;
using WebSocketSharp;
using System.Collections.Concurrent;


[System.Serializable]
class SocketData {
    public string roomId;
    public string playerId;
    public Direction direction;
}

[System.Serializable]
class SocketMessage {
    public string command;
    public SocketData data;
}
public class WebsocketManager : MonoBehaviour
{
    private WebSocket ws;

    public GameManager gameManager;
    private readonly ConcurrentQueue<Action> _actions = new ConcurrentQueue<Action>(); 

    private string roomId;
        
    void Start()
    {
        ws = new WebSocket("ws://localhost:7002");
        
        ws.OnMessage += OnMessageHandler; // Use OnMessageHandler instead of a lambda function
        ws.OnClose += OnCloseHandler;
        ws.ConnectAsync();

    }
    private void OnCloseHandler(object sender, CloseEventArgs e)
    {
        Debug.Log("WebSocket closed with reason: " + e.Reason);
    }

    void OnDestroy()
    {
        if (ws != null)
        {
            ws.Close();
            ws = null;
        }
    }

    private void Update ()
    {
        // Work the dispatched actions on the Unity main thread
        while(_actions.Count > 0)
        {
            if(_actions.TryDequeue(out var action))
            {
                action?.Invoke();
            }
        }
    }

    public void CreateRoom (){
        Debug.Log("Creating room");
        SocketMessage message = new SocketMessage();
        message.command = "create-room";
        ws.Send(JsonUtility.ToJson(message));

    }

    void OnMessageHandler(object sender, MessageEventArgs e)
    {
        SocketMessage socketMessage = JsonUtility.FromJson<SocketMessage>(""+e.Data);
        Debug.Log("Received Message: " + socketMessage.command);
        if(socketMessage.command.ToString() == "room-created"){
            Debug.Log("Room Created: " + socketMessage.data);
            _actions.Enqueue(() => SetRoomId(socketMessage.data.roomId));
        }

        if(socketMessage.command.ToString() == "movement-phase"){
            _actions.Enqueue(() => SetGameMode("movement-phase"));
        }
        if(socketMessage.command.ToString() == "room-joined"){
            _actions.Enqueue(() => AddPlayer(socketMessage.data.playerId));
        }

        if(socketMessage.command.ToString() == "start-movement-phase-timer"){
            _actions.Enqueue(() => StartMovementPhaseTimer());
        }

        if(socketMessage.command.ToString() == "player-movement"){
            _actions.Enqueue(() => MovePlayer(socketMessage.data.roomId, socketMessage.data.playerId, socketMessage.data.direction));
        }

        if(socketMessage.command.ToString() == "start-compose-phase-timer"){
            _actions.Enqueue(() => StartComposePhaseTimer());
        }

        if(socketMessage.command.ToString() == "start-vote-phase-timer"){
            _actions.Enqueue(() => StartVotePhaseTimer());
        }
    }

    private void SetGameMode(string gameMode){
        gameManager.gameMode = gameMode;
    }

    private void SetRoomId(string roomId){
        Debug.Log("Setting room id to: " + roomId);
        this.roomId = roomId;
    }

    private void AddPlayer(string playerId){
        Debug.Log("Adding player: " + playerId);
        gameManager.InstantiatePlayer(playerId);
    }
    
    private void StartMovementPhaseTimer(){
        gameManager.StartMovementPhaseTimer();
    }

    private void StartComposePhaseTimer(){
        gameManager.StartComposePhaseTimer();
    }

    private void StartVotePhaseTimer(){
        gameManager.StartVotePhaseTimer();
    }

    private void MovePlayer(string roomId, string playerId, Direction direction){
        Debug.Log("Moving player: " + playerId + " in room: " + roomId + " in direction: " + direction.x + ", " + direction.y);
        gameManager.MovePlayer(roomId, playerId, direction);
    }

    public void SendMovementPhaseTimerEnded(){
        Debug.Log("Sending movement-phase-timer-finished");
        SocketMessage message = new SocketMessage();
        message.command = "movement-phase-timer-finished";
        message.data = new SocketData();
        message.data.roomId = this.roomId;
        ws.Send(JsonUtility.ToJson(message));
    }


    public void SendComposePhaseTimerEnded(){
        Debug.Log("Sending compose-phase-timer-finished");
        SocketMessage message = new SocketMessage();
        message.command = "compose-phase-timer-finished";
        message.data = new SocketData();
        message.data.roomId = this.roomId;
        ws.Send(JsonUtility.ToJson(message));
    }


    public void SendVotePhaseTimerEnded(){
        Debug.Log("Sending vote-phase-timer-finished");
        SocketMessage message = new SocketMessage();
        message.command = "vote-phase-timer-finished";
        message.data = new SocketData();
        message.data.roomId = this.roomId;
        ws.Send(JsonUtility.ToJson(message));
    }

}