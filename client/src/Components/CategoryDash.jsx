import React, { useEffect, useState } from 'react'
import './Style/CategoryDash.css'

const CategoryDash = ({
    user,
    showAlert
}) => {
    const [cat, setCat] = useState(null);
    const [newCat, setNewCat] = useState({
        catName: ''
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const getCat = async () => {
            setLoading(true);
            const res = await fetch('/api/category/all-category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                }
            })
            const resData = await res.json();
            setCat(resData.categories);
            setLoading(false);
        }
        getCat();
    }, [])
    const handleChange = (e) => {
        setNewCat({[e.target.name]: e.target.value});
    }
    const handleCatSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/category/add-new-category', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(newCat)
        })
        const resData = await res.json();
        if(res.ok){
            console.log(resData);
            setCat(resData.allCategories);
            document.querySelector('.add-cat-popup').style.display = 'none';
            showAlert(resData.message);
            setNewCat({
                catName: ''
            })
        } else{
            document.querySelector('.add-cat-popup').style.display = 'none';
            showAlert(resData.message);
        }
    }
    const handleCatDel = async (id) => {
        const res = await fetch(`/api/category/delete-category/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            }
        })
        const data = await res.json();
        if(res.ok){
            setCat(data.category);
            showAlert(data.message);
        }
    }
    const handleCatUpdate = (id) => {

    }
    return (
        <>
        <div className="loader" style={{display: loading?'flex':'none'}}>
            <div className="loading"></div>
            <p>Loading...</p>
        </div>
            <div className="full-cat-dash">
                <div className="fcd-card">
                    <h1>All Categories</h1>
                    <div className="form-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>S. No.</th>
                                    <th>Category Name</th>
                                    <th>Number of Blogs</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cat?.length > 0 ? (cat.map((c, index) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{c.catName}</td>
                                        <td>{c.blogs.length}</td>
                                        <td>
                                            <div className="cd-btn" onClick={() => { handleCatUpdate(c._id) }}>Update</div>
                                            <div className="cd-btn" onClick={() => { handleCatDel(c._id) }}>Delete</div>
                                        </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td>There is no new form submissions to show</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="add-cat-btn" onClick={() => {
                        document.querySelector('.add-cat-popup').style.display = 'flex';
                    }}>Add New Category</div>
                </div>
            </div>
            <div className="add-cat-popup">
                <div className="add-cat-card">
                    <h3>Add New Category</h3>
                    <form onSubmit={handleCatSubmit}>
                        <input type="text" name = 'catName' placeholder='Enter New Category' onChange={handleChange} value={newCat.catName}/>
                        <input type="submit" value="Add" />
                    </form>
                </div>
            </div>
        </>
    )
}

export default CategoryDash