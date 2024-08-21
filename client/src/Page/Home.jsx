import React, { useEffect } from 'react'
import Recent from '../Components/Recent'
import Category from '../Components/Category'
import './Style/Home.css'

const Home = ({
  user
}) => {
  useEffect(() => {
    document.title = "Home | TechBlog"
  },[])
  return (
    <>
    <div className="wrapp-home">
      <Recent user={user}/>
      <Category cat = "sports"/>
      <Category cat = "travel"/>
      <Category cat = "horror"/>
    </div>
    </>
  )
}

export default Home