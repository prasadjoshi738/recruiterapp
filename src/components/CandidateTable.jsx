import React from 'react';

const CandidateTable = ({ candidates }) => {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Phone</th><th>Address</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((c, i) => (
          <tr key={i}>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>{c.address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CandidateTable;
