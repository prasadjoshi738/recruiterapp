import React from 'react';

const ApplicationStatus = () => {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>🚧 Page Under Construction 🚧</h1>
        <p style={styles.text}>We're working hard to bring you this feature. Stay tuned!</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
  },
  box: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '40px 60px',
    borderRadius: 15,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  title: {
    marginBottom: 20,
    fontSize: '2.5rem',
  },
  text: {
    fontSize: '1.2rem',
  },
};

export default ApplicationStatus;
