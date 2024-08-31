import React, { useEffect, useState } from 'react';
import './Style/ManageHome.css';

const ManageHome = ({
  showAlert
}) => {
  const [tabs, setTabs] = useState(3);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleTabsChange = (e) => {
    setTabs(Number(e.target.value));
  };

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch('/api/category/all-category', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        }
      });
      const resData = await res.json();
      setCategories(resData.categories);
    };

    getCategories();
  }, []);

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories[index] = value;
    setSelectedCategories(updatedCategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const send = JSON.stringify(selectedCategories);
    console.log('Selected Categories:', send);
    const res = await fetch('/api/home/edit', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        token: localStorage.getItem('token')
      },
      body: send
    })
    const resData = await res.json();
    if(res.ok){
      showAlert(resData.message);
    }
  };

  return (
    <>
      <div className="full-manage-home">
        <h1>Home Page Manager</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="no-of-tabs">
            <label htmlFor="tabs">Number of Tabs:</label>
            <input
              type="number"
              id="tabs"
              value={tabs}
              onChange={handleTabsChange}
              min="1"
            />
          </div>
          <div className="input-fields">
            {Array.from({ length: tabs }, (_, index) => (
              <div key={index} className="input-group">
                <select
                  id={`select-${index + 1}`}
                  name={`tab-${index + 1}`}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.catName}>
                      {category.catName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default ManageHome;
