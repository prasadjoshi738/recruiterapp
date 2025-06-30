import React, { useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_SERVERURL}/api/candidates`
, {
        params: { search, sortBy, order, page, limit: 5 },
      });
      setCandidates(res.data.candidates);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayed = debounce(fetchCandidates, 300);
    delayed();
    return () => delayed.cancel();
  }, [search, sortBy, order, page]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setPage(1);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Candidate Management</h2>

      <input
        type="text"
        placeholder="🔍 Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={styles.searchInput}
      />

      <div style={styles.table}>
        <div style={{ ...styles.row, ...styles.headerRow }}>
          <div onClick={() => handleSort('name')} style={styles.cell}>Name {sortBy === 'name' && (order === 'asc' ? '⬆️' : '⬇️')}</div>
          <div onClick={() => handleSort('email')} style={styles.cell}>Email {sortBy === 'email' && (order === 'asc' ? '⬆️' : '⬇️')}</div>
          <div onClick={() => handleSort('total_experience')} style={styles.cell}>Experience {sortBy === 'total_experience' && (order === 'asc' ? '⬆️' : '⬇️')}</div>
          <div style={styles.cell}>Phone</div>
          <div style={styles.cell}>Skills</div>
          <div style={styles.cell}>CTC</div>
          <div style={styles.cell}>Resume</div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : candidates.length === 0 ? (
          <div style={styles.noResults}>No candidates found.</div>
        ) : (
          candidates.map((c) => (
            <div key={c._id} style={styles.row}>
              <div style={styles.cell}>{c.name}</div>
              <div style={styles.cell}>{c.email}</div>
              <div style={styles.cell}>{c.total_experience} yrs</div>
              <div style={styles.cell}>{c.phone}</div>
              <div style={styles.cell}>{c.skills?.join(', ') || 'N/A'}</div>
              <div style={styles.cell}>
                ₹{c.current_ctc} / ₹{c.expected_ctc}
                                </div>
                                <div style={styles.cell}>
  {c.resume_url ? (
    <a
      href={`${process.env.REACT_APP_SERVERURL}${c.resume_url}`}
      target="_blank"
      rel="noreferrer"
      style={styles.link}
    >
      View
    </a>
  ) : (
    '—'
  )}
</div>
            </div>
          ))
        )}
      </div>

      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          style={styles.pageBtn}
        >
          ⬅ Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            style={{
              ...styles.pageBtn,
              backgroundColor: i + 1 === page ? '#0056b3' : '#007bff',
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          style={styles.pageBtn}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1200,
    margin: '40px auto',
    padding: 20,
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: '2rem',
    color: '#333',
  },
  searchInput: {
    padding: 10,
    width: '100%',
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 20,
    fontSize: 16,
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.6fr 1fr 1.2fr 2fr 1.2fr 0.8fr',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  headerRow: {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  cell: {
    padding: '0 10px',
    wordBreak: 'break-word',
  },
  link: {
    color: '#007bff',
    textDecoration: 'underline',
  },
  loading: {
    textAlign: 'center',
    padding: 20,
  },
  noResults: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
  },
  pagination: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  pageBtn: {
    padding: '8px 14px',
    border: 'none',
    borderRadius: 6,
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default CandidateList;
