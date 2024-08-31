import React, { useEffect, useState } from 'react'
import './Style/Card.css'
import { Link } from 'react-router-dom';

const Card = ({
    blog
}) => {
    const [date, setDate] = useState(null);
    useEffect(() => {
        const d = formatDate(blog.createdAt);
        setDate(d);
    }, [])
    function formatDate(dateString) {
        const date = new Date(dateString);
      
        const day = date.getUTCDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getUTCFullYear();
      
        function getDaySuffix(day) {
          if (day > 3 && day < 21) return 'th'; 
          switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
          }
        }
      
        const formattedDate = `${day}${getDaySuffix(day)} ${month}, ${year}`;
        
        return formattedDate;
      }
      const truncateTitle = (title, maxLength) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };
  return (
    <>
        <div className="full-card">
            <div className="img-ctrl">
                <img src={blog?.bImg} alt="" loading='lazy' />
            </div>
            <div className="fc-data">
                <h3>{truncateTitle(blog.title, 50)}</h3>
                <div className="rem-content">
                    <p>Date: {date}</p>
                    <Link to ={ `${blog?.cat.catName.toLowerCase() || "uncategoried"}/${blog?.slug}` }className="d-btn btn">Read More</Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default Card