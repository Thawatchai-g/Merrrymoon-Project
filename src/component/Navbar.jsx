import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext'
import { FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
    const { logOut } = useUserAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className="navbar bg-base-100 px-10" style={{ backgroundColor: '#F8F8F8' }}>
            <div className="flex-1">
                <h1>Merry Moon</h1>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <button onClick={handleLogout} className="btn btn-ghost">ออกจากระบบ <FaSignOutAlt size={19} /></button>
                </ul>
            </div>
        </div>
    );
}
