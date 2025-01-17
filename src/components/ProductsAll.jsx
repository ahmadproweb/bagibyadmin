import React, { useState } from "react";
import "../css/accountStyle.css";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import "../css/order.css";
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const AllAccount = ({ products, setProducts, loading }) => {
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);

  const handleDelete = async (productId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(
        `${VITE_BASE_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "x-admin-token": adminToken,
          },
        }
      );

      if (response.ok) {
        toast.success("Product deleted successfully");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const toggleUpdateForm = (product) => {
    setSelectedProduct(product);
    setIsUpdateFormVisible(!isUpdateFormVisible);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product._id &&
        product._id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleThumbnailClick = (thumbnail) => {
    setFullscreenImage(thumbnail.thumbnailImage[0]);
    setThumbnailImages(thumbnail.images);
    document.body.classList.add("no-scroll");
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
    setThumbnailImages([]);
    document.body.classList.remove("no-scroll");
  };

  const handleRowImageClick = (image) => {
    setFullscreenImage(image);
  };

  return (
    <>
      <div className="searchBtn">
        <div className="inputMain">
          <input
            type="text"
            placeholder="Search by Product Title, ID, or Filter"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button>
            <IoSearch />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="loader">Loading Products...</div>
      ) : (
        <>
          <div className="orders-container">
            <h2>Total Orders {filteredData.length}</h2>
            {filteredData.length === 0 ? (
              <p>No orders available</p>
            ) : (
              <div className="order-table">
                {filteredData.map((product) => (
                  <div className="order-card" key={product._id}>
                    <div className="product-data">
                      <h3>Product ID: {product._id}</h3>
                   
                      <p>
                        <strong>Title:</strong> {product.title}
                      </p>
                      <p>
                        <strong>Main Price:</strong> {product.mainPrice}
                      </p>
                      <p>
                        <strong>Discount Price:</strong> {product.discountPrice}
                      </p>
                      <p>
                        <strong>Stars:</strong>{" "}
                        {product.star}
                      </p>
                      <p>
                        <strong>Home Page :</strong> {product.homeProduct}
                      </p>
                      <p>
                        <strong>Description:</strong> {product.description}
                      </p>
                    </div>

                    <div className="product-image">
                      <div className="product-inner">
                        <h4>Main 👇</h4>

                        <img
                          className="main-image"
                          src={product.mainImage}
                          alt="Main"
                          onClick={() => setFullscreenImage(product.mainImage)}
                        />
                      </div>

                      <div className="product-inner">
                        <h4>Thumbnails 👇</h4>
                        <div className="thumbnail-links">
                          {product.thumbnails.map((thumbnail, index) => (
                            <img
                              src={thumbnail.thumbnailImage[0]}
                              alt={`Thumbnail ${index + 1}`}
                              key={index}
                              onClick={() => handleThumbnailClick(thumbnail)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="last">
                      <strong>Created At:</strong>{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                    <strong
                      className="delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </strong>
                  </div>
                ))}
              </div>
            )}

            {fullscreenImage && (
              <div
                className="fullscreen-overlay"
                onClick={closeFullscreenImage}
              >
                <img src={fullscreenImage} alt="Fullscreen" />
                <div className="thumbnail-row">
                  {thumbnailImages.map((image, index) => (
                    <img
                      src={image}
                      alt={`Related Image ${index + 1}`}
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowImageClick(image);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {isUpdateFormVisible && selectedProduct && (
        <>
          <div className="overlay" onClick={() => toggleUpdateForm(null)}></div>
          <div className="popup">
            <UpdateForm
              account={selectedProduct}
              onClose={() => setIsUpdateFormVisible(false)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AllAccount;
