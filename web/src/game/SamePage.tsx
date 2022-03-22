import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [won, setWon] = React.useState(false);
    const navigate = useNavigate();

    const { id } = useParams();

    React.useEffect(() => {
        const newSocket = io(`http://${window.location.hostname}:3001`);
        setSocket(newSocket);
        return () => {
            newSocket.close();
        }
    }, []);

    React.useEffect(() => {
        socket?.on('init', () => {
            socket.emit('getUUID');
        });

        socket?.on('uuid', uuid => {
            const playerSetup = {
                username: 'Test Player',
                uuid: uuid
            };
            setPlayer(playerSetup);
            console.log(id);
            socket.emit('join', { player: playerSetup, roomCode: id });
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
        });

        socket?.on('roomerror', (msg) => {
            alert(msg);
        });

        return () => {
            const listeners = ['init', 'uuid', 'playerDisconnect', 'start', 'joinedRoom', 'finalGuesses', 'error', ]
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
            {id ? <p>Room Code: {id}</p> : <></>}
            {won ?
                <Modal width={300} height={200}>
                    <h1>You won!</h1>
                    <p>both you and your opponent were on the same page about <span id='final-guess'>{yourWords[yourWords.length - 1]} </span></p>
                    <button onClick={() => {
                        setWon(false);
                        window.location.reload();
                    }}> Play Again! </button>

                    <br />
                    <br />
                    <button onClick={() => {navigate('/')}}>Home</button>

                </Modal>
                :
                <></>
            }

            {opponent ? <>
                <Paper title={<h1>Same Page</h1>}>
                    {yourWords.length === 0 ? <>
                        <h2 id="first-guess">Think of a word...</h2>
                    </>
                        :
                        <div id="word-box">
                            <div>
                                <h2>Your Words:</h2>
                                {yourWords.map((word, idx) => <Typewriter
                                    text={word}
                                    key={idx}
                                    color={yourWords[idx] === theirWords[idx] ? 'green' : undefined}

                                />)}
                            </div>
                            <div>
                                <h2>Their Words:</h2>
                                {theirWords.map((word, idx) => <Typewriter
                                    text={word}
                                    key={idx}
                                    color={yourWords[idx] === theirWords[idx] ? 'green' : undefined}
                                    doneWriting={() => {
                                        console.log('done writing');
                                        console.log(yourWords[idx], theirWords)
                                        setWon(yourWords[idx] === theirWords[idx]);
                                    }}
                                />)}
                            </div>
                        </div>
                    }
                    {
                        canGuess ? <>
                            <div>
                                <input ref={inputRef}></input>
                                <button onClick={handleSumbit}>Go!</button>
                            </div>
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
                <Paper title={<h1>Same Page</h1>}> <h3> Waiting for Opponent <Waiting speed={500} /> </h3> </Paper>

            }
        </div>
    )
}

export default SamePage;