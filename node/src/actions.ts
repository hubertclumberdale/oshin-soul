import WebSocket from 'ws'
import { Color, Direction, Phase, Player, Room, SocketBroadcast, SocketMessage } from "../types";
import { questions } from "../config/questions";

function generateId(): string {
    return `${Math.floor(Math.random() * 1000)}`
}

function getRandomColor(room: Room): Color {
    const colors = Object.values(Color);
    const pickedColors = room.players.map((player) => player.color);
    const availableColors = colors.filter((color) => !pickedColors.includes(color));
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
}

export const createRoom = (
    {
        ws,
        rooms
    }: {
        ws: WebSocket,
        rooms: Room[]
    }
) => {
    console.log('CreateRoom event triggered in room:', ws.id);
    // Create a new room
    const roomId = generateId();
    const room: Room = {
        id: roomId,
        players: [],
        unity: ws.id,
        gameStarted: false,
        incompleteSentence: '',
        turns: 0,
        currentMode: Phase.Lobby,
        playersAreMoving: false,
        winner: null,
        roundNumber: 0,
        choices: []
    };
    rooms.push(room);
    return room
}

export const addNewPlayer = ({
    room
}: {
    room: Room
}) => {
    const randomColor = getRandomColor(room);
    const player: Player = { id: generateId(), score: 0, ready: false, color: randomColor, words: [] };
    room.players.push(player);
    return player
}

export const movePlayer = ({
    roomId,
    playerId,
    direction,
    wss
}: {
    roomId: string,
    playerId: string,
    direction: Direction,
    wss: WebSocket.Server
}) => {
    const message: SocketMessage = { event: SocketBroadcast.PlayerMovement, data: { roomId: roomId, playerId: playerId, direction } }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
export const chooseSentence = ({
    room
}: {
    room: Room
}) => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const sentence = questions[randomIndex]
    room.incompleteSentence = sentence
    return sentence
}

export const addWordsToPlayer = ({ obtainedPack, player }: { obtainedPack: string, player: Player }) => {
    const words = getWordsFromPack({ obtainedPack })
    player.words.push(...words);
}

const getWordsFromPack = ({ obtainedPack }: { obtainedPack: string }) => {
    const pack = packs.find((pack) =>
        pack.type === obtainedPack);
    if (pack) {
        const randomNouns = getRandomWords({ words: pack.nouns });
        const randomVerbs = getRandomWords({ words: pack.verbs });
        return [...randomNouns, ...randomVerbs];
    }
}

const getRandomWords = ({ words }: { words: string[] }) => {
    const randomWords: string[] = [];
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        randomWords.push(randomWord);
    }
    return randomWords;
}