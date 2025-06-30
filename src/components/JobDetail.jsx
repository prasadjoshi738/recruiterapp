import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyHover, setApplyHover] = useState(false);
  const [role, setRole] = useState('');

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const statusOptions = [
    'applied',
    'shortlisted',
    'interview invited',
    'selected',
    
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error('Token decode failed', err);
      }
    }

    const fetchJob = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVERURL}/api/jobs/${id}`
);
        setJob(res.data);
      } catch (err) {
        setError('Failed to load job');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      if (!user?.email || !job?._id) {
        alert("Invalid user or job ID.");
        return;
      }

      await axios.post(`${process.env.REACT_APP_SERVERURL}/api/jobs/updatestatus`
, {
        jobId: job._id,
        email: user.email,
        status: 'applied'
      });

      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Apply failed:', err);
      alert('Failed to apply. Try again.');
    }
  };

  const handleStatusChange = async (email, newStatus) => {
    try {
      await axios.post(`${process.env.REACT_APP_SERVERURL}/api/jobs/updatestatus`
, {
        jobId: job._id,
        email,
        status: newStatus,
      });

      setJob(prev => {
        const updatedStatus = prev.status.map(entry =>
          entry.email === email ? { ...entry, status: newStatus } : entry
        );
        return { ...prev, status: updatedStatus };
      });

      alert(`Status updated to "${newStatus}" for ${email}`);
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  if (loading) return <p style={infoStyle}>Loading job...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;
  if (!job) return <p style={infoStyle}>Job not found.</p>;

  return (
    <div style={containerStyle}>
      {/* Left section: Job Details */}
      <div style={leftSectionStyle}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
        <h2 style={titleStyle}>{job.title}</h2>
        <p style={meta}><strong>Department:</strong> {job.department}</p>
        <p style={meta}><strong>Experience:</strong> {job.experience} years</p>
        <p style={meta}><strong>Budget:</strong> ₹{job.budget}</p>
        <p style={meta}><strong>Location:</strong> {job.location}</p>

        <div style={{ marginTop: 15 }}>
          <strong>Skills:</strong>
          <div style={skillWrapper}>
            {job.skills.map((skill, idx) => (
              <span key={idx} style={skillBadge}>{skill}</span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 25 }}>
          <strong>Description:</strong>
          <p style={{ marginTop: 8, lineHeight: '1.6' }}>{job.description}</p>
        </div>

        {role === 'candidate' && job.organizationname && (
          <div style={{ marginTop: '25px' }}>
            <strong>About Organization:</strong>
            <p><strong>Name:</strong> {job.organizationname}</p>
            <p><strong>Email:</strong> {job.organizationemail}</p>
            <p><strong>Phone:</strong> {job.organizationcontact}</p>
          </div>
        )}

        {role === 'candidate' && (
          <button
            style={{
              ...buttonStyle,
              ...(applyHover ? buttonHoverStyle : {})
            }}
            onMouseEnter={() => setApplyHover(true)}
            onMouseLeave={() => setApplyHover(false)}
            onClick={handleApply}
          >
            Apply
          </button>
        )}
      </div>

      {/* Right section: Applicant Statuses (for organizations only) */}
      {role === 'organization' && (
        <div style={rightSectionStyle}>
          <h3 style={{ marginBottom: '15px' }}>
            Applicants: {job.status?.length || 0}
          </h3>
          {job.status?.length > 0 ? (
            job.status.map((entry, index) => (
              <div key={index} style={statusCardStyle}>
                <p><strong>Email:</strong> {entry.email}</p>
                
                <p>
                  <strong>Status:</strong>{' '}
                  <select
                    value={entry.status}
                    onChange={(e) => handleStatusChange(entry.email, e.target.value)}
                    style={selectStyle}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              No applicants yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetail;

// ----------------- Styles -----------------
const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '30px',
  padding: '30px',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  backgroundColor: '#f0f2f5',
  minHeight: '100vh',
};

const leftSectionStyle = {
  flex: 3,
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
};

const rightSectionStyle = {
  flex: 1,
  backgroundColor: '#fafafa',
  padding: '25px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.07)',
  maxHeight: '600px',
  overflowY: 'auto',
};

const statusCardStyle = {
  backgroundColor: '#fff',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '18px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
};

const statusBadge = (status) => ({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '14px',
  backgroundColor:
    status === 'applied' ? '#007bff' :
    status === 'shortlisted' ? '#ffc107' :
    status === 'interview invited' ? '#17a2b8' :
    status === 'selected' ? '#28a745' :
    '#6c757d',
  color: 'white',
  fontWeight: '600',
  textTransform: 'capitalize',
});

const titleStyle = {
  fontSize: '2.25rem',
  marginBottom: '15px',
  color: '#0056b3',
  fontWeight: '700',
};

const meta = {
  fontSize: '1.1rem',
  marginBottom: '8px',
  color: '#444',
};

const skillWrapper = {
  marginTop: '12px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

const skillBadge = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '7px 15px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: '600',
  boxShadow: '0 2px 6px rgba(0, 123, 255, 0.5)',
};

const infoStyle = {
  textAlign: 'center',
  marginTop: '60px',
  fontSize: '1.2rem',
  color: '#666',
};

const errorStyle = {
  textAlign: 'center',
  marginTop: '60px',
  fontSize: '1.2rem',
  color: '#d9534f',
};

const backBtn = {
  background: 'none',
  border: 'none',
  color: '#007bff',
  fontSize: '1.1rem',
  marginBottom: '25px',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const buttonStyle = {
  marginTop: '35px',
  padding: '14px 28px',
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#28a745',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.5)',
};

const buttonHoverStyle = {
  backgroundColor: '#1e7e34',
};

const selectStyle = {
  padding: '7px 12px',
  borderRadius: '8px',
  border: '1.5px solid #ccc',
  fontSize: '1rem',
  fontWeight: '600',
  color: '#333',
  cursor: 'pointer',
  outline: 'none',
  backgroundColor: '#fff',
  transition: 'border-color 0.2s ease',
};
