import React, { useEffect } from 'react'
import './Style/Dashboard.css'
import DashNav from '../../Components/DashNav'
import DashContent from '../../Components/DashContent'
const ManageComment = () => {
  useEffect(() => {
    document.title = "Manage Comment | TechBlog"
  },[])
  return (
    <>
    <div className="full-dashboard">
        <div className="fd-left">
          <DashNav/>
        </div>
        <div className="fd-right">
          <DashContent/>
        </div>
      </div>
    </>
  )
}

export default ManageComment