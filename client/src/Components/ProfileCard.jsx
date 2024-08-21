import React from 'react'
import './Style/ProfileCard.css'
import { Link } from 'react-router-dom'
const ProfileCard = ({
    user
}) => {
  return (
    <>
        <div className="full-profile-card">
          <div className="profile-left">
            <div className="p-img-ctrl">
              <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="" />
            </div>
            <h3>Name: {user?.name}</h3>
          </div>
          <div className="profile-mid">
              <p>Username: {user?.username}</p>
              <p>Email: {user?.email}</p>
              <p>Phone: {user?.phone}</p>
              <p>No. of Blogs: {user?.blogs.length}</p>
          </div>
          <div className="profile-right">
            <div className="p-btns">
              <Link to = '/admin/dashboard/add-new-blog'><div className="n-b">Add Blog</div></Link>
              <Link to = '/admin/dashboard'><div className="d-b">Dashbard</div></Link>
            </div>
          </div>
        </div>
    </>
  )
}

export default ProfileCard