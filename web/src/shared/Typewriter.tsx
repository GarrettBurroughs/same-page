import * as React from 'react';

interface TypewriterProps {
    text: string;
    color?: string;
    doneWriting?: () => void
}

const Typewriter: React.FunctionComponent<TypewriterProps> = ({ text, color, doneWriting }) => {
    const [displayedText, setDisplayedText] = React.useState('');
    React.useEffect(() => {
        for (let i = 0; i <= text.length; i++) {
            setTimeout(() => {
                setDisplayedText(text.substring(0, i));
                if (i === text.length) {
                    doneWriting!();
                }
            }, i * 100);
        }
    }, [text])
    return (
        <p style={{ color: color }}>{displayedText}</p>
    )
}

export default Typewriter;