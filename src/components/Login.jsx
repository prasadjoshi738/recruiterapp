import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 


const LoginOrg = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVERURL}/api/auth/auto-login`
, {
        email: form.email,
        password: form.password
      });

      const { token,user } = res.data;
      // console.log(user)
     
      localStorage.setItem('user', JSON.stringify(user));
       localStorage.setItem('token', token);
     const decoded = jwtDecode(token);
    const role = decoded.role;

    // console.log('Decoded Role:', role);

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'organization') navigate('/org/post-job');
      else navigate('/candidate/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Login</h2>
      {error && <p style={styles.error}>{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Login</button>

      <div style={styles.links}>
        <Link to="/org/register" style={styles.link}>Register as Organization</Link>
        <Link to="/apply" style={styles.link}>Register as Candidate</Link>
      </div>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: 8,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    padding: 12,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: 12,
    fontSize: 16,
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  links: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  }
};

export default LoginOrg;
