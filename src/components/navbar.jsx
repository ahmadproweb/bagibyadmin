import React  from 'react';
import { BiLogOutCircle } from "react-icons/bi";
import '../css/navbar.css';
import { useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": localStorage.getItem("adminToken"), 
        },
      });

      if (response.ok) {
        localStorage.removeItem("adminToken"); 
        toast.success("Logged out successfully.");
        navigate("/admin-login"); 
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      // console.error("Logout error:", error);
      toast.error(data.message);
      // toast.error("An error occurred during logout.");
    }
  };

  return (
    <nav>
      <h1>Admin Panel</h1>
          <button onClick={handleLogout}>
            Logout <BiLogOutCircle className='icons' />
          </button>
    </nav>
  );
};

export default Navbar;
