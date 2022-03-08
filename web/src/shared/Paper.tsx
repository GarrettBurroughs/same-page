import * as React from 'react';

require('./Paper.css');

interface PaperProps {
    title: React.ReactNode;
    children: React.ReactNode;
}

const Paper: React.FunctionComponent<PaperProps> = ({ title, children }) => {
    return (
        <div id='paper'>
            <header>
                {title}
            </header>
            <div id='content'>
                {children}
            </div>
        </div>
    );
}

export default Paper;