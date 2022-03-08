import * as React from 'react';
import io, { Socket } from 'socket.io-client';
import Modal from '../shared/Modal';
import Paper from '../shared/Paper';
import Typewriter from '../shared/Typewriter';
import Waiting from '../shared/Waiting';

require('./SamePage.css');

interface SamePageProps {
}

interface Player {
    username: string,
    uuid: string;
}

const SamePage: React.FunctionComponent<SamePageProps> = () => {
    const [socket, setSocket] = React.useState<Socket>();
    const [room, setRoom] = React.useState<string>();
    const [player, setPlayer] = React.useState<Player>();
    const [opponent, setOpponent] = React.useState<Player>();
    const [canGuess, setCanGuess] = React.useState(true);
    const [yourWords, setYourWords] = React.useState<string[]>([]);
    const [theirWords, setTheirWords] = React.useState<string[]>([]);
    const [guess, setGuess] = React.useState('');
    const [won, setWon] = React.useState(true);

    React.useEffect(() => {
        const newSocket = io(`http://${window.location.hostname}:3001`);
        setSocket(newSocket);
        return () => {
            newSocket.close();
        }
    }, []);

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
            setYourWords([]);
            setTheirWords([]);
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
            if (player && opponent) {
                const yourGuess = guesses[player.uuid].currentGuess;
                const opponentGuess = guesses[opponent.uuid].currentGuess;
                setYourWords([...yourWords, yourGuess]);
                setTheirWords([...theirWords, opponentGuess]);
                setCanGuess(true);
            }
        })

        return () => {
            const listeners = ['uuid', 'playerDisconnect', 'start', 'joinedRoom', 'finalGuesses']
            listeners.forEach((listener) => socket?.off(listener));
        }
    }, [socket, player, opponent, yourWords, theirWords]);



    const inputRef = React.createRef<HTMLInputElement>();

    const handleSumbit: React.MouseEventHandler = (e: React.MouseEvent) => {
        const userGuess = inputRef.current!.value.toLowerCase().trim();
        socket?.emit('guess', userGuess);
        setGuess(userGuess);
        inputRef.current!.value = '';
        setCanGuess(false);
    }



    return (
        <div>
            {won ?
                <Modal width={300} height={200}>
                    <h1>You won!</h1>
                    <p>both you and your opponent were on the same page about <span id='final-guess'>{yourWords[yourWords.length - 1]} </span></p>
                    <button onClick={() => {
                        setWon(false);
                    }}> Play Again! </button>

                </Modal>
                :
                <></>
            }
            {/* <header><h1>Same Page</h1></header> */}

            {opponent ? <>
                {/* See if you and <span>{opponent?.username}</span> can get on the same page */}
                <Paper title={<h1>Same Page</h1>}>
                    {yourWords.length === 0 ?
                        <h2>Think of a word...</h2>
                        :
                        <div id="word-box">
                            <div>
                                <h2>Your Words:</h2>
                                {yourWords.map((word, idx) => <Typewriter
                                    text={word}
                                    key={idx}
                                    color={yourWords[idx] === theirWords[idx] ? 'green' : undefined}
                                    doneWriting={() => {
                                        setWon(yourWords[idx] === theirWords[idx]);
                                    }}
                                />)}
                            </div>
                            <div>
                                <h2>Their Words:</h2>
                                {theirWords.map((word, idx) => <Typewriter
                                    text={word}
                                    key={idx}
                                    color={yourWords[idx] === theirWords[idx] ? 'green' : undefined}
                                />)}
                            </div>
                        </div>
                    }
                    {
                        canGuess ? <>
                            <input ref={inputRef}></input>
                            <button onClick={handleSumbit}>Go!</button>
                        </>
                            :
                            <>
                                <div id="guess">
                                    You guessed <span>{guess}</span>
                                </div>
                                Waiting for partner <Waiting speed={500} />
                            </>
                    }
                </Paper>

            </>
                :
                <h3>Finding opponent <Waiting speed={500} /></h3>
            }
        </div>
    )
}

export default SamePage;