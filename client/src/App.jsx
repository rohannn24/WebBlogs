import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Page/Home'
import About from './Page/About'
import Contact from './Page/Contact'
import Blog from './Page/Blog'
import Register from './Page/Admin/Register'
import Login from './Page/Admin/Login'
import UserLogin from './Page/User/Login'
import UserRegister from './Page/User/Register'
import Profile from './Page/Profile'
import Dashboard from './Page/Admin/Dashboard'
import ManageBlog from './Page/Admin/ManageBlog'
import ManageCategories from './Page/Admin/ManageCategories'
import AddBlog from './Page/Admin/AddBlog'
import AdminProfile from './Page/Admin/Profile'
import TermsCondition from './Page/TermsCondition'
import ContactForm from './Page/Admin/ContactForm'
import { getUser, userLogout } from './utils/SetValues'
import ErrorPage from './Page/ErrorPage'
import PostPage from './Page/PostPage'
import CatBlog from './Page/CatBlog'
import HomeManager from './Page/Admin/HomeManager'
import UpdateBlog from './Components/UpdateBlog'


const App = () => {
  const [alert, setAlert] = useState(null);
  const [user, setUser] = useState(() => {
    const lUser = localStorage.getItem('user');
    return lUser ? JSON.parse(lUser) : null;
  })
  const handleNewUser = (message) => {
    const newUser = getUser();
    setUser(newUser);
    setAlert(message);
    setTimeout(() => {
      setAlert(null);
    }, 2100);
  }
  const handleLogout = (message) => {
    userLogout();
    setUser(null);
    setAlert(message);
  }
  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert(null);
    }, 2100);
  }
  return (
    <>
      <Navbar user={user} alert={alert} logout={handleLogout} />
      <div className="main-body">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blog showAlert={showAlert}/>} />
          <Route path="/blogs/:catagory" element={<Home />} />
          <Route path="/blogs/:catagory/:id" element={<Home />} />
          <Route path="/admin/login" element={<Login user = {user} onLogin = {handleNewUser}  />} />
          <Route path="/admin/register" element={<Register onRegister={handleNewUser} user = {user} showAlert = {showAlert} />} />
          <Route path="/user/register" element={<UserRegister onRegister={handleNewUser} user = {user}/>} />
          <Route path="/user/profile" element={<Profile user = {user}/>} />
          <Route path="/user/login" element={<UserLogin user = {user} onLogin = {handleNewUser}/>} />
          <Route path="/admin/dashboard" element={<Dashboard showAlert = {showAlert} />} />
          <Route path="/admin/dashboard/manage-blog" element={<ManageBlog />} />
          <Route path="/admin/update-blog/:id" element={<UpdateBlog user={user} showAlert={showAlert} />} />
          <Route path="/admin/dashboard/manage-home" element={<HomeManager user = {user} showAlert={showAlert}/>} />
          <Route path="/admin/dashboard/manage-categories" element={<ManageCategories user = {user} showAlert = {showAlert}/>} />
          <Route path="/admin/dashboard/add-new-blog" element={<AddBlog user = {user} showAlert = {showAlert} />} />
          <Route path="/admin/dashboard/contact-form" element={<ContactForm showAlert = {showAlert}/>} />
          <Route path="/admin/:username/profile" element={<AdminProfile user= {user}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/:cat/:slug" element={<PostPage user = {user} showAlert = {showAlert}/>} />
          <Route path="/:cat" element={<CatBlog/>}/>
          <Route path="/contact-us" element={<Contact user = {user} showAlert = {showAlert}/>} />
          <Route path="/terms-and-condition" element={<TermsCondition />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App