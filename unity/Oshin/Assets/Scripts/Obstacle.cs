using UnityEngine;

public class Obstacle : MonoBehaviour
{
    public string packName;
    public GameObject prefabText;

    private bool isExploded = false;

    void Start()
    {
        GameManager gameManager = FindObjectOfType<GameManager>();
        if (gameManager != null)
        {
            Debug.Log("Getting random pack")
            this.packName = gameManager.GetRandomPack();
        }
    }

    public void Esplodi(Vector3 plPos)
    {
        if(!isExploded)
        {
            Destroy(transform.GetChild(0).gameObject);
            
            GameObject textMeshInstance = Instantiate(prefabText, transform.position + new Vector3(0,Random.Range(1,5),0), Quaternion.identity);
            textMeshInstance.transform.parent = null;
            textMeshInstance.GetComponent<TextMesh>().text = this.packName;

            Rigidbody rb = textMeshInstance.GetComponent<Rigidbody>();
            Vector3 randomDirection = transform.position-plPos;
            rb.AddForce(randomDirection * Random.Range(0, 10), ForceMode.Impulse)
            Debug,Log("Exploded")
            isExploded = true;
        }
    }

   
}