using UnityEngine;

public class Obstacle : MonoBehaviour
{
    public Words obstacleNames;
    public GameObject prefabText;

    private bool isExploded = false;

    public void Esplodi(Vector3 plPos)
    {
        if(!isExploded)
        {
            Destroy(transform.GetChild(0).gameObject);
            for (int i = 0; i < obstacleNames.allWords.Length; i++)
            {
                GameObject textMeshInstance = Instantiate(prefabText, transform.position + new Vector3(0,Random.Range(1,5),0), Quaternion.identity);
                textMeshInstance.transform.parent = null;
                textMeshInstance.GetComponent<TextMesh>().text = obstacleNames.allWords[i];

                Rigidbody rb = textMeshInstance.GetComponent<Rigidbody>();
                Vector3 randomDirection = transform.position-plPos;
                rb.AddForce(randomDirection * Random.Range(0, 10), ForceMode.Impulse);
                isExploded = true;
            }
        }
    }

   
}