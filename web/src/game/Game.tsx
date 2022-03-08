import * as React from 'react';
import SamePage from './SamePage';

require('./Game.css');

interface GameProps { }

const Game: React.FunctionComponent<GameProps> = ({ }) => {
    return (
        <SamePage></SamePage>
    )
}

export default Game;