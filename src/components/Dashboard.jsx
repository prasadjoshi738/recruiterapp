import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CandidateTable from './CandidateTable';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchCandidates = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVERURL}/api/candidates?search=${search}&page=${page}&limit=5`
);
    setCandidates(res.data.candidates);
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, page]);

  return (
    <div>
      <h2>HR Dashboard</h2>
      <input
        placeholder="Search by name or email"
        onChange={e => setSearch(e.target.value)}
      />
      <CandidateTable candidates={candidates} />
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
};

export default Dashboard;
