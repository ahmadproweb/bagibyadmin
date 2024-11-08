import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/Check-Admin`, {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        // console.log(data.message);
      } catch (error) {
        // console.error(error);
        toast.error(data.message);
        
        navigate('/admin-login');
      }
    };

    checkAuth();
  }, [navigate]);

  return <div>Checking Admin Authentication...</div>;
}

export default CheckAdmin;
