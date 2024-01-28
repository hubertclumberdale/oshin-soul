using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerManager : MonoBehaviour
{
    public string playerId = "-1";
    public float speed = 5f; // Velocità del giocatore
    public Vector2 inputVector; // Input per il movimento

    public List<string> pickedWords = new List<string>();

    private CharacterController characterController;

    private AudioManager audioManager;


    private GameManager gameManager;
    void Start()
    {
        characterController = GetComponent<CharacterController>();
        GameManager gameManager = FindObjectOfType<GameManager>();
        AudioManager audioManager = FindObjectOfType<AudioManager>();
    }
    void Update()
    {
        MovePlayer();
    }

    void MovePlayer()
    {
        Vector3 moveDirection = new Vector3(inputVector.x, 0, inputVector.y);
        moveDirection *= speed * Time.deltaTime;
        characterController.Move(moveDirection);
         LockPlayerOnY();
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.tag == "Obstacle")
        {
            Debug.Log("Player collided with obstacle");
            Debug.Log(other.gameObject.name);
            Obstacle obstacle = other.GetComponent<Obstacle>();
            obstacle.Esplodi(transform.position);
        }
        if (other.gameObject.tag == "pickWord")
        {
            Debug.Log("Player collided with pickWord");
            TextMesh word = other.GetComponent<TextMesh>();
            Debug.Log("playerId: " + playerId);

            string wordText = word.text; // Store word.text as a string
            Debug.Log("wordText: " + wordText);
            gameManager.SendObtainedPacket(wordText, this.playerId);

            Destroy(other.gameObject);
        }
    }

     void LockPlayerOnY()
    {
        // Imposta la posizione Y del CharacterController al valore desiderato
        characterController.transform.position = new Vector3(
            characterController.transform.position.x,
            /* Imposta il tuo valore Y desiderato qui */ 0,
            characterController.transform.position.z
        );
    }
}
