import React, { useEffect } from 'react'

const Blog = () => {
  useEffect(() => {
    document.title = "Blog | TechBlog"
  },[])
  return (
    <div>Blog</div>
  )
}

export default Blog