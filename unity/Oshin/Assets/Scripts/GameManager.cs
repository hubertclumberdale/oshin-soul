using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{


    public GameObject playerPrefab;
    public WebsocketManager websocketManager;
    private List<GameObject> players = new List<GameObject>();

    public int timerDuration;
    public string gameMode;

    public int movementPhaseTimerDuration = 10;
    public int composePhaseTimerDuration = 10;
    public int votePhaseTimerDuration = 10;

    public string[] packs;


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
        players.Add(player);
    }

    public void MovePlayer(string roomId, string playerId, float x, float y)
    {
        Debug.Log("Moving player: " + playerId + " in room: " + roomId + " in direction: " + x + ", " + y);
        // TODO: find player by id and move it
        foreach (GameObject player in players)
        {
            if (player.GetComponent<PlayerManager>().playerId == playerId)
            {
                player.GetComponent<PlayerManager>().inputVector = new Vector2(x, y);
            }
        }
    }

    public string GetRandomPack()
    {
        return packs[Random.Range(0, packs.Length)];
    }

    public string PlayerPickedUpPack(string playerId, string packName)
    {
        Debug.Log("Player: " + playerId + " picked up pack: " + packName);
        websocketManager.SendPlayerPickedUpPack(playerId, packName);
    }

}

[System.Serializable]
public class Player
{
    public string playerName;
    public int playerScore;
}
