import React, { useEffect, useState } from 'react'
import './Style/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkAdmin } from '../utils/SetValues';

const Navbar = ({
    user,
    logout,
    alert
}) => {
    const [result, setResult] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            const adminCheck = await checkAdmin();
            setResult(adminCheck);
        };
        verifyAdmin();
    }, [nav]);
    const handleClick = () => {
        if (document.querySelector('.nav-right').style.left === '-100%') {
            document.querySelector('.nav-right').style.left = '0'
        } else {
            document.querySelector('.nav-right').style.left = '-100%'
        }
    }
    const handleLogout = () => {
        handleClick;
        logout("Succesfully Logged Out");
        nav('/');
    }
    const notify = () => toast(alert);
    useEffect(() => {
        if (alert) {
            notify();
        }
    }, [alert])
    return (
        <>
            <section className="nav-bar">
                <div className="nav-left">
                    <h1>TechBlog</h1>
                </div>
                <div className="nav-right">
                    <ul className="navlist">
                        <li className="listItems" onClick={handleClick}><Link to='/'>Home</Link></li>
                        <li className="listItems" onClick={handleClick}><Link to='/blogs'>Blog</Link></li>
                        <li className="listItems" onClick={handleClick}><Link to='/about'>About</Link></li>
                        <li className="listItems" onClick={handleClick}><Link to='/contact-us'>Contact Us</Link></li>
                        <li className="listItems" onClick={handleClick}><Link to='/terms-and-condition'>T&C</Link></li>
                    </ul>
                    {
                        !user ? (
                            <div className="btns">
                                <div className="btn l-btn" onClick={handleClick}><Link to='/user/login'>Login</Link></div>
                                <div className="btn r-btn" onClick={handleClick}><Link to='/user/register'>Register</Link></div>
                            </div>
                        ) : (
                            <div className="btns" onClick={handleClick}>
                                <Link to={`/${result?.success?`admin/${user.username}`:"user"}/profile`}><div className="profile-btn">
                                    <i className="fa-solid fa-user"></i>
                                    <p>Profile</p>
                                </div></Link>
                                <div className="profile-btn" onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                    <p>Logout</p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="bgr" onClick={handleClick}>
                    <div className="line l-1"></div>
                    <div className="line l-2"></div>
                    <div className="line l-3"></div>
                </div>
            </section>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition:Bounce
            />
        </>
    )
}

export default Navbar