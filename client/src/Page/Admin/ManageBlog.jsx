import React, { useEffect } from 'react'
import './Style/Dashboard.css'
import DashNav from '../../Components/DashNav'
import AllBlog from '../../Components/AllBlog'

const ManageBlog = ({
  user,
  showAlert
}) => {
  useEffect(() => {
    document.title = "Manage Blog | TechBlog"
  },[])
  return (
    <>
      <div className="full-dashboard">
        <div className="fd-left">
          <DashNav />
        </div>
        <div className="fd-right">
          <AllBlog user={user} showAlert={showAlert}/>
        </div>
      </div>
    </>
  )
}

export default ManageBlog