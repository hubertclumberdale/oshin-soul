using UnityEngine;

[CreateAssetMenu(fileName = "NewStringArrayData", menuName = "ScriptableObjects/words", order = 1)]
public class Words : ScriptableObject
{
    public string[] allWords;

}