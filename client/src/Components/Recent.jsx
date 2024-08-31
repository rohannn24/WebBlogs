import React, { useEffect, useState } from 'react';
import './Style/Recent.css';
import { Link } from 'react-router-dom';

const Recent = ({ user, onComplete, handleData }) => {
    const [recent, setRecent] = useState(null);

    useEffect(() => {
        document.title = "Home | TechBlog";
        getOne();
    }, []);

    const getOne = async () => {
        try {
            const res = await fetch('/api/com/all-blogs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await res.json();
            console.log(resData);
            if(resData?.blogs?.length === 0){
                handleData(true);
            }
            if(resData?.blogs?.length > 0){
                handleData(false);
            }
            if (res.ok) {
                setRecent(resData);
                onComplete();
            } else {
                console.log('Error fetching blogs:', resData.message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const truncateTitle = (title, maxLength) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    return (
        <div className="full-recent">
            <div className="recent-main">
                {recent && recent.blogs && recent.blogs[recent.blogs.length-1] ? (
                    <Link to={`/${recent?.blogs[recent.blogs.length-1]?.cat?.catName.toLowerCase() || 'Uncategorized'}/${recent.blogs[recent.blogs.length-1].slug}`}>
                        <div className="m-card">
                            <div className="img-ctrl">
                                <img
                                    src={recent.blogs[recent.blogs.length-1].bImg || 'default-image.jpg'}
                                    alt={recent.blogs[recent.blogs.length-1].title || 'Blog Image'}
                                />
                            </div>
                            <div className="meta-data">
                                <h4>{truncateTitle(recent.blogs[recent.blogs.length-1].title || 'Untitled Blog', 50)}</h4>
                                <p className='md-desc'>
                                    {recent.blogs[recent.blogs.length-1].description || 'No description available.'}
                                </p>
                                <div className="extra-data">
                                    <p className="author">{recent.blogs[recent.blogs.length-1].adminId.name || 'Unknown Author'}</p>
                                </div>
                            </div>
                            <div className="category">
                                {recent?.blogs[recent.blogs.length-1]?.cat?.catName || 'Uncategorized'}
                            </div>
                        </div>
                    </Link>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="recent-four">
                {recent && recent.blogs && recent.blogs.slice(-5, -1).reverse().map((blog, index) => (
                    <div className="rf-card" key={index}>
                        <Link to={`/${blog?.cat?.catName.toLowerCase() || 'uncategorized'}/${blog.slug || blog._id}`}>
                            <div className="m-card">
                                <div className="img-ctrl">
                                    <img
                                        src={blog?.bImg || 'default-image.jpg'}
                                        alt={blog?.title || 'Blog Image'}
                                    />
                                </div>
                                <div className="meta-data">
                                    <h4>{truncateTitle(blog.title || 'Untitled Blog', 50)}</h4>
                                    <div className="extra-data">
                                        <p className="author">{blog?.adminId.name || 'Unknown Author'}</p>
                                    </div>
                                </div>
                                <div className="category">
                                    {blog?.cat?.catName || 'Uncategorized'}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recent;
