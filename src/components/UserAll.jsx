import React, { useEffect, useState } from "react";
import "../css/table.css";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";

function UserAll() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const DataFetch = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      // console.log("Admin Token:", adminToken);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/all-users-get`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
        }
      );

      // console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        // console.error("Error fetching data:", errorText);
        throw new Error(`Failed to fetch data: ${errorText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DataFetch();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log("Fetched data:", data);
  // console.log("Filtered data:", filteredData);

  return (
    <div>
      <div className="searchBtn">
        <div className="inputMain">
          <input
            type="text"
            placeholder="Search by Full Name or Email"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button>
            <IoSearch />
          </button>
        </div>
      </div>
      <h2 className="Total">Total Users {filteredData.length}</h2>
      <div className="wrapper">
        {loading ? (
          <div className="loader">Loading Users...</div>
        ) : filteredData.length === 0 ? (
          <div className="loading-data">No users found.</div>
        ) : (
          <div className="table">
            <div className="row header">
              <div className="cell">User Id</div>
              <div className="cell">Full Name</div>
              <div className="cell">Email</div>
              <div className="cell">Verified</div>
              <div className="cell">Created At</div>
            </div>
            {filteredData.map((item, index) => (
              <div className="row" key={index}>
                <div className="cell" data-title="User Id">
                  {item._id}
                </div>
                <div className="cell" data-title="Full Name">
                  {item.fullName}
                </div>
                <div className="cell" data-title="Email">
                  {item.email}
                </div>
                <div className="cell" data-title="Verified">
                  {item.isVerified ? "Yes" : "No"}
                </div>
                <div className="cell">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAll;
