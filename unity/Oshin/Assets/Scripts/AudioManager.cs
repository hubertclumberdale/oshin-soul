using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AudioManager : MonoBehaviour
{

    public AudioClip intro;
    public AudioClip playing;

    private AudioSource audioSource;

    public AudioClip movementAudioClip;
    public AudioClip collideAudioClip;
    public AudioClip powerupAudioClip;
    public AudioClip endtimerAudioClip


    public float volume = 1;

    void Start(){
        audioSource = gameObject.GetComponent<AudioSource>();
        PlaySound(intro);
    }

    private static AudioClip GetRandomAudioClip(AudioClip[] audioClips)
    {
        return audioClips[(int)(Random.Range(0f, 10.0f) % audioClips.Length)];
    } 

    public void StartGame(){
        audioSource.Stop();
        PlaySound(playing);
    }

    public void PlayPlaying(){
        audioSource.Stop();
        PlaySound(playing);
    }

    public void PlayMovement(){
        PlaySound(movementAudioClip);
    }

    public void PlayCollide(){
        PlaySound(collideAudioClip);
    }

    public void PlayPowerup(){
        PlaySound(powerupAudioClip);
    }

    public void PlayEndTimer(){
        PlaySound(endtimerAudioClip);
    }


    private void PlaySound(AudioClip audioClip){
        audioSource.PlayOneShot(audioClip, volume);
    }
}