import React from 'react';
import Grey from '../grey.jpg';
import { Badge } from 'react-bootstrap';

const UserProfilePreview = ({ user, onClick, showDetails }) => {
    return (
        <ul className="list-inline m-0 p-0">
            {showDetails ? <></> : <>
                <li className="list-inline-item align-middle m-0 p-0">
                    <button style={{ background: 'none', border: '0px solid white', outlineStyle: 'none' }} onClick={onClick}>
                        <img width="87.5" height="87.5" className="rounded-circle" src={Grey} alt="" /><br />
                        <p className="mt-2">@{user ? user.username : 'username'}</p>
                    </button>
                </li>
            </>}
            <li className="list-inline-item align-middle m-0 p-0">
                {showDetails ? <>
                    <img width="100" height="100" className="rounded-circle d-inline-block align-middle" src={Grey} alt="" />
                    <div className="px-3 text-left d-inline-block align-middle">
                        <h4 className="mb-2 font-weight-bold">{user.firstName + ' ' + user.lastName}</h4>
                        <h5 className="m-0"><Badge variant="secondary">@{user.username}</Badge></h5>
                    </div>
                </> : <></>}
            </li>
        </ul>
    );
}

export default UserProfilePreview;