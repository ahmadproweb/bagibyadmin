import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import "../css/accountStyle.css";
import PopForm from "./popForm";
import AllAccount from "./ProductsAll";

const Products = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const togglePopup = () => {
    setIsPopupVisible((prev) => !prev);
  };

  const updateProducts = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/products`);
        const data = await response.json();
        // console.log("Fetched products:", data);
      toast.error(data.message);


        setProducts(data);
      } catch (error) {
        // console.error("Failed to fetch products:", error);
      toast.error(data.message);

      }finally{
        setLoading(false);  
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (isPopupVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isPopupVisible]);

  return (
    <div className="youtube">
      <div className="searchBtn">
        <button className="btn2" onClick={togglePopup}>
          Add Account
          <IoMdAdd />
        </button>
      </div>
      {isPopupVisible && (
        <>
          <div className="overlay" onClick={togglePopup}></div>
          <div className="popup">
            <PopForm togglePopup={togglePopup} updateProducts={updateProducts} />
          </div>
        </>
      )}
    <AllAccount products={products} loading={loading} setProducts={setProducts} />

    </div>
  );
};

export default Products;
