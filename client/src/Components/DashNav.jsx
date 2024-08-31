import React from 'react'
import {Link} from 'react-router-dom'
const DashNav = () => {
  const handleClick = () => {
    if(document.querySelector('.fd-left').style.left !== '-100%'){
      document.querySelector('.fd-left').style.left = '-100%'
    } else{
      document.querySelector('.fd-left').style.left = '0'
    }
  }
  return (
    <>
        <ul className="sn-list">
            <Link to = '/admin/dashboard'><li className="snItems">Home</li></Link>
            <Link to = '/admin/dashboard/add-new-blog'><li className="snItems">Add Blogs</li></Link>
            <Link to = '/admin/dashboard/manage-home'><li className="snItems">Manage Home</li></Link>
            <Link to = '/admin/dashboard/manage-blog'><li className="snItems">Manage Blogs</li></Link>
            <Link to = '/admin/dashboard/manage-categories'><li className="snItems">Manage Categories</li></Link>
            <Link to = '/admin/dashboard/contact-form'><li className="snItems">Contact Forms</li></Link>
        </ul>
        <div className="dash-bgr" onClick={handleClick}>Show More Options</div>
    </>
  )
}

export default DashNav