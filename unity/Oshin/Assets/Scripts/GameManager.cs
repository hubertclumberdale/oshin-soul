using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public Text roomNumber;

    public Text roundNumber;

    public Text timer;

    public Text sentence;

    public Text score;

    public Text gameModeText;

    public GameObject playerPrefab;
    public WebsocketManager websocketManager;
    private List<GameObject> players = new List<GameObject>();

    public int timerDuration;
    public string gameMode;

    public int movementPhaseTimerDuration = 30;
    public int composePhaseTimerDuration = 30;
    public int votePhaseTimerDuration = 30;

    public int currentTimer;

    public string[] packs;

    public void StartMovementPhaseTimer()
    {   
        setGameMode("Movement");
        StartCoroutine(MovementPhaseTimer());
    }

    public void StartComposePhaseTimer()
    {
        setGameMode("Compose");
        StartCoroutine(ComposePhaseTimer());
    }


    public void StartVotePhaseTimer()
    {
        setGameMode("Vote");
        StartCoroutine(VotePhaseTimer());
    }

   IEnumerator MovementPhaseTimer()
    {
        currentTimer = movementPhaseTimerDuration;
        while (currentTimer > 0)
        {
            yield return new WaitForSeconds(1);
            currentTimer--;
            UpdateTimerText();
        }
        websocketManager.SendMovementPhaseTimerEnded();
    }

    IEnumerator ComposePhaseTimer()
    {
        currentTimer = composePhaseTimerDuration;
        while (currentTimer > 0)
        {
            yield return new WaitForSeconds(1);
            currentTimer--;
            UpdateTimerText();
        }
        websocketManager.SendComposePhaseTimerEnded();
    }

    IEnumerator VotePhaseTimer()
    {
        currentTimer = votePhaseTimerDuration;
        while (currentTimer > 0)
        {
            yield return new WaitForSeconds(1);
            currentTimer--;
            UpdateTimerText();
        }
        websocketManager.SendVotePhaseTimerEnded();
    }

    public void UpdateTimerText()
    {
        timer.text = currentTimer.ToString();
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

    public void PlayerPickedUpPack(string playerId, string packName)
    {
        Debug.Log("Player: " + playerId + " picked up pack: " + packName);
        websocketManager.SendPlayerPickedUpPack(playerId, packName);
    }

    public void setRoomNumber(string roomNumber)
    {
        this.roomNumber.text = roomNumber;
    }

    public void setRoundNumber(string roundNumber)
    {
        this.roundNumber.text = roundNumber;
    }

    public void setTimer(string timer)
    {
        this.timer.text = timer;
    }

    public void setSentence(string sentence)
    {
        this.sentence.text = sentence;
    }

    public void setScore(string score)
    {
        this.score.text = score;
    }

    public void setGameMode(string gameMode)
    {
        this.gameMode = gameMode;
        this.gameModeText.text = gameMode;
    }

}

[System.Serializable]
public class Player
{
    public string playerName;
    public int playerScore;
}
