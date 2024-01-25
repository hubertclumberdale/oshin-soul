using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerManager : MonoBehaviour
{
    public int ID = 0;
    public float speed = 5f; // Velocità del giocatore
    public Vector2 inputVector; // Input per il movimento

    public List<string> pickedWords = new List<string>();

    private CharacterController characterController;

    void Start()
    {
        characterController = GetComponent<CharacterController>();
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
        if(other.gameObject.tag == "Obstacle")
        {
            Obstacle obstacle = other.GetComponent<Obstacle>();
            obstacle.Esplodi(transform.position);
        }
        if(other.gameObject.tag == "pickWord")
        {
            TextMesh word = other.GetComponent<TextMesh>();
            pickedWords.Add( word.text); 
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
