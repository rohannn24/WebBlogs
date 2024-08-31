import React, { useEffect, useState } from 'react';
import './Style/FormCard.css';
import { Editor } from '@tinymce/tinymce-react';

const FormCard = ({
    showAlert
}) => {
    const [forms, setForms] = useState([]);
    const [mailData, setMailData] = useState({
        receiver: '',
        cc: '',
        subject: '',
        content: '',
    });
    const [loading, setLoading] = useState(false);
    const showMessage = (message) => {
        document.querySelector('.sp-content').innerHTML = message;
        document.querySelector('.c-f-pop-up').style.display = 'flex';
    };

    const handleClosePop = () => {
        document.querySelector('.c-f-pop-up').style.display = 'none';
    };

    const showMail = (email) => {
        setMailData((prev) => ({ ...prev, receiver: email }));
        document.querySelector('.mailer-pop').style.display = 'flex';
    };

    const handleCloseMail = () => {
        document.querySelector('.mailer-pop').style.display = 'none';
    };

    useEffect(() => {
        getComment();
    }, []);
    
    const getComment = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/get-form', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            }
        });
        const resData = await res.json();
        if (res.ok) {
            setForms(resData.forms);
            setLoading(false);
        } else {
            console.log(res);
        }
    };

    const handleFormDelete = async (id) => {
        const res = await fetch(`/api/admin/delete-form/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            }
        })
        const resData = await res.json();
        if (res.ok) {
            setForms(resData.forms);
        }
    }

    const handleMailDataChange = (e) => {
        const { name, value } = e.target;
        setMailData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditorChange = (content) => {
        setMailData((prev) => ({
            ...prev,
            content: content,
        }));
    };

    const handleMailSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/admin/send-mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(mailData)
        })
        const resData = await res.json();
        if(res.ok){
            showAlert(resData.message);
        }
    }
    return (
        <>
        <div className="loader" style={{display: loading?'flex':'none'}}>
            <div className="loading"></div>
            <p>Loading...</p>
        </div>
            <div className="head-form-section">
                <h1>All Form Submitted</h1>
            </div>
            <div className="form-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Topic</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.length > 0 ? (forms.map((form, index) => (
                            <tr key={index}>
                                <td>{form.name}</td>
                                <td>{form.subject}</td>
                                <td>{form.email}</td>
                                <td>
                                    <div className="w-t-btns">
                                        <div className="r-m-btn" onClick={() => showMail(form.email)}>
                                            Reply
                                        </div>
                                        <div className="s-m-btn" onClick={() => showMessage(form.msg)}>
                                            Show Message
                                        </div>
                                        <div className="d-m-btn" onClick={() => handleFormDelete(form._id)}>Delete Message</div>
                                    </div>
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
            <div className="c-f-pop-up">
                <div className="c-f-pu-card">
                    <h1 className="sp-head">Message</h1>
                    <div className="sp-content"></div>
                    <div className="c-f-close" onClick={handleClosePop}>
                        <i className="fa-solid fa-circle-xmark"></i>
                    </div>
                </div>
            </div>
            <div className="mailer-pop">
                <div className="mail-card">
                    <h1>Send Reply Over Mail</h1>
                    <form onSubmit={handleMailSubmit}>
                        <label htmlFor="">Sender:</label>
                        <input type="text" className='readOn' value="connect.codesofrohan@outlook.com" readOnly />
                        <label htmlFor="">Receiver:</label>
                        <input type="text" name="receiver" className='readOn receiver' value={mailData.receiver} readOnly />
                        <label htmlFor="">CC:</label>
                        <input
                            type="text"
                            name="cc"
                            placeholder='Add Emails For CC (Optional)'
                            value={mailData.cc}
                            onChange={handleMailDataChange}
                        />
                        <label htmlFor="">Subject:</label>
                        <input
                            type="text"
                            name="subject"
                            placeholder='Enter The Subject'
                            value={mailData.subject}
                            onChange={handleMailDataChange}
                        />
                        <label htmlFor="">Content:</label>
                        <Editor
                            apiKey="zoi7anvfgjfg5r44pqjlvj1c4yblqglmz2pas2i65pah5c6u"
                            init={{
                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                height: 500
                            }}
                            value={mailData.content}
                            onEditorChange={handleEditorChange}
                        />
                        <input type="submit" value="Send Mail" />
                    </form>
                </div>
                <div className="m-f-close" onClick={handleCloseMail}>
                    <i className="fa-solid fa-circle-xmark"></i>
                </div>
            </div>
        </>
    );
};

export default FormCard;
