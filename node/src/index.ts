/* 
FEATURES: TO IMPLEMENT
Server
Game Management

Create the game
Instantiate the WebSocket and save the Unity reference
Add players to the game
Listen for phone connections and save them in a list
Start the game
Notify everyone (Unity and players) that the game has started
Incomplete Sentence
Notify everyone of the incomplete sentence
Turns
Keep track of turns. Start a new turn until the game is over
Mode
Keep track of the current mode (lobby, movement, compose, vote, win, end)
Time
Notify when the movement mode starts and ends
Winner
Keep track of the score for each player. When the game ends, the player with the highest score wins
Start a second round
Notify that a new round has started
End the game
Notify the winner
Player Management
Player movement using x, y
Player submission
*/
import WebSocket from 'ws';
import { Room, SocketEvent, SocketMessage } from '../types';
import { onComposePhaseTimerFinished, onCreateRoom, onJoinRoom, onMovementPhaseTimerFinished, onNewGame, onPlayerChoice, onPlayerDisconnected, onPlayerMovement, onPlayerPickUp, onPlayerReady, onPlayerReadyForNextRound, onVotePhaseTimerFinished, onVoteSubmitted } from './events';
const wss = new WebSocket.Server({ port: 7002 });

const rooms: Room[] = [];


wss.on('connection', (ws: WebSocket) => {
    console.log('A user connected');

    ws.on('message', (message: string) => {
        const { event, data } = JSON.parse(message) as SocketMessage;
        console.log('Received event:', event, 'with data:', data);

        switch (event) {
            case SocketEvent.CreateRoom: {

                onCreateRoom({
                    ws,
                    wss,
                    rooms
                })
                break;
            }

            case SocketEvent.JoinRoom: {
                onJoinRoom({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.PlayerReady: {
                onPlayerReady({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.PlayerMovement: {
                onPlayerMovement({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.MovementPhaseTimerFinished: {
                onMovementPhaseTimerFinished({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.PlayerPickUp: {
                onPlayerPickUp({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.PlayerChoice: {
                onPlayerChoice({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.ComposePhaseTimerFinished: {
                onComposePhaseTimerFinished({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }
            case SocketEvent.VoteSubmitted: {
                onVoteSubmitted({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.VotePhaseTimerFinished: {
                onVotePhaseTimerFinished({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.ReadyForNextRound: {
                onPlayerReadyForNextRound({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }

            case SocketEvent.NewGame: {
                onNewGame({
                    ws,
                    wss,
                    rooms,
                    data
                })
                break;
            }


            default:
                console.log('Unknown event:', event);
                break;
        }
    });

    ws.on('close', () => {
        onPlayerDisconnected({
            ws,
            wss,
            rooms
        })
    });
});



wss.on('listening', () => {
    console.log('Node server started on on 7002')
})
