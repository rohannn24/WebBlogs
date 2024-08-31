import React, { useEffect, useState } from 'react';
import './Style/PostPage.css';
import { Link, useParams } from 'react-router-dom';
import './Style/CatBlog.css';
import { checkAdmin } from '../utils/SetValues';

const CatBlog = ({ showAlert }) => {
  const { cat } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [error, setError] = useState(null);
  const [cato, setCato] = useState([]);

  useEffect(() => {
    const getCat = async () => {
      try {
        const res = await fetch('/api/category/all-category', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const resData = await res.json();
        setCato(resData.categories);
        const a = await checkAdmin();
        console.log(a.success);
      } catch (error) {
        setError(error.message);
      }
    };
    getCat();
  }, []);
  const handleParams = (e) => {
    const originalString = e;
const modifiedString = originalString.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());
return modifiedString;

  }
  useEffect(() => {
    const getBlogsByCategory = async () => {
      try {
        const category = handleParams(cat);
        const res = await fetch(`/api/category/${category}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch blogs for this category');
        }
        const resData = await res.json();
        console.log(resData);
        setBlogs(resData?.catBlog?.blogs);
      } catch (error) {
        setError(error.message);
      }
    };
    getBlogsByCategory();
  }, [cat]);

  if (error) {
    return <div>Errors: {error}</div>;
  }

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };
  const handleLink = (str) => {
    return str.replace(/\s+/g, '-');
  };
  
  return (
    <div className="category-page">
      <div className="blogs-list">
        <h1>Blogs in Category: {handleParams(cat)}</h1>
        {blogs?.length > 0 ? (
          blogs?.map((blog) => (
            <div key={blog._id} className="oneRecent">
              <img src={blog.bImg} alt={blog.title || 'Blog Image'} />
              <li className="rl-items">
                <Link to={`/${handleLink(blog?.cat?.catName).toLowerCase()}/${blog.slug}`}>
                  {truncateTitle(blog.title, 40)}
                </Link>
                <div className="rl-meta">
                  <div className="meta"><i className="fa-solid fa-layer-group"></i> {handleLink(blog.cat.catName)}</div>
                  <div className="meta"><i className="fa-solid fa-thumbs-up"></i> {blog.likes.length}</div>
                  <div className="meta"><i className="fa-solid fa-thumbs-down"></i> {blog.dislikes.length}</div>
                </div>
              </li>
            </div>
          ))
        ) : (
          <p>No blogs available in this category</p>
        )}
      </div>
      <div className="fpp-right">
        <div className="recent-cat">
          <h1>Categories</h1>
          {cato?.length > 0 ? (
            <ul className="recentlist">
              {cato.map((category) => (
                <li key={category._id} className="rl-items">
                  <Link to={`/${handleLink(category.catName).toLowerCase()}`}>
                    {category.catName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No categories available</p>
          )}
        </div>
        <div className="recent-cat">
          <h1>Recent Blogs</h1>
          {blogs?.length > 0 ? (
            <ul className="recentlist">
              {blogs.map((blog) => (
                <div key={blog._id} className="oneRecent">
                  <img src={blog.bImg} alt="" />
                  <li className="rl-items">
                    <Link to={`/${handleLink(blog.cat.catName).toLowerCase()}/${blog.slug}`}>
                      {truncateTitle(blog.title, 40)}
                    </Link>
                    <div className="rl-meta">
                      <div className="meta"><i className="fa-solid fa-layer-group"></i> {handleLink(blog.cat.catName)}</div>
                      <div className="meta"><i className="fa-solid fa-thumbs-up"></i> {blog.likes.length}</div>
                      <div className="meta"><i className="fa-solid fa-thumbs-down"></i> {blog.dislikes.length}</div>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <p>No recent blogs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatBlog;
