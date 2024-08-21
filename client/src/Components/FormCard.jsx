import React from 'react';
import './Style/FormCard.css';

const FormCard = () => {
    const showMessage = (message) => {
        document.querySelector('.sp-content').innerHTML = message;
        document.querySelector('.c-f-pop-up').style.display = 'flex';
    };
    const handleClosePop = () => {
        document.querySelector('.c-f-pop-up').style.display = 'none';
    };
    const showMail = () => {
        document.querySelector('.mailer-pop').style.display = 'flex';
    };
    const handleCloseMail = () => {
        document.querySelector('.mailer-pop').style.display = 'none';
    };
    return (
        <>
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
                        <tr>
                            <td>Rohan Kumar</td>
                            <td>General Enqury</td>
                            <td>rohankumar.cse2020@gmail.com</td>
                            <td>
                                <div className="w-t-btns">
                                    <div className="r-m-btn" onClick={() => showMail()}>
                                        Reply
                                    </div>
                                    <div className="s-m-btn" onClick={() => showMessage('fwealukfh klreuhtf fkljedhfskdhfaiwluerhf kjsdncvuikawerhfwjkdsnciwuaerhf kajsdbnvcaweilrufbng werjbf liudg hxcjhkvgk jhgjy yjgg jkhg jkhg jhghjg fhjfv hjgv jhv yu kjhb kljg lhgj khkljhlkjh lkjh kjhkjlhjkl hkjhjkl hjkhkjllh kjh kjhlkjhkl jhlkjh kjh')}>
                                        Show Message
                                    </div>
                                    <div className="d-m-btn">Delete Message</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="c-f-pop-up">
                <div className="c-f-pu-card">
                    <h1 className="sp-head">Message</h1>
                    <div className="sp-content"></div>
                </div>
                <div className="c-f-close" onClick={handleClosePop}>
                    <i className="fa-solid fa-circle-xmark"></i>
                </div>
            </div>
            <div className="mailer-pop">
                <div className="mail-card">
                    <h1>Send Reply Over Mail</h1>
                    <form>
                        <label htmlFor="">Sender:</label>
                        <input type="text" className='readOn' value="connect@codesofrohan.com" readOnly />
                        <label htmlFor="">Reciver:</label>
                        <input type="text" className='readOn' value="rohankumar.cse2020@nsec.ac.in" readOnly/>
                        <label htmlFor="">CC:</label>
                        <input type="text" placeholder='Add Emails For CC ( Optional )' />
                        <label htmlFor="">Subject:</label>
                        <input type="text" placeholder='Enter The Subject' />
                        <label htmlFor="">Content:</label>
                        <textarea name="content" id="content" placeholder='Write your mail' rows={10} ></textarea>
                        <input type="submit" value="Send Mail" />
                    </form>
                </div>
                <div className="m-f-close"onClick={handleCloseMail}><i className="fa-solid fa-circle-xmark"></i></div>
            </div>
        </>
    );
};

export default FormCard;
