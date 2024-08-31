import React, { useEffect, useState } from 'react';
import './Style/Dashboard.css';
import DashNav from '../../Components/DashNav';
import DashContent from '../../Components/DashContent';
import { useNavigate } from 'react-router-dom';
import { checkAdmin } from '../../utils/SetValues';

const Dashboard = ({ showAlert }) => {
  const [result, setResult] = useState(false);
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
        <DashContent />
      </div>
    </div>
  );
}

export default Dashboard;
