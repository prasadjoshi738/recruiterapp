import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '',
    cover_letter: '', current_ctc: '', expected_ctc: '',
    notice_period: '', skills: '', total_experience: '', relevant_experience: ''
  });

  const [resume, setResume] = useState(null);
   const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (resume) data.append('resume', resume);

    try {
      await axios.post(`${process.env.REACT_APP_SERVERURL}/api/candidates`
, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Submitted!');
      navigate(`/`)
      
    } catch (error) {
      alert('Error submitting candidate');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" style={formStyle}>
      <h2 style={headingStyle}>🚀 Apply for a Job</h2>

      <div style={gridStyle}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
        <input name="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required style={inputStyle} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required style={inputStyle} />
        <input name="address" placeholder="Address" onChange={handleChange} required style={inputStyle} />
        <input name="current_ctc" placeholder="Current CTC (₹)" type="number" onChange={handleChange} style={inputStyle} />
        <input name="expected_ctc" placeholder="Expected CTC (₹)" type="number" onChange={handleChange} style={inputStyle} />
        <input name="notice_period" placeholder="Notice Period (e.g. 30 days)" onChange={handleChange} style={inputStyle} />
        <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} style={inputStyle} />
        <input name="total_experience" placeholder="Total Experience (in years)" type="number" onChange={handleChange} style={inputStyle} />
        <input name="relevant_experience" placeholder="Relevant Experience (in years)" type="number" onChange={handleChange} style={inputStyle} />
      </div>

      <textarea
        name="cover_letter"
        placeholder="Cover Letter"
        onChange={handleChange}
        required
        style={textAreaStyle}
      />

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Upload Resume:</label>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" required style={fileStyle} />
      </div>

      <button type="submit" style={buttonStyle}>Submit Application</button>
    </form>
  );
};

// ---------- Styles ----------

const formStyle = {
  maxWidth: '750px',
  margin: '50px auto',
  padding: '30px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  fontFamily: 'Segoe UI, sans-serif',
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '25px',
  color: '#333',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px',
  marginBottom: '20px',
};

const inputStyle = {
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '15px',
  transition: 'border 0.3s',
};

const textAreaStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '15px',
  minHeight: '100px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  resize: 'vertical',
  marginBottom: '20px',
};

const fileStyle = {
  marginTop: '10px',
  fontSize: '14px',
};

const buttonStyle = {
  width: '100%',
  padding: '14px',
  fontSize: '16px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default CandidateForm;
