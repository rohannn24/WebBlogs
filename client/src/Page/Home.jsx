import React, { useEffect, useState } from 'react';
import Recent from '../Components/Recent';
import Category from '../Components/Category';
import './Style/Home.css';
import Loading from './Loading';

const Home = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingBlog, setLoadingBlog] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/home/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await res.json();
        setCategories(data.structure[0].homeRow);
        setLoadingCat(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    if(loadingBlog || loadingCat){
      document.querySelector('.load-section').style.display = 'block';
      document.querySelector('.wrapp-home').style.display = 'none';
      console.log('hit');
    } else{
      document.querySelector('.load-section').style.display = 'none';
      document.querySelector('.wrapp-home').style.display = 'block';
    }
  },[loadingBlog, loadingCat])
  const handleLoading = () => {
    setLoadingBlog(false);
  }
  return (
    <>
    <div className="load-section">
      <Loading/>
    </div>
      <div className="wrapp-home">
        <Recent user={user} onComplete = {handleLoading}/>
        {categories?.map((catName, index) => (
          <Category key={index} cat={catName} />
        ))}
      </div>
    </>
  );
};

export default Home;
