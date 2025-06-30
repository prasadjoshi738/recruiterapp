import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminDashboard = () => {
  const [orgs, setOrgs] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/');
      }
    } catch (err) {
      console.error('Invalid token:', err);
      navigate('/');
    }
  }, [navigate]);

  const fetchOrgs = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVERURL}/api/orgs`);

    setOrgs(res.data);
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const toggleApproval = async (id, currentStatus) => {
    await axios.put(`${process.env.REACT_APP_SERVERURL}/api/orgs/approve/${id}`, {
      isApproved: !currentStatus,
    });
    fetchOrgs();
  };

  const filteredOrgs = orgs.filter((org) => {
    if (filter === 'approved') return org.isApproved;
    if (filter === 'unapproved') return !org.isApproved;
    return true; // all
  });

  const approvedCount = orgs.filter((org) => org.isApproved).length;
  const unapprovedCount = orgs.filter((org) => !org.isApproved).length;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9fb',
        borderRadius: 8,
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: 10,
          color: '#333',
          fontWeight: '700',
          fontSize: '2rem',
          letterSpacing: '1.2px',
        }}
      >
        Organizations Management
      </h2>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ margin: '0 15px', fontWeight: 500 }}>
          ✅ Approved: {approvedCount}
        </span>
        <span style={{ margin: '0 15px', fontWeight: 500 }}>
          ⛔ Unapproved: {unapprovedCount}
        </span>
        <span style={{ margin: '0 15px', fontWeight: 500 }}>
          📦 Total: {orgs.length}
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 25 }}>
        <button
          onClick={() => setFilter('all')}
          style={buttonStyle(filter === 'all')}
        >
          All
        </button>
        <button
          onClick={() => setFilter('approved')}
          style={buttonStyle(filter === 'approved')}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('unapproved')}
          style={buttonStyle(filter === 'unapproved')}
        >
          Unapproved
        </button>
      </div>

      {filteredOrgs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>No organizations found.</p>
      ) : (
        filteredOrgs.map((org) => (
          <div
            key={org._id}
            style={{
              backgroundColor: '#fff',
              padding: '15px 25px',
              marginBottom: 15,
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'background-color 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f4ff')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <div style={{ marginBottom: 10 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>
                {org.name}
              </p>
              <p style={{ margin: '4px 0', color: '#555', fontSize: '0.95rem' }}>
                📧 <strong>Email:</strong> {org.email}
              </p>
              <p style={{ margin: '4px 0', color: '#555', fontSize: '0.95rem' }}>
                📍 <strong>Address:</strong> {org.address}, {org.location}
              </p>
              <p style={{ margin: '4px 0', color: '#555', fontSize: '0.95rem' }}>
                🧾 <strong>PAN:</strong> {org.panNumber}
              </p>
              
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 20,
                  backgroundColor: org.isApproved ? '#d4edda' : '#f8d7da',
                  color: org.isApproved ? '#155724' : '#721c24',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  userSelect: 'none',
                  boxShadow: org.isApproved
                    ? '0 0 8px #c3e6cb'
                    : '0 0 8px #f5c6cb',
                }}
              >
                {org.isApproved ? 'Approved' : 'Pending'}
              </span>

              <button
                onClick={() => toggleApproval(org._id, org.isApproved)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: org.isApproved ? '#dc3545' : '#28a745',
                  border: 'none',
                  borderRadius: 5,
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: org.isApproved
                    ? '0 4px 8px rgba(220,53,69,0.4)'
                    : '0 4px 8px rgba(40,167,69,0.4)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = org.isApproved
                    ? '#c82333'
                    : '#218838')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = org.isApproved
                    ? '#dc3545'
                    : '#28a745')
                }
              >
                {org.isApproved ? 'Unapprove' : 'Approve'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const buttonStyle = (active) => ({
  margin: '0 5px',
  padding: '8px 16px',
  borderRadius: 5,
  border: '1px solid #ccc',
  backgroundColor: active ? '#007bff' : '#fff',
  color: active ? '#fff' : '#007bff',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.2s ease',
});

export default AdminDashboard;
