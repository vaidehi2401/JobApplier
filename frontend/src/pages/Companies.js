import React, { useEffect, useState } from 'react';
import './Companies.css';
import Header from './Header.js'
import axios from 'axios'; 
import API_BASE_URL from "../config";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [companyJobs, setCompanyJobs] = useState({});

  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    size: '',
    contact: '',
    notes: ''
  });
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
 }, [companies])
  const [jobForm, setJobForm] = useState({
    companyName: '',
    title: '',
    description: '',
    notes: '',
    applyBy: '',
    status: 'saved'
  });
  
  const [expandedCompany, setExpandedCompany] = useState(null);

  const handleCompanyChange = (e) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  };

  const handleJobChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const addCompany = async() => {
    const token = localStorage.getItem("token");
    setCompanyForm({ name: '', industry: '', size: '', contact: '', notes: '' });
  try{
 const newCompany = await axios.post(`${API_BASE_URL}/api/company/companyInfo`, companyForm, {
  headers: {
    'Authorization': token,
  }
})
console.log(newCompany)
setCompanies([...companies, newCompany]);
}
  catch(error){
 console.log("Error creating company info", error)
  }
  };
  
  
  const addJob = async() => {
    const token = localStorage.getItem("token");
    setJobForm({ companyId: '', title: '', description: '', link: '', notes: '', applyBy: '', status: 'saved' });
    try{
      const newListing = await axios.post(`${API_BASE_URL}/api/company/jobListing`, jobForm, {
        headers: {
          'Authorization': token,
        }
      })
      console.log(newListing)
    }
    catch(error){
      console.log("error creating job listing", error)
    }
  };

  const toggleCompany = async (id) => {
    const token = localStorage.getItem("token");
  
    if (expandedCompany === id) {
      // Collapse if already open
      setExpandedCompany(null);
      return;
    }
  
    setExpandedCompany(id);
  
    // Only fetch if not already fetched
    if (!companyJobs[id]) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/company/jobListings/${id}`, {
          headers: {
            'Authorization': token,
          }
        });
        setCompanyJobs(prev => ({
          ...prev,
          [id]: response.data.jobListings // assuming response contains jobs array
        }));
      } catch (error) {
        console.error("Error fetching job listings", error);
      }
    }
  };
  
  const statusColors = {
    saved: 'gray',
    applied: 'blue',
    interviewed: 'orange',
    offered: 'green',
    rejected: 'red'
  };

  return (
    
        <div className="companies-page">
        <Header/>
      
          <div className="forms-container">
            <div className="form-section">
              <h2>Add Company</h2>
              <input name="name" placeholder="Company Name" value={companyForm.name} onChange={handleCompanyChange} />
              <input name="industry" placeholder="Industry" value={companyForm.industry} onChange={handleCompanyChange} />
              <select name="size" value={companyForm.size} onChange={handleCompanyChange}>
                <option value="">Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <input name="contact" placeholder="Contact Info" value={companyForm.contact} onChange={handleCompanyChange} />
              <input name="notes" placeholder="Notes" value={companyForm.notes} onChange={handleCompanyChange} />
              <button onClick={addCompany}>Save Company</button>
            </div>
      
            <div className="form-section">
              <h2>Add Job Listing</h2>
              <select name="companyName" value={jobForm.companyName} onChange={handleJobChange}>
  <option value="">Select Company</option>
  {companies.map(company => (
    <option key={company.id} value={company.name}>{company.name}</option>
  ))}
</select>
              <input name="title" placeholder="Job Title" value={jobForm.title} onChange={handleJobChange} />
              <input name="description" placeholder="Description" value={jobForm.description} onChange={handleJobChange} />
          
              
  <input
    type="date"
    name="applyBy"
    value={jobForm.applyBy}
    onChange={handleJobChange}
  />



              <select name="status" value={jobForm.status} onChange={handleJobChange}>
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
              <input name="notes" placeholder="Notes" value={jobForm.notes} onChange={handleJobChange} />
              <button onClick={addJob}>Save Job Listing</button>
            </div>
          </div>
      
          <div className="companies-list">
            <h2>Companies & Job Listings</h2>
            {companies.map(company => (
              <div key={company.id} className="company-card">
                <div className="company-header" onClick={() => toggleCompany(company.id)}>
                  <h3>{company.name}</h3>
                  <span>{company.industry} • {company.size}</span>
                  <p>{company.contact}</p>
                  <p>{company.notes}</p>
                </div>
                {expandedCompany === company.id && companyJobs[company.id] && (
  <div className="job-listing-container">
 {companyJobs[company.id].length === 0 ? (
      <p>No job listings available</p>
    ) : 
   (companyJobs[company.id].map(job => (
      <div key={job.id} className="job-listing">
        <h4>{job.title}</h4>
        <p>{job.description}</p>
        <p>Apply By: {job.applyBy ? new Date(job.applyBy).toLocaleDateString() : 'N/A'}</p>
        <p className={`status-tag status-${job.status}`}>{job.status}</p>
        {job.notes && <p><strong>Notes:</strong> {job.notes}</p>}
      </div>
    )))}
   
  </div>
)}


              
              </div>
            ))}
          </div>
        </div>
      );
      
  
};

export default Companies;
