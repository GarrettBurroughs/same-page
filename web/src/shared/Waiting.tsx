import * as React from 'react';


interface WaitingProps {
    speed: number;
}

const Waiting: React.FunctionComponent<WaitingProps> = ({ speed }) => {
    const [dots, setDots] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setDots(dots + 1);
        }, speed);
        return () => {
            clearInterval(interval);
        }
    }, [dots]);
    return (
        <span style={{ display: 'inline-block' }}>
            {'...'.substring(0, dots % 3 + 1)}
        </span>
    )
}

export default Waiting;