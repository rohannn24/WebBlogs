import React, { useEffect } from 'react'
import { checkAdmin } from '../../utils/SetValues';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../../Components/ProfileCard';
import './Style/Profile.css'

const Profile = ({
  user
}) => {
  const nav = useNavigate();
  useEffect(() => {
    document.title = `${user?.name} | Admin Profile`
    if (!user) {
      nav('/');
    }
  },[user])
  useEffect(() => {
    const verifyAdmin = async () => {
      const adminCheck = await checkAdmin();
      if (!user) {
        nav('/');
      }
    };
    verifyAdmin();
  }, [nav]);
  return (
    <>
      <div className="full-admin-profile">
        <ProfileCard user = {user}/>
      </div>
    </>
  )
}

export default Profile


