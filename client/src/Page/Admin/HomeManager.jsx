import React, { useEffect, useState } from 'react';
import './Style/Dashboard.css';
import './Style/HomeManager.css';
import DashNav from '../../Components/DashNav';
import { useNavigate } from 'react-router-dom';
import { checkAdmin } from '../../utils/SetValues';
import ManageHome from '../../Components/ManageHome';

const HomeManager = ({ showAlert }) => {
  const [result, setResult] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const adminCheck = await checkAdmin();
      setResult(adminCheck);

      document.title = "Dashboard | TechBlog";

      if (!adminCheck.success) {
        nav('/');
      }
    };

    verifyAdmin();
  }, [nav, showAlert]);

  return (
    <div className="full-dashboard">
      <div className="fd-left">
        <DashNav />
      </div>
      <div className="fd-right">
        <ManageHome showAlert={showAlert}/>
      </div>
    </div>
  );
}

export default HomeManager;
