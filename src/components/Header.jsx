import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Header = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

     const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error('Token decode failed', err);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    navigate('/'); // redirect to login page
  };

  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>
  Welcome , {user.name.split(' ')[0]} 
</h2>
      <nav style={styles.nav}>
        {!role && (
          <>
            <Link to="/" style={styles.link}>Login</Link>
            
          </>
        )}

        {role === 'admin' && (
          <>
            <Link to="/admin/dashboard" style={styles.link}>Admin Dashboard</Link>
            <Link to="/admin/candidates" style={styles.link}>Candidate List</Link>


            
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        )}

        {role === 'organization' && (
          <>
            <Link to="/org/post-job" style={styles.link}>Post Job</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        )}

        {role === 'candidate' && (
          <>
            <Link to="/applicationstatus" style={styles.link}>Application Status</Link>
            <Link to="/candidate/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  logo: {
    margin: 0,
  },
  nav: {
    display: 'flex',
    gap: '15px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 500,
  },
  button: {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default Header;
