import React from 'react';
import './App.css';
import Form from './modules/Form/signin';
import Dashbord from './modules/dashbord/profile';
import { Routes, Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;
  const isSignInOrSignUpPage = window.location.pathname.startsWith('/user/');

  if (!isLoggedIn && auth) {
    return <Navigate to={'/user/sign_in'} />;
  } else if (isLoggedIn && isSignInOrSignUpPage) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute auth={true}>
            <Dashbord />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/sign_in'
        element={
          <ProtectedRoute>
            <Form isSignInPage={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/sign_up'
        element={
          <ProtectedRoute>
            <Form isSignInPage={false} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
