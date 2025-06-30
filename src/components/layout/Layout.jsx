// src/components/Layout.jsx
import React from 'react';
import Header from '../Header'; // Import your Header component
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
