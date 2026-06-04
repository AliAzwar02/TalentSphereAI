import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';

const RedirectRoute = () => {
  const user = useSelector((state) => state.auth.user);

  if (user) {
    return user.role === 'recruiter' ? (
      <Navigate to="/recruiter/dashboard" />
    ) : (
      <Navigate to="/applicant/dashboard" />
    );
  }

  return <Home />;
};

export default RedirectRoute;
