import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminVerify from "./components/AdminVerify";
import AdminRegister from "./components/AdminRegister";
import Home from "./components/Home";
import { Toaster } from 'react-hot-toast';

function App() {

const PrivateRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');

  return adminToken ? children : <Navigate to="/admin-login" />;
};
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-verify" element={<AdminVerify />} />
          <Route path="/admin-sign-up" element={<AdminRegister />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          /> 
        </Routes>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              top: '10px'
            },
          }}
        />
      </Router>
    </>
  );
}

export default App;
