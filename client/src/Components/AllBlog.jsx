import React, { useEffect, useState } from 'react';
import './Style/CategoryDash.css';

import { Link, useNavigate } from 'react-router-dom';

const AllBlog = ({ user, showAlert }) => {
    const [cat, setCat] = useState(null);
    const [newCat, setNewCat] = useState({ catName: '' });
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [showCommentsPopup, setShowCommentsPopup] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const getCat = async () => {
            setLoading(true);
            const res = await fetch('/api/category/all-category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                }
            });
            const resData = await res.json();
            setCat(resData.categories);
            setLoading(false);
        };
        getCat();
    }, []);

    const handleChange = (e) => {
        setNewCat({ [e.target.name]: e.target.value });
    };

    const handleCatDel = async (id) => {
        try {
            setDeleting(true);
            const res = await fetch(`/api/admin/delete-blog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                }
            });
            const data = await res.json();

            if (res.ok) {
                setCat(prevCats =>
                    prevCats.map(category => ({
                        ...category,
                        blogs: category.blogs.filter(blog => blog._id !== id)
                    }))
                );
                setDeleting(false);
                showAlert(data.message);
            } else {
                showAlert('Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showAlert('Error deleting blog');
        }
    };

    const handleShowComments = async (blog) => {
        try {
            setSelectedBlog(blog);
            setLoading(true);
            const res = await fetch(`/api/admin/${blog._id}/comments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                }
            });
            const resData = await res.json();
            if (res.ok) {
                setComments(resData.comments);
                setShowCommentsPopup(true);
            } else {
                showAlert('Failed to fetch comments');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
            showAlert('Error fetching comments');
        }
    };

    const handleCommentDel = async (commentId, userId) => {
        try {
            const res = await fetch(`/api/admin/delete-comment/${commentId}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                }
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setComments(data.comments);
                showAlert(data.message);
            } else {
                showAlert('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            showAlert('Error deleting comment');
        }
    };

    return (
        <>
            <div className="loader" style={{ display: deleting ? 'flex' : 'none' }}>
                <div className="loading"></div>
                <p>Deleting...</p>
            </div>
            <div className="loader" style={{ display: loading ? 'flex' : 'none' }}>
                <div className="loading"></div>
                <p>Loading...</p>
            </div>
            <div className="full-cat-dash">
                <div className="fcd-card">
                    <h1>All Blogs</h1>
                    <div className="form-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>S. No.</th>
                                    <th>Category Name</th>
                                    <th>Blog Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cat?.length > 0 ? (
                                    cat.map((c, catIndex) => (
                                        c.blogs.map((blog, blogIndex) => (
                                            <tr key={blog._id}>
                                                <td>{catIndex + 1}.{blogIndex + 1}</td>
                                                <td>{c.catName}</td>
                                                <td>{blog.title}</td>
                                                <td>
                                                    <div className="cd-btn" onClick={() => { nav(`/admin/update-blog/${blog._id}`) }}>Update</div>
                                                    <div className="cd-btn" onClick={() => { handleCatDel(blog._id) }}>Delete</div>
                                                    <div className="cd-btn" onClick={() => { handleShowComments(blog) }}>Show Comments</div>
                                                </td>
                                            </tr>
                                        ))
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">There are no categories or blogs to show.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="add-cat-btn">
                        <Link to='/admin/dashboard/add-new-blog' style={{ color: 'white' }}>Add Blog</Link>
                    </div>
                </div>
            </div>

            {showCommentsPopup && (
                <div className="comments-popup">
                    <div className="popup-content">
                        <h2>Comments for {selectedBlog.title}</h2>
                        <button className="close-btn" onClick={() => setShowCommentsPopup(false)}>Close</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>S. No.</th>
                                    <th>Name</th>
                                    <th>Comment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments?.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <tr key={comment._id}>
                                            <td>{index + 1}</td>
                                            <td>{comment.userId.name}</td>
                                            <td>{comment.content}</td>
                                            <td>
                                                <button className="cd-btn" onClick={() => handleCommentDel(comment._id, comment.userId._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No comments available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllBlog;
