using UnityEngine;

public class HeadAnimation : MonoBehaviour
{
    public AnimationClip animationClip;

    void Start()
    {
        // Get the Animation component attached to this GameObject
        Animation animationComponent = GetComponent<Animation>();

        // Make sure animationComponent is not null
        if (animationComponent == null)
        {
            Debug.LogError("Animation component is not found on this GameObject!");
            return;
        }

        // Make sure the animationClip is assigned
        if (animationClip == null)
        {
            Debug.LogError("Animation clip is not assigned!");
            return;
        }

        // Randomize the starting frame
        float randomTime = Random.Range(0f, animationClip.length);
        animationComponent.clip = animationClip;
        animationComponent[animationClip.name].time = randomTime;
        animationComponent.Play();
    }
}
