import React, { useEffect, useState } from 'react';
import './Style/Register.css';
import { setUser } from '../../utils/SetValues';
import { useNavigate } from 'react-router-dom';


const Register = ({
  onRegister,
  user,
  showAlert
}) => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isMismatched, setIsMismatched] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const [otp, setOtp] = useState('');
  const [mailSent, setMailSent] = useState(false);
  useEffect(() => {
    document.title = 'Register User | TechBlog'
  }, [])
  useEffect(() => {
    if (user) {
      nav('/admin/dashboard');
    }
  }, [user])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    setMailSent(true);
    e.preventDefault();
    if (formData.confirmPassword !== formData.password) {
      setIsMismatched(true);
      setShow(true);
      setTimeout(() => setIsMismatched(false), 2000);
      setFormData({
        ...formData,
        confirmPassword: '',
        password: ''
      });
    } else {
      const { confirmPassword, ...others } = formData
      const res = await fetch('/api/admin/register', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(others)
      })
      const resData = await res.json();
      if (res.ok) {
        setMailSent(false);
        document.querySelector('.reg-pop-up').style.display = 'flex';
        // setUser(resData.user, resData.token);
        setId(resData.user._id);
        onRegister(resData.message);
      } else {
        onRegister(resData.message);
      }
    }
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/verify-otp/${id}/${otp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const resData = await res.json();
    if (res.ok) {
      document.querySelector('.reg-pop-up').style.display = 'none';
      setUser(resData.user, resData.token);
      onRegister(resData.message);
    } else {
      document.querySelector('.showOtpError').style.display = 'block';
      showAlert(resData.message);
    }
  }
  const handleOtpChange = async (e) => {
    setOtp(e.target.value);
  }
  return (
    <div className="full-admin-register">
      <div className="fur-card">
        <h1>Register</h1>
        <div className="r-content">
          <div className="fur-left">
            <h3>Lorem ipsum dolor sit</h3>
            <ul className='furl-list'>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, maxime quibusdam aut vel iure quasi error perferendis!</li>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, maxime quibusdam aut vel iure quasi error perferendis!</li>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, maxime quibusdam aut vel iure quasi error perferendis!</li>
              <ol className='furl-sublist'>
                <li>Lorem, ipsum dolor.</li>
                <li>Lorem ipsum dolor sit, amet consectetur adipisicing.</li>
                <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, amet?</li>
              </ol>
            </ul>
            <h3>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio, vel modi. Dolorum fugit voluptates nulla ipsa delectus, dignissimos corrupti magni incidunt quia perferendis architecto nam! Temporibus repellendus eum natus? Iusto magni esse aut et consequatur similique deleniti sed reiciendis itaque!</p>
          </div>
          <div className="fur-right">
            <form onSubmit={handleSubmit} >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={isMismatched ? 'w-pass shake' : ''}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={isMismatched ? 'w-pass shake' : ''}
              />
              {show && <p className="p-alert">Password Mis-Matched</p>}
              <input type="submit" value="Register" />
            </form>
          </div>
        </div>
      </div>

      <div className="reg-pop-up">
        <div className="rpu-card">
          <div className="rpu-close"><i className="fa-solid fa-circle-xmark"></i></div>
          <h2>Enter OTP here:</h2>
          <form onSubmit={handleOtpSubmit}>
            <input type="text" value={otp} onChange={handleOtpChange} id='otp' placeholder='Enter Your OTP' />
            <p className='showOtpError'>Wroung OTP</p>
            <input type="submit" value="Submit OTP" />
          </form>
        </div>
      </div>
      <div className="sending-mail" style={{ display: mailSent ? "flex" : "none" }}>
        <div className="sm-loading">
          <div className="sm-loader"></div>
          <h2>Sending Mail...</h2>
        </div>
      </div>
    </div>
  );
};

export default Register;
