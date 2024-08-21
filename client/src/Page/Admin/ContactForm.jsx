import React, { useEffect } from 'react'
import './Style/Dashboard.css'
import DashNav from '../../Components/DashNav'
import FormCard from '../../Components/FormCard'

const ContactForm = () => {
  useEffect(() => {
    document.title = "Form Submission | TechBlog"
  },[])
  return (
    <>
    <div className="full-dashboard">
        <div className="fd-left">
          <DashNav/>
        </div>
        <div className="fd-right">
          <FormCard/>
        </div>
      </div>
    </>
  )
}

export default ContactForm