import WebSocket from 'ws'
import { Color, Direction, Phase, Player, Room, SocketBroadcast, SocketMessage, Votes } from "../types";
import { questions } from "../config/questions";
import { packs } from '../config/packs';
import { maxNumberOfWordsPickedUpPerPack } from '../config/game';

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
        incompleteSentence: '',
        currentMode: Phase.Lobby,
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
    const player: Player = { id: generateId(), score: 0, ready: false, color: randomColor, words: [], voted: false };
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
    const message: SocketMessage = { command: SocketBroadcast.PlayerMovement, data: { roomId: roomId, playerId: playerId, direction } }
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
    console.log("obtained pack", obtainedPack)
    const words = getWordsFromPack({ obtainedPack });
    console.log("words", words);
    const uniqueWords = [...new Set([...player.words, ...words])];
    console.log("unique words", uniqueWords);
    player.words = uniqueWords;
    shuffleArray(player.words);
}

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const getWordsFromPack = ({ obtainedPack }: { obtainedPack: string }) => {
    const pack = packs.find((pack) =>
        pack.type === obtainedPack);
    if (pack) {
        const randomNouns = getRandomUniqueWords({ words: pack.nouns });
        console.log("random nouns", randomNouns)
        const randomVerbs = getRandomUniqueWords({ words: pack.verbs });
        console.log("random verbs", randomVerbs)
        return [...randomNouns, ...randomVerbs];
    }
}

const getRandomUniqueWords = ({ words }: { words: string[] }) => {
    const randomWords: string[] = [];

    const getRandomWord = () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        if (!randomWords.includes(randomWord)) {
            randomWords.push(randomWord);
        }
    };

    for (let i = 0; i < maxNumberOfWordsPickedUpPerPack; i++) {
        getRandomWord();
    }

    return randomWords;
}

export const assignVotesToChoices = ({ room, votes }: { room: Room, votes: Votes }) => {
    Object.entries(votes).forEach(([playerId, vote]) => {
        const choice = room.choices.find((choice) => choice.playerId === playerId);
        if (choice) {
            choice.score += vote;
        }
    });
}


export const cleanRoom = ({ room }: { room: Room }) => {
    room.incompleteSentence = '';
    room.winner = null;
    room.choices = [];
    room.players.forEach((player) => {
        player.words = [];
        player.voted = false;
    });
}

export const closeRoom = (
    {
        room,
        rooms,
        wss
    }: {
        room: Room,
        rooms: Room[],
        wss: WebSocket.Server
    }
) => {
    const index = rooms.indexOf(room);
    if (index !== -1) {
        rooms.splice(index, 1);
    }
    wss.clients.forEach((client) => {
        client.close();
    });
}