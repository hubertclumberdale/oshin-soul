using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class pickWord : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        Invoke ("ChangeTag",1);
    }

    void ChangeTag()
    {
        gameObject.tag = "pickWord";
    }
}
