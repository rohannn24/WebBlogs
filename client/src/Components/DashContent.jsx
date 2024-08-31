import React, { useEffect, useState } from 'react';
import './Style/CategoryDash.css';
import { Link, useNavigate } from 'react-router-dom';

const DashContent = ({ user, showAlert }) => {
    const [cat, setCat] = useState(null);
    const [newCat, setNewCat] = useState({ catName: '' });
    const nav = useNavigate();
    useEffect(() => {
        const getCat = async () => {
            const res = await fetch('/api/category/all-category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                }
            });
            const resData = await res.json();
            setCat(resData.categories);
        };
        getCat();
    }, []);

    const handleChange = (e) => {
        setNewCat({ [e.target.name]: e.target.value });
    };

    const handleCatSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/category/add-new-category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(newCat)
        });
        const resData = await res.json();
        if (res.ok) {
            setCat(resData.allCategories);
            document.querySelector('.add-cat-popup').style.display = 'none';
            showAlert(resData.message);
            setNewCat({ catName: '' });
        } else {
            document.querySelector('.add-cat-popup').style.display = 'none';
            showAlert(resData.message);
        }
    };

    const handleCatDel = async (id) => {
        const res = await fetch(`/api/admin/delete-blog/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            }
        });
        const data = await res.json();
        if (res.ok) {
            setCat(data.category);
            showAlert(data.message);
        }
    };

    return (
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
                                        <tr key={blogIndex}>
                                            <td>{catIndex + 1}.{blogIndex + 1}</td>
                                            <td>{c.catName}</td>
                                            <td>{blog.title}</td>
                                            <td>
                                                <div className="cd-btn" onClick={() => { nav(`/admin/update-blog/${blog._id}`) }}>Update</div>
                                                <div className="cd-btn" onClick={() => { handleCatDel(blog._id) }}>Delete</div>
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
    );
};

export default DashContent;
