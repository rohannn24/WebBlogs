import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = ({
  user
}) => {
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  },[user])
  useEffect(() => {
    document.title = `${user?.name} | User Profile`
  }, [])
  return (
    <>
      <div className="full-profile-page">

      </div>
    </>
  )
}

export default Profile