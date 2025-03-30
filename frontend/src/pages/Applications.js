import React, { useState, useEffect} from 'react';
import Header from './Header.js';
import '../css/Applications.css';
import { FaSearch } from 'react-icons/fa';
import API_BASE_URL from "../config";
import axios from 'axios'; 

const Applications = () => {
    const [companies, setCompanies] = useState([]);
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        applicationDate: '',
        status: 'Applied',
        notes: '',
        resume: null,
        coverLetter: null
    });
    const shortenUrl = (url) => {
        try {
            const filename = url.substring(url.lastIndexOf('/') + 1);
            return decodeURIComponent(filename);
        } catch {
            return url;
        }
    };
    
    useEffect(()=>{
      const fetchCompanies = async()=>{
        try{
          const token =  localStorage.getItem("token");
          if (!token) return;
          const response = await axios.get(`${API_BASE_URL}/api/company/getCompanies`,{
            headers: {
              'Authorization': token,
            }
          })
          const data = response.data.companies;
          console.log(data)
          setCompanies(data);
          console.log(companies)
        }
        catch(err){
       console.log("Error fetching companies", err);
        }
      }
      fetchCompanies();
     }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("trying>>>>>>")
        try{
        const token = localStorage.getItem("token");
        const application = new FormData();
        application.append('companyName', formData.companyName);
        application.append('jobTitle', formData.jobTitle);
        application.append('applicationDate', formData.applicationDate);
        application.append('status', formData.status);
        application.append('notes', formData.notes);
        application.append('resume', formData.resume);
        application.append('coverLetter', formData.coverLetter)
       // setApplications([...applications, formData]);
       const response = await axios.post(`${API_BASE_URL}/api/company/application`, application,{
        headers: {
            'Authorization': token,
          }
       })
       setApplications([...applications, response.data.newApplication])
       setFormData({
        companyName: '',
        jobTitle: '',
        applicationDate: '',
        status: 'Applied',
        notes: '',
        resume: null,
        coverLetter: null
      });
      
    }catch(err){
        console.log(err);
    }
    };
    useEffect(()=>{
        const fetchApplications = async()=>{
          try{
            const token =  localStorage.getItem("token");
            if (!token) return;
            const response = await axios.get(`${API_BASE_URL}/api/company/getApplications`,{
              headers: {
                'Authorization': token,
              }
            })
            const data = response.data.applications;
            console.log(data)
            setApplications(data);
            console.log(applications)
          }
          catch(err){
         console.log("Error fetching companies", err);
          }
        }
        fetchApplications();
       }, [])

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === '' || app.status === filterStatus;
        const matchesDate = (!startDate || new Date(app.applicationDate) >= new Date(startDate)) &&
                            (!endDate || new Date(app.applicationDate) <= new Date(endDate));
        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <div className="applications-container">
            <Header />
            <div className="applications-content">
                <div className="form-section">
                    <h2>Add Job Application</h2>
                    <form onSubmit={handleSubmit}>
                    <select name="companyName" value={formData.companyName} onChange={handleChange}>
  <option value="">Select Company</option>
  {companies.map(company => (
    <option key={company.id} value={company.name}>{company.name}</option>
  ))} </select>
                        <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required />
                        <input type="date" name="applicationDate" value={formData.applicationDate} onChange={handleChange} required />
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option>Applied</option>
                            <option>Interviewed</option>
                            <option>Offered</option>
                            <option>Rejected</option>
                        </select>
                        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange}></textarea>
                        <label>Resume: <input type="file" name="resume" onChange={handleFileChange} /></label>
                        <label>Cover Letter: <input type="file" name="coverLetter" onChange={handleFileChange} /></label>
                        <button type="submit">Add Application</button>
                    </form>
                </div>
                <div className="applications-list">
                    <div className="search-filter">
                        <input type="text" placeholder="Search by company or job title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <select onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">All</option>
                            <option>Applied</option>
                            <option>Interviewed</option>
                            <option>Offered</option>
                            <option>Rejected</option>
                        </select>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
                    </div>
                  
                    <div className="cards-container">
                        {filteredApplications.map((app, index) => (
                            <div key={index} className="application-card">
                                <h3>{app.jobTitle}</h3>
                                <p><strong>Company:</strong> {app.companyName}</p>
                                <p><strong>Date:</strong> {app.applicationDate}</p>
                                <p><strong>Status:</strong> {app.status}</p>
                                <p><strong>Notes:</strong> {app.notes}</p>
                                {app.resumeUrl && (
  <p>
    <strong>Resume:</strong>{' '}
    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
      {shortenUrl(app.resumeUrl)}
    </a>
  </p>
)}
{app.coverLetterUrl && (
  <p>
    <strong>Cover Letter:</strong>{' '}
    <a href={app.coverLetterUrl} target="_blank" rel="noopener noreferrer">
      {shortenUrl(app.coverLetterUrl)}
    </a>
  </p>
)}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Applications;
