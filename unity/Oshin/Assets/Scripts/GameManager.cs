using UnityEngine;
using System.Collections;


public class GameManager : MonoBehaviour
{


    public GameObject playerPrefab;
    public WebsocketManager websocketManager;
    private GameObject[] players;
    public int timerDuration;
    public string gameMode;

    public int movementPhaseTimerDuration = 10;
    public int composePhaseTimerDuration = 10;
    public int votePhaseTimerDuration = 10;


    public void StartMovementPhaseTimer()
    {
        StartCoroutine(MovementPhaseTimer());
    }

    public void StartComposePhaseTimer()
    {
        StartCoroutine(ComposePhaseTimer());
    }


    public void StartVotePhaseTimer()
    {
        StartCoroutine(VotePhaseTimer());
    }

    IEnumerator MovementPhaseTimer()
    {
        while (true)
        {
            yield return new WaitForSeconds(movementPhaseTimerDuration);
            websocketManager.SendMovementPhaseTimerEnded();
        }
    }

    // Define the ActionPhaseTimer coroutine
    IEnumerator ComposePhaseTimer()
    {
        while (true)
        {
            yield return new WaitForSeconds(composePhaseTimerDuration);
            websocketManager.SendComposePhaseTimerEnded();
        }
    }

    // Define the PlanningPhaseTimer coroutine
    IEnumerator VotePhaseTimer()
    {
        while (true)
        {
            yield return new WaitForSeconds(votePhaseTimerDuration);
            websocketManager.SendVotePhaseTimerEnded();
        }
    }

    public void InstantiatePlayer(string playerId)
    {
        GameObject player = Instantiate(playerPrefab) as GameObject;
        player.transform.position = GameObject.Find("SpawnPoint").transform.position;
        player.GetComponent<PlayerManager>().playerId = playerId;
    }

    public void MovePlayer(string roomId, string playerId, Direction direction)
    {
        Debug.Log("Moving player: " + playerId + " in room: " + roomId + " in direction: " + direction.x + ", " + direction.y);
        
    }

}

[System.Serializable]
public class Player
{
    public string playerName;
    public int playerScore;
}
