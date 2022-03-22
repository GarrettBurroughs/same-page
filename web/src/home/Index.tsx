import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../shared/Modal';
import Paper from '../shared/Paper';

require('./Index.css');

interface IndexProps { }

const Index: React.FunctionComponent<IndexProps> = ({ }) => {
    const [showModal, setShowModal] = React.useState(false);
    const [createGame, setCreateGame] = React.useState(false);
    const [roomCode, setRoomCode] = React.useState('');
    const [enteredRoomCode, setEnteredRoomCode] = React.useState('');

    const navigate = useNavigate();

    React.useEffect(() => {
        fetch(`http://${window.location.hostname}:3001/genRoomCode`).then(res => res.json()).then(data => setRoomCode(data.roomCode));
    }, [createGame]);

    const handleStartClick: React.MouseEventHandler = (e) => { navigate('/game'); }

    const handleFriendsClick: React.MouseEventHandler = async (e) => { setShowModal(true); }

    const handleStartGame: React.MouseEventHandler = (e) => { navigate(`/game/${roomCode}`); }

    const handleCreateGame: React.MouseEventHandler = (e) => { setCreateGame(true); }

    const closeModal: React.MouseEventHandler = async (e) => { setShowModal(false); }

    const handleJoinGame: React.MouseEventHandler = (e) => { navigate(`/game/${enteredRoomCode}`); }
    


    return (
        <div>
            {showModal ? <Modal width={400} height={300}>
                {
                    createGame && roomCode !== '' ? <>
                        <h2>Room Code: {roomCode}</h2>
                        Send this code to your friend, or have them to to this url: <br />
                        <a href={`http://${window.location.hostname}:3000/game/${roomCode}`}>{`http://${window.location.hostname}:3000/game/${roomCode}`}</a>
                        <br />
                        <br />
                        <button onClick={handleStartGame}>Start!</button>
                    </> : <>
                            <h2>Games With Friends</h2>
                            <button onClick={handleCreateGame}> Create Game </button>
                            <br />
                            or
                            <br />
                            Enter room code:
                            <br />
                            <input onChange={(e) => {setEnteredRoomCode(e.target.value)}} />
                            <br />
                            <button onClick={handleJoinGame}>Join Game</button>
                            <br />
                            <br />
                            <br />
                            <br />
                            <button onClick={closeModal}>close</button>
                    </>
                }
            </Modal> : <></>}
            <h1>
                Same Page
            </h1>

            <Paper title={<h2>Can you and your partner get on the Same Page?</h2>}>
                <p><br /></p>
                <p>Welcome to same page, a game where you and your partner repeatedly guess words until you both guess the same word at the same time! </p>
                <p><br /></p>
                <button id="start" onClick={handleStartClick}>Play Game!</button>
                <p>or</p> 
                <button id="start" onClick={handleFriendsClick}>Play with a friend!</button>

                <p><br /></p>

                <h3>How to play:</h3>
                <ol>
                    <li>Your first guess is completely up to you! Be creative with it!</li>
                    <li>Each subsqeuent guess should be related to the previous two guesses so that both player are thinking on the same page.</li>
                    <li><span style={{fontWeight:"bold"}}>Try and win!</span> Same Word is a cooporative game, try your best to win so the game can be enjoyable for everyone.</li>
                </ol>
                <p><br /></p>

                <h3>Exaple Game: </h3> 
                <div id="word-box">
                    <div>
                        <h3>Your Words</h3>
                        <p>Sauce</p>
                        <p>Pasta</p>
                        <p style={{color: "green"}}>Italian Food</p>
                    </div>
                    <div>
                        <h3>Their Words</h3>
                        <p>Dough</p>
                        <p>Pizza</p>
                        <p style={{color: "green"}}>Italian Food</p>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default Index;