import React, { useRef } from 'react';
import './Style/Category.css';
import Card from './Card';

const Category = ({ cat }) => {
  const cardsContainerRef = useRef(null);

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
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
};

export default Category;
