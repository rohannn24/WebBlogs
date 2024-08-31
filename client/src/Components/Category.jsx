import React, { useEffect, useRef, useState } from 'react';
import './Style/Category.css';
import Card from './Card';

const Category = ({ cat }) => {
  const cardsContainerRef = useRef(null);
  const [allBlogs, setBlogs] = useState(null);

  const scrollLeft = () => {
    cardsContainerRef.current.scrollBy({
      left: -100, // Scrolls 100px to the left
      behavior: 'smooth' // Smooth scrolling
    });
  };

  const scrollRight = () => {
    cardsContainerRef.current.scrollBy({
      left: 100, // Scrolls 100px to the right
      behavior: 'smooth' // Smooth scrolling
    });
  };

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`/api/category/${cat}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resData = await res.json();
      if (res.ok) {
        // Reverse the array before setting state
        setBlogs(resData.catBlog.blogs.slice().reverse());
      } else {
        console.log('Error fetching blogs:', resData.message);
      }
    };
    getData();
  }, [cat]); // Adding `cat` as a dependency to refetch data when the category changes

  return (
    <>
      <div className="top-bar-head">
        <div className="cat-name">
          <h3>{cat}</h3>
        </div>
        <div className="s-line"></div>
        <div className="btns">
          <div className="slide-left" onClick={scrollLeft}>
            <i className="fa-solid fa-circle-arrow-left"></i>
          </div>
          <div className="slide-right" onClick={scrollRight}>
            <i className="fa-solid fa-circle-arrow-right"></i>
          </div>
        </div>
      </div>
      <div className="all-cards" ref={cardsContainerRef}>
        {
          allBlogs?.length > 0 ? (
            allBlogs.map((blog) => (
              <Card key={blog._id} blog={blog} />
            ))
          ) : (
            <p>No blogs available for this category.</p>
          )
        }
      </div>
    </>
  );
};

export default Category;
