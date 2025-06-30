import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const styles = {
  container: {
    display: 'grid',
    gap: '1.5rem',
    padding: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgb(0 0 0 / 0.1)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  title: {
    marginTop: 0,
    marginBottom: '0.5rem',
    fontSize: '1.25rem',
    color: '#333',
  },
  text: {
    margin: '0.3rem 0',
    color: '#555',
    fontSize: '0.95rem',
  },
  postedDate: {
    fontStyle: 'italic',
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '1rem',
  },
  buttons: {
    marginTop: '1.25rem',
    display: 'flex',
    gap: '0.8rem',
  },
  btn: {
    flex: 1,
    padding: '0.5rem 0',
    fontWeight: 600,
    borderRadius: '6px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.25s ease',
    fontSize: '1rem',
    color: 'white',
  },
  viewJD: {
    backgroundColor: '#007bff',
  },
  viewJDHover: {
    backgroundColor: '#0056b3',
  },
  quickApply: {
    backgroundColor: '#28a745',
  },
  quickApplyHover: {
    backgroundColor: '#1e7e34',
  },
};

const JobCard = ({ job }) => {
  const [hover, setHover] = useState(false);
  const [viewHover, setViewHover] = useState(false);
  const [applyHover, setApplyHover] = useState(false);
  const navigate = useNavigate();


  
  const {
    title,
    department,
    location,
    experience,
    skills,
    budget,
    posted_date,
  } = job;

  const formattedDate = new Date(posted_date).toLocaleDateString();

  return (
    <div
      style={{
        ...styles.card,
        ...(hover ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.text}><strong>Department:</strong> {department || 'N/A'}</p>
      <p style={styles.text}><strong>Location:</strong> {location || 'Remote'}</p>
      <p style={styles.text}><strong>Experience:</strong> {experience}</p>
      <p style={styles.text}><strong>Skills:</strong> {skills.join(', ')}</p>
      <p style={styles.text}><strong>Budget:</strong> ${budget}</p>
      <p style={styles.postedDate}>Posted: {formattedDate}</p>

      <div style={styles.buttons}>
        <button
          style={{
            ...styles.btn,
            ...styles.viewJD,
            ...(viewHover ? styles.viewJDHover : {}),
          }}
          onMouseEnter={() => setViewHover(true)}
          onMouseLeave={() => setViewHover(false)}
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          View JD
        </button>
        <button
          style={{
            ...styles.btn,
            ...styles.quickApply,
            ...(applyHover ? styles.quickApplyHover : {}),
          }}
          onMouseEnter={() => setApplyHover(true)}
          onMouseLeave={() => setApplyHover(false)}
          onClick={() => alert(`Quick apply for: ${title}`)}
        >
          Quick Apply
        </button>
      </div>
    </div>
  );
};

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Later in JobList.jsx or any other file
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;


 useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
   },[])
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token'); // get token from localStorage
        if (!token) {
          setLoading(false);
          return; // optionally handle unauthorized state here
        }

        const res = await axios.get(`${process.env.REACT_APP_SERVERURL}/api/jobs`
, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(res.data);
        console.log(res.data)
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (!jobs.length) return <p>No jobs found.</p>;

  return (
    <div style={styles.container}>
      {jobs.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobsList;
