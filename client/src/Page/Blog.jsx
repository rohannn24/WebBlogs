import React, { useEffect, useState } from 'react';
import './Style/Blog.css';
import { Link } from 'react-router-dom';

const Blog = ({ showAlert }) => {
  const [blogs, setBlogs] = useState([]); // Initialize with an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setNumberOfBlogs] = useState(8);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCat = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/com/all-blogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch Blogs');
        }
        const resData = await res.json();
        setBlogs(resData.blogs.reverse()); // Reverse the order
        setLoading(false);
      } catch (error) {
        console.log(error);
        showAlert('Failed to fetch Blogs');
      }
    };
    getCat();
  }, [showAlert]);

  // Calculate indexes for the current page
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleNumber = (e) => {
    if(e.target.value === "" || e.target.value === "0"){
      console.log('hit')
      setNumberOfBlogs(8);
    }else{
      setNumberOfBlogs(e.target.value);
    }
  }
  const handleLink = (e) => {
    const originalString = e;
    const convertedString = originalString.replace(' ', '-');
    console.log(convertedString);
    return convertedString
  }
  return (
    <>
    <div className="loader-blog" style={{display: loading?'flex':'none'}}>
            <div className="loading"></div>
            <p>Loading...</p>
        </div>
      <div className="blog-page-wrapper">
        <div className="bpw-left">
          <div className="bpw-header">
            <h1>All Blogs</h1>
            <input type="number" placeholder='No. of Blogs in one Page' onChange={handleNumber}/>
          </div>
          <hr />
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog) => (
              <Link to={`/${handleLink(blog.cat.catName).toLowerCase()}/${blog.slug}`} key={blog._id}>
                <div className="bar-card">
                  <div className="bc-img-ctrl">
                    <img
                      src={blog.bImg || "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"}
                      alt={blog.title}
                    />
                  </div>
                  <div className="bc-content">
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                    <div className="bcci-date">{new Date(blog.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No blogs available</p>
          )}

          {/* Pagination Controls */}
          <div className="blog-pages">
            {[...Array(Math.ceil(blogs.length / blogsPerPage)).keys()].map((number) => (
              <div
                key={number + 1}
                className={`blog-page ${currentPage === number + 1 ? 'active' : ''}`}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="bpw-right"></div>
      </div>
    </>
  );
};

export default Blog;
