import React, { useEffect } from 'react'

const About = () => {
  useEffect(() => {
    document.title = "About Us | TechBlog"
  },[])
  return (
    <div>About</div>
  )
}

export default About