import React from 'react'
import './Style/Card.css'

const Card = () => {
  return (
    <>
        <div className="full-card">
            <div className="img-ctrl">
                <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg" alt="" />
            </div>
            <div className="fc-data">
                <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis?</h3>
                <div className="rem-content">
                    <p>Date: 12th July, 2024</p>
                    <div className="d-btn btn">Read More</div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Card