import React from 'react'
import './Style/ErrorPage.css'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <>
      <div className="full-error-page">
        <div className="bg-img">
          <img src="https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1724112000&semt=ais_hybrid" alt="" />
        </div>
          <p>the page you are looking for is not available.</p>
          <div className="error-btns">
            <div className="a-btn"><Link to = '/'>Home</Link></div>
            <div className="a-btn"><Link to = '/'>Report</Link></div>
            <div className="a-btn"><Link to = '/'>Contact Us</Link></div>
          </div>
      </div>
    </>
  )
}

export default ErrorPage