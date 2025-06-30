// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components

import Layout from './components/layout/Layout'; // New layout component

// Candidate Views
import CandidateForm from './components/CandidateForm';

// Organization Views
import RegisterOrg from './components/org/RegisterOrg';
import Login from './components/Login';
import PostJob from './components/org/PostJob';
import JobDetail from './components/JobDetail';

// Admin Views
import AdminDashboard from './components/admin/AdminDashboard';
import JobsList from './components/JobList';
import CandidateList from './components/CandidateList';
import ApplicationStatus from './components/ApplicationStatus';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route without header (optional) */}
        <Route path="/" element={<Login />} />

        {/* Routes with shared header */}
        <Route element={<Layout />}>
          {/* Candidate form */}
          <Route path="/apply" element={<CandidateForm />} />

          {/* Organization routes */}
          <Route path="/org/register" element={<RegisterOrg />} />
          <Route path="/org/post-job" element={<PostJob />} />
          <Route path="/jobs/edit/:id" element={<PostJob />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Candidate dashboard */}
          <Route path="/candidate/dashboard" element={<JobsList />} />

          {/* Admin dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/candidates" element={<CandidateList />} />
          <Route path="/applicationstatus" element={<ApplicationStatus />} />

          {/* 404 fallback inside layout */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
