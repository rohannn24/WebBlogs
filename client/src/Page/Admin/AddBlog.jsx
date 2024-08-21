import React, { useEffect, useState } from 'react'
import './Style/Dashboard.css'
import DashNav from '../../Components/DashNav'
import BlogEditor from '../../Components/BlogEditor'
import { checkAdmin } from '../../utils/SetValues'
import { useNavigate } from 'react-router-dom'

const AddBlog = ({
  showAlert,
  user
}) => {
  const [result, setResult] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const adminCheck = await checkAdmin();
      setResult(adminCheck);
      if (!adminCheck.success) {
        nav('/');
      } else{
        showAlert(adminCheck.message + "Blog Posting Page");
      }
    };

    verifyAdmin();
  }, [nav, showAlert]);
  useEffect(() => {
    document.title = "New Blog | TechBlog"
  },[])
  return (
    <>
      <div className="full-dashboard">
        <div className="fd-left">
          <DashNav />
        </div>
        <div className="fd-right">
          <BlogEditor showAlert={showAlert} user = {user}/>
          <div className="s-o" onClick={() => {
            document.querySelector('.fd-left').style.left === '-100%'? document.querySelector('.fd-left').style.left = '0%':document.querySelector('.fd-left').style.left = '-100%'
          }}>More Options</div>
        </div>
      </div>
    </>
  )
}

export default AddBlog