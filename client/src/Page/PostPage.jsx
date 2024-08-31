import React, { useEffect, useState } from 'react';
import './Style/PostPage.css';
import { Link, useParams } from 'react-router-dom';
import { checkAdmin } from '../utils/SetValues';

const PostPage = ({
  user,
  showAlert
}) => {
  const { slug } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [cat, setCat] = useState([]);
  const [commentData, setCommentData] = useState({
    content: "",
    blogId: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(true)
  useEffect(() => {
    const getBlog = async () => {
      try {
        const res = await fetch('/api/com/all-blogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const resData = await res.json();
        setBlogs(resData.blogs);
      } catch (error) {
        setError(error.message);
      }
    };
    getBlog();
  }, []);
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
        setCat(resData.categories);
        const a = await checkAdmin();
        console.log(a.success);
        setAdmin(a.success);
      } catch (error) {
        setError(error.message);
      }
    };
    getCat();
    
  }, []);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch blog data');
        }
        const resData = await res.json();
        setBlogData(resData.blog);
        console.log(resData.blog);
        setCommentData({ ...commentData, blogId: resData.blog._id })
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };
    getData();
  }, [slug]);
  useEffect(() => {
    if (blogData) {
      document.title = blogData.title;
    }
  }, [blogData]);
  if (error) {
    return <div>Error: {error}</div>;
  }
  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getUTCFullYear();

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const formattedDate = `${day}${getDaySuffix(day)} ${month}, ${year}`;
    return formattedDate;
  };
  const handleFormChange = (e) => {
    setCommentData({ ...commentData, [e.target.name]: e.target.value })
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/user/add-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(commentData)
        });

        const resData = await res.json();
        if (res.ok) {
            // Updating the blog data with the newly added comment
            setBlogData((prevData) => ({
                ...prevData,
                commentId: [...prevData.commentId, resData.newComment]
            }));

            // Clear the comment input field
            setCommentData((prevData) => ({
                content: "",
                blogId: prevData.blogId,
            }));
            console.log(resData);
        } else {
            setError('Failed to add comment');
        }
    } catch (error) {
        setError(error.message);
    }
};

  const handleBlogDislike = async () => {
    const res = await fetch(`/api/user/dislike-blog/${commentData.blogId}`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        token: localStorage.getItem('token')
      }
    })
    const resData = await res.json();
    if(res.ok){
      setBlogData(resData.blog);
      showAlert(resData.message);
    } else{
      showAlert(resData.message);
    }
  }
  const handleBlogLike = async () => {
    const res = await fetch(`/api/user/like-blog/${commentData.blogId}`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        token: localStorage.getItem('token')
      }
    })
    const resData = await res.json();
    if(res.ok){
      setBlogData(resData.blog);
      showAlert(resData.message);
    }else{
      showAlert(resData.message);
    }
  }
  const handleCommentLike = async (id) => {
    const res = await fetch(`/api/user/like-comment/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
    });
    const resData = await res.json();
    
    if(!user){
      return showAlert(resData.message);
    }
    if (res.ok) {
      // Update the blogData with the new comment data
      setBlogData((prevData) => ({
        ...prevData,
        commentId: resData.comments,
      }));
      showAlert(resData.message);
    } else {
      showAlert(resData.message);
    }
  };

  const handleCommentDislike = async (id) => {
    const res = await fetch(`/api/user/dislike-comment/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
    });
    const resData = await res.json();
    if (res.ok) {
      // Update the blogData with the new comment data
      setBlogData((prevData) => ({
        ...prevData,
        commentId: resData.comments,
      }));
      showAlert(resData.message);
    } else {
      showAlert(resData.message);
    }
  };
  const handleLink = (str) => {
    return str.replace(/\s+/g, '-');
  };
  return (
    <>
    <div className="loader-post" style={{display: loading?'flex':'none'}}>
            <div className="loading"></div>
            <p>Loading...</p>
        </div>
      <div className="full-post-page">
        <div className="fpp-left">
          <div className="post-area">
            {blogData ? (
              <>
                <div className="pa-img-ctrl">
                  <img src={blogData.bImg} alt={blogData.title || 'Blog Image'} />
                </div>
                <hr />
                <div className="meta-info">
                  <p><i className="fa-solid fa-user-tie"></i> {blogData?.adminId?.name}, {formatDate(blogData.updatedAt)}</p>
                  <p><i className="fa-solid fa-thumbs-up"></i> {blogData?.likes?.length}</p>
                  <p><i className="fa-solid fa-thumbs-down"></i> {blogData?.dislikes?.length}</p>
                  <p><i className="fa-solid fa-comments"></i> {blogData?.commentId.length}</p>
                  <p><i className="fa-solid fa-list"></i> {blogData?.cat?.catName}</p>
                </div>
                <h1>{blogData.title}</h1>
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blogData.content }}
                />
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="comment-like-area">
            <div className="like-area">
              <div className="like-btn" onClick={handleBlogLike}><i className="fa-solid fa-thumbs-up"></i> Like {blogData?.likes?.length}</div>
              <div className="like-btn" onClick={handleBlogDislike}><i className="fa-solid fa-thumbs-down"></i> Dislike {blogData?.dislikes?.length}</div>
            </div><hr />
            <h4>Comments</h4>
            <div className="all-comments">
              {blogData?.commentId?.length > 0 ? (
                [...blogData.commentId].reverse().map((elem, idx) => (
                  <div key={idx} className='comment-wrapper'>
                    <h4>{elem?.userId?.name}</h4>
                    <div className="single-comment">{elem?.content}</div>
                    <div className="sc-info">
                      <div className="like-btn" onClick={() => {handleCommentLike(elem?._id)}}><i className="fa-solid fa-thumbs-up"></i> Like {elem?.likes?.length}</div>
                      <div className="like-btn" onClick={() => {handleCommentDislike(elem?._id)}}><i className="fa-solid fa-thumbs-down"></i> Dislike {elem?.dislikes?.length}</div>
                    </div>
                  </div>
                ))
              ) : (
                <>No Comments To show</>
              )}
            </div>
            <h5>Add new Comment</h5>
            {user && !isAdmin ? (<form onSubmit={handleFormSubmit}>
              <input type="text" placeholder='Enter a comment' name='content' onChange={handleFormChange} value={commentData.content} />
              <input type="submit" value="Add" />
            </form>): (<>Login as User to Comment on this Post</>)}
          </div>
        </div>
        <div className="fpp-right">
          <div className="recent-cat">
            <h1>Categories</h1>
            {cat.length > 0 ? (
              <ul className="recentlist">
                {cat.map((category) => (
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
            {blogs.length > 0 ? (
              <ul className="recentlist">
                {blogs.map((blog) => (
                  <div key={blog._id} className="oneRecent">
                    <img src={blog.bImg} alt="" />
                    <li className="rl-items">
                      <Link to={`/${handleLink(blog?.cat?.catName).toLowerCase()}/${blog.slug}`}>
                        {truncateTitle(blog.title, 40)}
                      </Link>
                      <div className="rl-meta">
                        <div className="meta"><i className="fa-solid fa-layer-group"></i> {blog.cat.catName}</div>
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
    </>
  );
};

export default PostPage;
