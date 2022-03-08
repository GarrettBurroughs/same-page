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
            }, i * 100);
            setTimeout(() => {
                if (i === text.length) {
                    doneWriting!();
                }
            }, (text.length) * 100 + 500)
        }
    }, [text])
    return (
        <p style={{ color: color }}>{displayedText}</p>
    )
}

export default Typewriter;