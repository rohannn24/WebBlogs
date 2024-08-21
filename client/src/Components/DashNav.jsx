import React from 'react'
import {Link} from 'react-router-dom'
const DashNav = () => {
  return (
    <>
        <ul className="sn-list">
            <Link to = '/admin/dashboard'><li className="snItems">Home</li></Link>
            <Link to = '/admin/dashboard/add-new-blog'><li className="snItems">Add Blogs</li></Link>
            <Link to = '/admin/dashboard/manage-blog'><li className="snItems">Manage Blogs</li></Link>
            <Link to = '/admin/dashboard/manage-comment'><li className="snItems">Manage Comments</li></Link>
            <Link to = '/admin/dashboard/contact-form'><li className="snItems">Contact Forms</li></Link>
        </ul>
    </>
  )
}

export default DashNav