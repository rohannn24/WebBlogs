import React, { useEffect, useState } from 'react'
import './Style/Contact.css'
import { useNavigate } from 'react-router-dom';
import { checkAdmin } from '../utils/SetValues';
const Contact = ({ user, showAlert }) => {
  const [formData, setFormData] = useState({
    name: user?.name,
    username: user?.username,
    phone: user?.phone,
    email: user?.email,
    subject: "General Enquiry",
    msg: ""
  })
  const [result, setResult] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            const adminCheck = await checkAdmin();
            setResult(adminCheck);
            if(adminCheck.success){
              nav('/admin/dashboard')
            }
        };
        verifyAdmin();
    }, []);
  useEffect(() => {
    document.title = "Contact Us | TechBlog"
    const inptNode = document.querySelectorAll('.unEditable');
    inptNode.forEach(element => {
      if (user) {
        element.readOnly = true;
      }
    });
  }, [])
  
  useEffect(() => {
    const inptNode = document.querySelectorAll('.unEditable');
    inptNode.forEach(element => {
      if (user) {
        element.readOnly = true;
      } else {
        element.readOnly = false;
      }
    });
  }, [user])
  const handleChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;

    setFormData({...formData, [name]: value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch ('/api/com/submit-form', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const resData = await res.json();
    if(res.ok){
      showAlert(resData.message);
    }
  }
  return (
    <>
      <div className="full-contact-page">
        <div className="contact-card">
          <h1>Contact Us</h1>
          <div className="cc-full">

            <div className="cc-left">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate placeat expedita tempore repellat explicabo ipsa qui odio provident. Sed excepturi voluptatibus sit debitis labore culpa autem repudiandae iste eos ipsum.</p>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas qui quis consequatur adipisci est. Ad quos iste adipisci nobis voluptatem.</p>
              <h3>Lorem ipsum dolor sit amet.</h3>
              <ul>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</li>
                <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, similique laboriosam.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing.</li>
              </ul>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, explicabo qui.</p>
            </div>
            <div className="cc-right">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className='unEditable'
                  placeholder="Enter your name"
                  onChange = {handleChange}
                  value={user?.name}
                  required
                />
                <input
                  type="text"
                  className='unEditable'
                  placeholder="Enter your username"
                  onChange = {handleChange}
                  value={user?.username}
                  required
                />
                <input
                  type="email"
                  className='unEditable'
                  placeholder="Enter you email"
                  onChange = {handleChange}
                  value={user?.email}
                  required />
                <input
                  type="number"
                  className='unEditable'
                  placeholder="Enter your phone number"
                  onChange = {handleChange}
                  value={user?.phone}
                  required />
                <select
                  name="subject"
                  id="sub"
                  onChange = {handleChange}
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Report">Report</option>
                  <option value="Copyright Claim">Copyright Claim</option>
                  <option value="False info. report">False info. report</option>
                </select>
                <textarea
                  name="msg"
                  id="msg"
                  onChange = {handleChange}
                  placeholder="Enter you message here"
                  rows={5}>
                </textarea>
                <input type="submit" value="Submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact