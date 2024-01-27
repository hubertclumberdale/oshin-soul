using UnityEngine;

public class GameManager : MonoBehaviour
{

    public WebsocketManager websocketManager;
    public Player[] players;
    public int timerDuration;
    public string gameMode;

    private float timer;

    private void Start()
    {
        timer = 5 / 1000f;
    }

    public void StartTimer()
    {
        Debug.Log("Timer started");
        if (timer > 0)
        {
            timer -= Time.deltaTime;
            if (timer <= 0)
            {
                Debug.Log("Timer ended");
                websocketManager.SendMovementPhaseTimerEnded();
            }
        }
    }

}

[System.Serializable]
public class Player
{
    public string playerName;
    public int playerScore;
}
