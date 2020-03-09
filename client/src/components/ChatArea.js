import React, { useContext, useState, useEffect, useRef } from 'react';
import Context from '../Context';
import io from 'socket.io-client';
import axios from 'axios';
import UserProfilePreview from './UserProfilePreview';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

const ChatArea = ({ userWhomAmChattingWith, passedInMessages }) => {
    // useContext
    const { loggedInUser } = useContext(Context);
    // useState
    const [socket] = useState(() => io(':8000'));
    const [messageText, setMessageText] = useState('');
    // useRef
    const messageInputRef = useRef();

    // useEffect
    useEffect(() => {
        // document.body.scrollTop(100);
    }, []);

    const formOnSubmit = event => {
        event.preventDefault();
        const newMessage = { message: messageText, senderID: loggedInUser._id, receiverID: userWhomAmChattingWith._id };
        axios.post('http://localhost:8000/api/messages/send', newMessage, { withCredentials: true })
            .then(res => {
                messageInputRef.current.value = '';
                socket.emit('new-message', res.data);
            })
            .catch(err => { /* TODO: Do something with err */ });
    }

    const isMyMessage = message => message.senderID === loggedInUser._id;

    return (
        <>
            <ul className="list-inline text-center mx-1 pb-2">
                <li style={{ borderRadius: '16px' }} className="bg-light mb-3 py-3 bo">
                    <UserProfilePreview user={userWhomAmChattingWith} showDetails={1} />
                </li>
                {passedInMessages ? passedInMessages.map(message => (
                    <li key={message._id} className={isMyMessage(message) ? 'text-right' : 'text-left'}>
                        <p className="mx-2">
                            {isMyMessage(message) ? message.message : <></>}
                            <span className={`p-2 rounded ${isMyMessage(message) ? 'ml-2 bg-secondary text-light' : 'mr-2 bg-light'}`}>@{isMyMessage(message) ? 'me' : userWhomAmChattingWith.username}</span>
                            {isMyMessage(message) ? <></> : message.message}
                        </p>
                    </li>
                )) : <></>}
            </ul>
            <div className="sticky">
                <form className="w-75 mx-auto" onSubmit={formOnSubmit}>
                    <InputGroup>
                        <FormControl ref={messageInputRef} onChange={event => setMessageText(event.target.value)} type="text" className="form-control bg-light p-4 border-0" placeholder="Enter your message here..." />
                        <InputGroup.Append>
                            {messageText.length > 0 ? <Button variant="dark" type="submit" className="px-5" value="Send">Send</Button> : <Button variant="dark" type="submit" className="px-5" value="Send" disabled>Send</Button>}
                            {messageText.length > 0 ? <Button variant="success" className="px-5">Now</Button> : <Button variant="success" className="px-5" disabled>Now</Button>}
                        </InputGroup.Append>
                    </InputGroup>
                </form>
            </div>
        </>
    );
}

export default ChatArea;