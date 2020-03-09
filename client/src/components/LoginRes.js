import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';
import { Row, Col, Modal, Button } from 'react-bootstrap';

const LoginRes = () => {
    const [login, setLogin] = useState({ username: '', password: '' });
    const [register, setRegister] = useState({ firstName: '', lastName: '', username: '', password: '', confirmPassword: '' });
    // const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const handleClose = () => setShowErrors(false);
    const handleShow = () => setShowErrors(true);

    useEffect(() => {
        // Check if already logged in.
        axios.get('http://localhost:8000/api/users', { withCredentials: true })
            .then(res => {
                if (res.data.loggedInUser !== null) {
                    navigate('/');
                }
            })
            .catch(err => { /* TODO: Do something with errors */ });
    }, []);

    const handleLogin = event => {
        event.preventDefault();
        axios.post('http://localhost:8000/api/users/login', login, { withCredentials: true })
            .catch(err => console.log(err))
            .then(res => {
                const message = res.data.msg;
                if (message !== undefined && message.length > 0) {
                    if (message === 'success') {
                        navigate('/dashboard');
                    } else {
                        setErrors([message]);
                        handleShow();
                    }
                } else {
                    setErrors(['Oops! Something went wrong. Please try again! :)']);
                    handleShow();
                }
            })
    }

    const handleRegister = event => {
        event.preventDefault();
        axios.post('http://localhost:8000/api/users/register', register, { withCredentials: true })
            .catch(err => console.log(err))
            .then(res => {
                if ('msg' in res.data) {
                    if (res.data['msg'] === 'success') {
                        navigate('/dashboard');
                    }
                } else {
                    if (res.data.errors) {
                        let messages = Object.values(res.data.errors).map(val => val.message);
                        messages.push(res.data.name);
                        setErrors(messages);
                        handleShow();
                    }
                }
            })
    }

    // const profileImageOnSelect = event => {
    //     const file = event.target.files[0];
    //     if (file !== null) {
    //         setProfileImage(file);
    //     }
    // }

    const loginFieldOnChange = event => setLogin({ ...login, [event.target.name]: event.target.value });
    const registerFieldOnChange = event => setRegister({ ...register, [event.target.name]: event.target.value });

    return (
        <Row className="m-0 p-0">
            <Col className="p-5 heightFull align-items-center tracking-in-expand-fwd" md={4}>
                <div className="w-100 mb-5">
                    <h1 className="font-weight-bold display-3 m-0">Chazzy.</h1>
                    <p className="text-secondary">A timed messaging app.</p>
                    <form className="my-5" onSubmit={handleLogin}>
                        <input onChange={loginFieldOnChange} className="form-control bg-light p-4 border-0" name="username" placeholder="Username" type="text" required />
                        <input onChange={loginFieldOnChange} className="form-control mt-2 bg-light p-4 border-0" name="password" placeholder="Password" type="password" required />
                        <>
                            <button className="btn btn-dark mt-5 px-4 py-2" type="submit">Sign In</button>
                            <Modal show={showErrors} onHide={handleClose} className="no-border" centered>
                                <Modal.Header closeButton className="no-border">
                                    <Modal.Title className="font-weight-bold">Ooops! Something went wrong. :(</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="border-none">
                                    <ul className="list-inline text-danger">{errors.length > 0 ? errors.map((err, idx) => <li key={idx}>- {err}</li>) : <></>}</ul>
                                </Modal.Body>
                                <Modal.Footer className="no-border">
                                    <Button variant="light" onClick={handleClose}>Got It!</Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    </form>
                </div>
            </Col>
            <Col className="p-5 m-0 heightFull align-items-center tracking-in-contract" md={8}>
                <div className="w-100 mb-5 text-center">
                    <h1 className="font-weight-bold m-0">Let's get started!</h1>
                    <p className="text-secondary">Don't have an account? Sign Up.</p>
                    <form className="my-5" onSubmit={handleRegister}>
                        {/* <ul className="list-inline text-secondary my-3">
                            <li className="list-inline-item align-middle mx-3">
                                <img width="100" height="100" className="rounded-circle" accept="image/*" src={profileImage ? URL.createObjectURL(profileImage) : ''} alt="" />
                            </li>
                            <li className="list-inline-item align-middle mx-3">
                                <label>Select your profile image!</label><br />
                                <input onChange={profileImageOnSelect} className="border-none" type="file" required />
                            </li>
                        </ul> */}
                        <Row className="m-0 p-0">
                            <Col className="m-0 p-0 mr-1">
                                <input onChange={registerFieldOnChange} className="form-control bg-light m-0 p-4 border-0" name="firstName" placeholder="First Name" type="text" required />
                            </Col>
                            <Col className="m-0 p-0 ml-1">
                                <input onChange={registerFieldOnChange} className="form-control bg-light m-0 p-4 border-0" name="lastName" placeholder="Last Name" type="text" required />
                            </Col>
                        </Row>
                        <input onChange={registerFieldOnChange} className="form-control bg-light my-2 p-4 border-0" name="username" placeholder="Username" type="text" required />
                        <input onChange={registerFieldOnChange} className="form-control bg-light mt-2 p-4 border-0" name="password" placeholder="Password" type="password" required />
                        <input onChange={registerFieldOnChange} className="form-control bg-light mt-2 p-4 border-0" name="confirmPassword" placeholder="Confirm Password" type="password" required />
                        <>
                            <button className="btn btn-secondary mt-5 px-4 py-2" type="submit">Sign Up</button>
                            <Modal show={showErrors} onHide={handleClose} className="no-border" centered>
                                <Modal.Header closeButton className="no-border">
                                    <Modal.Title className="font-weight-bold">Ooops! Something went wrong. :(</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="border-none">
                                    <ul className="list-inline text-danger">{errors.map((err, idx) => <li key={idx}>- {err}</li>)}</ul>
                                </Modal.Body>
                                <Modal.Footer className="no-border">
                                    <Button variant="light" onClick={handleClose}>Got It!</Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    </form>
                </div>
            </Col>
            <p className="copyright-label m-0 text-secondary">&#9400;QuangNguyen 2020 - <a href="/" className="text-secondary">View Repo!</a></p>
        </Row >
    );
}

export default LoginRes;