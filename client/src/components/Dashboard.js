import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';
import axios from 'axios';
import Context from '../Context';
import io from 'socket.io-client';

// Components
import UserProfilePreview from '../components/UserProfilePreview';
import ChatArea from '../components/ChatArea';

// Bootstrap & Images
import { Navbar, Nav, Row, Col, Badge } from 'react-bootstrap';
import styles from './Dashboard.module.css';
import '../App.css';
import Grey from '../grey.jpg';

const Dashboard = () => {
    const [socket] = useState(() => io(':8000'));
    const [chatUser, setChatUser] = useState(null);
    const [newMessage, setNewMessage] = useState(null);

    // Get from first load
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [otherUsers, setOtherUsers] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState({});

    // GET USERS & LOGGED IN USER
    useEffect(() => {
        axios.get('http://localhost:8000/api/users', { withCredentials: true })
            .then(res => {
                setLoggedInUser(res.data.loggedInUser);
                setOtherUsers(res.data.otherUsers);
                setGroupedMessages(res.data.groupedMessages);
            })
            .catch(err => navigate('/welcome'));
    }, []);

    useEffect(() => {
        socket.on('received-newMessage', data => {
            if (loggedInUser) {
                const newMessage = data.message;
                if (newMessage.senderID === loggedInUser._id || newMessage.receiverID === loggedInUser._id) {
                    setNewMessage(newMessage);
                }
            }
        });
    }, [loggedInUser]);

    useEffect(() => {
        if (newMessage) {
            const repUserID = (newMessage.senderID === loggedInUser._id) ? newMessage.receiverID : newMessage.senderID;
            const appendingMessage = (groupedMessages.hasOwnProperty(repUserID)) ? groupedMessages[repUserID].concat([newMessage]) : [newMessage];
            setGroupedMessages({ ...groupedMessages, [repUserID]: appendingMessage });
            setNewMessage(null);
        }
    }, [newMessage]);

    const logOut = () => {
        navigate('/');
        axios.get('http://localhost:8000/api/users/logout', { withCredentials: true })
            .then(res => { /* TODO: Do something with res */ })
            .catch(err => { /* TODO: Do something with err */ });
    }

    const getUserById = userID => otherUsers.filter(user => user._id === userID)[0];

    const displayTimeAgo = timestamp => {
        const date = new Date(timestamp);
        const moment = require('moment')(date);
        return moment.fromNow();
    }

    const ConversationsListDisplay = () => {
        return (
            <li>
                {Object.entries(groupedMessages).map((grouped, idx) => (
                    <ul onClick={() => setChatUser(getUserById(grouped[0]))} key={idx} className="btn text-left w-100 px-0 list-inline">
                        <li className="list-inline-item align-middle">
                            <img width="75" height="75" className="rounded-circle" src={Grey} alt="" /><br />
                        </li>
                        <li className="list-inline-item align-middle ml-2">
                            <h6 className="m-0 font-weight-bold">@{getUserById(grouped[0]).username}</h6>
                            <small className="m-0 text-secondary">
                                {(grouped[1][grouped[1].length - 1].senderID !== loggedInUser._id) ? `${getUserById(grouped[0]).firstName} sent you a message` : grouped[1][grouped[1].length - 1].message}
                            </small>
                        </li>
                        <li className="list-inline-item align-middle float-right text-right py-3">
                            <p className="m-0 text-secondary"><small>{displayTimeAgo(grouped[1][grouped[1].length - 1].createdAt)} ::</small></p>
                            <h5 className="m-0 text-secondary"><Badge variant="secondary">{grouped[1][grouped[1].length - 1].senderID === loggedInUser._id ? 'Sent!' : 'Received!'}</Badge></h5>
                        </li>
                    </ul>
                ))}
            </li>
        );
    }

    return (
        <div className={`${styles.dashboard}`}>
            <Navbar style={{ backgroundColor: 'white', zIndex: '5' }} className="px-5" expand="md">
                <h3 className="p-0 m-0 font-weight-bold">Chazzy.</h3>
                <Navbar.Toggle aria-controls="nav-collapse" />
                <Navbar.Collapse id="nav-collapse">
                    <Nav>
                        <h5 className="nav-link align-middle m-0 ml-3" href="#">{loggedInUser ? <Badge className="p-2" variant="dark">@{loggedInUser.username}</Badge> : <></>}</h5>
                    </Nav>
                    <Nav className="ml-auto m-0 p-0">
                        <Nav.Link onClick={logOut} href="#">Log Out.</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className={`${styles.rowHeight} container-fluid m-0 p-0 w-100`}>
                <Row className="h-100 w-100 p-0 m-0">
                    <Col style={{ backgroundColor: 'rgb(249, 249, 249)' }} className={`h-100 w-100 overflow-auto ${styles.left}`} md={5}>
                        <ul className="list-inline w-100 text-left pt-4 m-0" style={{ overflowX: 'scroll' }}>
                            <li className="ml-3 mb-3 font-weight-bold">Just Random...!</li>
                            {otherUsers.map(otherUser => (
                                <li key={otherUser._id} className="list-inline-item mx-2">
                                    <UserProfilePreview onClick={() => setChatUser(otherUser)} user={otherUser} />
                                </li>
                            ))}
                        </ul>
                        <ul className="list-inline w-100 px-3 py-4 m-0">
                            <li>
                                <h5 className="mx-auto mb-4">Hi {loggedInUser ? loggedInUser.firstName : ''}! You have ({Object.keys(groupedMessages).length}) conversations.</h5>
                            </li>
                            <li className="w-100 text-left">
                                <ul className="list-inline">
                                    {ConversationsListDisplay()}
                                </ul>
                            </li>
                        </ul>
                    </Col>
                    <Col style={{ backgroundColor: 'rgb(252, 252, 252)' }} className={`p-3 h-100 ${styles.right}`} md={7}>
                        <Context.Provider value={{ loggedInUser }}>
                            {chatUser ? <ChatArea userWhomAmChattingWith={chatUser} passedInMessages={groupedMessages[chatUser._id]} /> : <></>}
                        </Context.Provider>
                    </Col>
                </Row>
            </div>
        </div >
    )
}

export default Dashboard;