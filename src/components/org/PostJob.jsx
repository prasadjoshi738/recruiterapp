import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


const PostJob = () => {
  const [job, setJob] = useState({
    title: '',
    description: '',
    department: '',
    experience: '0-1',
    budget: '',
    skills: '',
    location: '',
  organizationname:'',
organizationemail:'',
organizationcontact:''
  });

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from route
  const isEditing = Boolean(id); // Check if in edit mode
   const userStr = localStorage.getItem('user');
const org = userStr ? JSON.parse(userStr) : null;
console.log(org.name);



  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== 'organization') {
          navigate('/');
        }
      } catch (err) {
        console.error('Invalid token:', err);
        navigate('/');
      }
    }, [navigate]);
  const handleChange = (e) => {
    setJob((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
     const res = await axios.post(
  `${process.env.REACT_APP_SERVERURL}/api/jobs/jobsbyorg`,
                { organizationname: org.name },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const fetchJobForEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get( `${process.env.REACT_APP_SERVERURL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setJob({
        ...data,
        skills: data.skills.join(', ')
      });
    } catch (err) {
      console.error('Failed to fetch job for edit', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const jobData = {
      ...job,
      skills: job.skills.split(',').map((s) => s.trim()),
      organizationname:org.name,
organizationemail:org.email,
organizationcontact:org.contact

    };

    try {
      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_SERVERURL}/api/jobs/${id}`
, jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Job updated!');
      } else {
        console.log(jobData)
        await axios.post(`${process.env.REACT_APP_SERVERURL}/api/jobs`
, jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Job posted!');
      }

      setJob({
        title: '',
        description: '',
        department: '',
        experience: '0-1',
        budget: '',
        skills: '',
        location: '',
        
organizationname:org.name,
organizationemail:org.email,
organizationcontact:org.contact

        
      });

      fetchJobs();
      navigate('/org/post-job');
    } catch (err) {
      console.error(err);
      alert('Failed to submit job');
    }
  };

  const handleDelete = async (jobId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_SERVERURL}/api/jobs/${jobId}`
, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  useEffect(() => {
    if (isEditing) fetchJobForEdit();
    fetchJobs();
  }, [id]);

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3 style={{ textAlign: 'center' }}>{isEditing ? 'Update Job' : 'Post New Job'}</h3>

        <input name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required style={inputStyle} />
        <input name="department" placeholder="Department" value={job.department} onChange={handleChange} style={inputStyle} />
        <input name="location" placeholder="Location" value={job.location} onChange={handleChange} required style={inputStyle} />

        <select name="experience" value={job.experience} onChange={handleChange} style={inputStyle}>
          <option value="0-1">0-1 Years</option>
          <option value="1-2">1-2 Years</option>
          <option value="2-5">2-5 Years</option>
          <option value="5-8">5-8 Years</option>
          <option value="8+">8+ Years</option>
        </select>

        <input name="budget" placeholder="Budget (INR)" type="number" value={job.budget} onChange={handleChange} required style={inputStyle} />
        <input name="skills" placeholder="Skills (comma separated)" value={job.skills} onChange={handleChange} required style={inputStyle} />
        <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />

        <button type="submit" style={buttonStyle}>{isEditing ? 'Update Job' : 'Post Job'}</button>
      </form>

      {!isEditing && (
        <div style={sidebarStyle}>
          <h4>Your Posted Jobs ({jobs.length})</h4>
          {jobs.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#777' }}>No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} style={jobItemStyle} onClick={(e)=>{navigate(`/jobs/${job._id}`);}} >
                <strong
                  style={{ cursor: 'pointer', color: '#007bff' }}
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  {job.title}
                </strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>{job.department}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>{job.experience} yrs • ₹{job.budget}</p>
                <button onClick={() => navigate(`/jobs/edit/${job._id}`)} style={editBtn}>Edit</button>
                <button onClick={() => handleDelete(job._id)} style={deleteBtn}>Delete</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// 🔧 Styling
const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '30px',
  maxWidth: '1100px',
  margin: '40px auto',
  padding: '0 20px',
  alignItems: 'flex-start',
};

const formStyle = {
  flex: 2,
  padding: 20,
  background: '#f7f7f7',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
};

const sidebarStyle = {
  flex: 1,
  background: '#f1f1f1',
  padding: 15,
  borderRadius: 6,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const inputStyle = {
  marginBottom: 15,
  padding: 10,
  fontSize: 16,
  borderRadius: 4,
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: 12,
  fontSize: 16,
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
};

const deleteBtn = {
  marginTop: 5,
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  padding: '5px 10px',
  borderRadius: 4,
  fontSize: 12,
  cursor: 'pointer',
  marginRight: 5
};

const editBtn = {
  marginTop: 5,
  background: '#ffc107',
  color: '#000',
  border: 'none',
  padding: '5px 10px',
  borderRadius: 4,
  fontSize: 12,
  cursor: 'pointer',
};

const jobItemStyle = {
  background: '#fff',
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  curser:"pointer"
};

export default PostJob;
