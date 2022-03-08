import * as React from 'react';
import io, { Socket } from 'socket.io-client';

require('./SamePage.css');

interface SamePageProps {
}

interface Player {
    username: string,
    uuid: string;
}
type guessStatus = 'input' | 'waiting';

const SamePage: React.FunctionComponent<SamePageProps> = () => {
    const [socket, setSocket] = React.useState<Socket>();
    const [room, setRoom] = React.useState<string>();
    const [player, setPlayer] = React.useState<Player>();
    const [opponent, setOpponent] = React.useState<Player>();
    const [guessStatus, setGuessStatus] = React.useState<guessStatus>('input');
    const [yourWords, setYourWords] = React.useState<string[]>([]);
    const [theirWords, setTheirWords] = React.useState<string[]>([]);

    React.useEffect(() => {
        const newSocket = io(`http://${window.location.hostname}:3001`);
        setSocket(newSocket);
        return () => {
            newSocket.close();
        }
    }, [])

    React.useEffect(() => {

        socket?.on('uuid', uuid => {
            const playerSetup = {
                username: 'Test Player',
                uuid: uuid
            };
            setPlayer(playerSetup)
            socket.emit('join', playerSetup)
        });

        socket?.on('playerDisconnect', () => {
            setOpponent(undefined);
        })

        socket?.on('start', (players: Player[]) => {
            for (const roomPlayer of players) {
                if (roomPlayer.uuid !== player?.uuid) {
                    setOpponent(roomPlayer);
                }
            }
        })

        socket?.on('joinedRoom', (roomInfo) => {
            setRoom(roomInfo);
        });



        socket?.on('finalGuesses', (guesses) => {
            console.log(guesses);
            console.log(player);
            console.log(opponent);
            if (player && opponent) {
                const yourGuess = guesses[player.uuid].currentGuess;
                const opponentGuess = guesses[opponent.uuid].currentGuess;
                setYourWords([...yourWords, yourGuess]);
                setTheirWords([...theirWords, opponentGuess]);
            }


        })

        return () => {
            const listeners = ['uuid', 'playerDisconnect', 'start', 'joinedRoom', 'finalGuesses']
            listeners.forEach((listener) => socket?.off(listener));
        }
    }, [socket, player, opponent, yourWords, theirWords]);



    const inputRef = React.createRef<HTMLInputElement>();

    const handleSumbit: React.MouseEventHandler = (e: React.MouseEvent) => {
        socket?.emit('guess', inputRef.current!.value);
        inputRef.current!.value = '';
    }

    return (
        <div>
            <header><h1>Same Page</h1></header>
            {opponent ? <>
                See if you and <span>{opponent?.username}</span> can get on the same page
                {yourWords.length === 0 ?
                    <h2>Think of a word...</h2>
                    :
                    <div id="word-box">
                        <div>
                            <h3>Your Words:</h3>
                            {yourWords.map((word, idx) => <p key={idx}> {word}</p>)}
                        </div>
                        <div>
                            <h3>Their Words:</h3>
                            {theirWords.map((word, idx) => <p key={idx}> {word}</p>)}
                        </div>
                    </div>
                }

                <input ref={inputRef}></input>
                <button onClick={handleSumbit}>Go!</button>
            </>
                :
                <h3>Waiting for opponent</h3>
            }
        </div>
    )
}

export default SamePage;