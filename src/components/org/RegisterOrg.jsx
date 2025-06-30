import React, { useState } from 'react';
import axios from 'axios';

const RegisterOrg = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    location: '',
    panNumber: '',
    contact:''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_SERVERURL}/api/orgs/register`
, form);
      setSuccess('Registration sent. Wait for admin approval.');
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        location: '',
        panNumber: '',
        contact:''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <h2 style={styles.heading}>Register Your Company</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.row}>
          <div style={styles.column}>
            <input
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="organization"
            />
            <input
              name="email"
              type="email"
              placeholder="Official Email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="email"
            />

            
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="new-password"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="new-password"
            />
          </div>

          <div style={styles.column}>
            <input
  name="contact"
  type="tel" 
  placeholder="Official Contact"
  value={form.contact} 
  onChange={handleChange}
  required
  style={styles.input}
  autoComplete="tel"
/>

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="street-address"
            />
            <input
              name="location"
              placeholder="Location (City, State)"
              value={form.location}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="address-level2"
            />
            <input
              name="panNumber"
              placeholder="PAN / TAN Number"
              value={form.panNumber}
              onChange={handleChange}
              required
              style={styles.input}
              maxLength={10}
            />
          </div>
        </div>

        <button type="submit" style={styles.button}>Register Now</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 840,
    margin: '60px auto',
    padding: 30,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #e0e7ff, #c3cfe2)',
    boxShadow: '8px 8px 15px #b1b9d6, -8px -8px 15px #ffffff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '700',
    fontSize: '1.9rem',
    color: '#3b3f58',
    letterSpacing: '0.05em',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap', // allows wrap on small screens
  },
  column: {
    flex: '1 1 45%', // grow and shrink, basis 45% width
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: 18,
    padding: '14px 16px',
    fontSize: 16,
    borderRadius: 10,
    border: '1.8px solid #a9b0d8',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9faff',
    boxShadow: 'inset 2px 2px 5px #d1d7f7, inset -2px -2px 5px #ffffff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4f46e5',
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 15px rgba(79, 70, 229, 0.4)',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  error: {
    color: '#ff4d4d',
    marginBottom: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  success: {
    color: '#3bb55c',
    marginBottom: 18,
    fontWeight: '600',
    textAlign: 'center',
  }
};

export default RegisterOrg;
