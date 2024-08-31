import React, { useEffect, useState } from 'react';
import './Style/Login.css';
import { setUser } from '../../utils/SetValues';
import { useNavigate } from 'react-router-dom';

const Login = ({
  onLogin,
  user
}) => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const res = await fetch('/api/user/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const resData = await res.json();
      if(resData.success){
        setUser(resData.user, resData.token);
        onLogin(resData.message);
      } else{
        onLogin(resData.message);
      }
  };
  useEffect(() => {
    document.title = 'User Login | TechBlog'
    if(user){
      nav('/');
    }
  },[user])
  return (
    <div className="full-user-login">
      <div className="user-login-card">
        <h1>Login</h1>
        <div className="login-content">
          <div className="login-left">
            <h3>Welcome Back</h3>
            <p>Please enter your username/email and password to log in.</p>
          </div>
          <div className="login-right">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="id"
                placeholder="Username or Email"
                value={formData.id}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {show && <p className="p-alert">Please enter a valid password</p>}
              <input type="submit" value="Login" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
