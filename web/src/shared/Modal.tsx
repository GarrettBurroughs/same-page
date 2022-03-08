import * as React from 'react';

require('./Modal.css');

interface ModalProps {
    width: number;
    height: number;
    children?: React.ReactNode;
}

const Modal: React.FunctionComponent<ModalProps> = ({ width, height, children }) => {
    return (<>
        <div id='blur'></div>
        <div id="modal" style={{
            width: width,
            height: height
        }}>
            {children}
        </div>
    </>);
}

export default Modal;