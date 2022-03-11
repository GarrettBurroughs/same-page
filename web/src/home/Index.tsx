import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '../shared/Paper';

require('./Index.css');

interface IndexProps { }

const Index: React.FunctionComponent<IndexProps> = ({ }) => {
    const naviage = useNavigate();

    const handleStartClick: React.MouseEventHandler = (e) => {
        naviage('/game');
    }

    const handleFriendsClick: React.MouseEventHandler = (e) => {
        alert('Games with friends are not currently supported'); // TODO: Implement game with friends
    }
    return (
        <div>
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