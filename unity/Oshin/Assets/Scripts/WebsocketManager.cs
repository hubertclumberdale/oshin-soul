using System;
using UnityEngine;
using WebSocketSharp;
using System.Collections.Concurrent;


[System.Serializable]
class SocketData {
    public string roomId;
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

        if(socketMessage.command.ToString() == "start-movement-phase-timer"){
            _actions.Enqueue(() => StartTimer());
        }    
    }

    private void SetGameMode(string gameMode){
        gameManager.gameMode = gameMode;
    }

    private void SetRoomId(string roomId){
        Debug.Log("Setting room id to: " + roomId);
        this.roomId = roomId;
    }
    
    private void StartTimer(){
        gameManager.StartTimer();
    }

    public void SendMovementPhaseTimerEnded(){
        Debug.Log("Sending movement-phase-timer-ended");
        SocketMessage message = new SocketMessage();
        message.command = "movement-phase-timer-finished";
        message.data = new SocketData();
        message.data.roomId = this.roomId;
        ws.Send(JsonUtility.ToJson(message));
    }

}