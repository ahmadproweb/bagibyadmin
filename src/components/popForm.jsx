import React, { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import toast from "react-hot-toast";
import "../css/accountStyle.css";

const API_URL = import.meta.env.VITE_BASE_URL;

const PopForm = ({ togglePopup, updateProducts }) => {
  const [formData, setFormData] = useState({
    title: "",
    homeProduct: "",
    mainPrice: "",
    star: "",
    fakeSold: "",
    discountPrice: "",
    description: "",
    filterProducts: "",
  });
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [thumbnailImages, setThumbnailImages] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleThumbnailsChange = (e) => {
    setThumbnails(Array.from(e.target.files));
  };

  const handleThumbnailImagesChange = (index, e) => {
    setThumbnailImages({
      ...thumbnailImages,
      [`images_thumbnail${index + 1}`]: Array.from(e.target.files),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const data = new FormData();
    data.append("homeProduct", formData.homeProduct);
    data.append("title", formData.title);
    data.append("filterProducts", formData.filterProducts);
    data.append("mainPrice", formData.mainPrice);
    data.append("star", formData.star);
    data.append("fakeSold", formData.fakeSold);
    data.append("discountPrice", formData.discountPrice);
    data.append("description", formData.description);
    if (mainImage) {
      data.append("mainImage", mainImage);
    } else {
      // console.error('Main image is missing');
      toast.error('Main image is missing');
      setLoading(false);
      return;
    }
  
    thumbnails.forEach((thumbnail, index) => {
      data.append("thumbnails", thumbnail);
    });
  
    Object.keys(thumbnailImages).forEach((key) => {
      thumbnailImages[key].forEach((img) => {
        data.append(key, img);
      });
    });
  
    const adminToken = localStorage.getItem("adminToken");
  
    try {
      const response = await fetch(`${API_URL}/api/products/create`, {
        method: "POST",
        headers: {
          "x-admin-token": adminToken,
        },
        body: data,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Product creation failed');
      }
  
      const result = await response.json();
      toast.success("Product created successfully!");
  
      setFormData({
        homeProduct: "",
        title: "",
        filterProducts: "",
        mainPrice: "",
        star: "",
        fakeSold: "",
        discountPrice: "",
        description: "",
      });
      setMainImage(null);
      setThumbnails([]);
      setThumbnailImages({});
      updateProducts(result);
      togglePopup();
    } catch (error) {
      // console.error("Error:", error);
      toast.error(`Failed to create product. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="youtubeFormFill">
        <h1>Create Products</h1>
        <RxCrossCircled className="CrossIcons" onClick={togglePopup} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputYoutube">
          <label>Home:</label>
          <input
            type="text"
            name="homeProduct"
            value={formData.homeProduct}
            onChange={handleInputChange}
            placeholder="Enter Yes or No Only"
            required
          />
        </div>
        <div className="inputYoutube">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter product title"
            required
          />
        </div>
        <div className="inputYoutube">
          <label>Filter Products:</label>
          <select
            name="filterProducts"
            value={formData.filterProducts}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            <option value="hand bags">hand bags</option>
            <option value="laptop bags">laptop bags</option>
            <option value="canvas bags">canvas bags</option>
            <option value="back packs">back packs</option>
            <option value="phone pouch">phone pouch</option>
            <option value="Vegas Blue">Vegas Blue</option>
            <option value="clutch">clutch</option>
            <option value="tote bags">tote bags</option>
            <option value="cross body">cross body</option>
            <option value="shoulder bags">shoulder bags</option>
            <option value="chain bags">chain bags</option>
          </select>
        </div>
        <div className="inputYoutube">
          <label>Fake Sold :</label>
          <input
            type="number"
            name="fakeSold"
            value={formData.fakeSold}
            onChange={handleInputChange}
            placeholder="Enter Fake Sold"
            required
          />
        </div>
        <div className="inputYoutube">
          <label>Star :</label>
          <select
            name="star"
            value={formData.star}
            onChange={handleInputChange}
          >
            <option value="other">other</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="inputYoutube">
          <label>Main Price:</label>
          <input
            type="number"
            name="mainPrice"
            value={formData.mainPrice}
            onChange={handleInputChange}
            placeholder="Enter main price"
            required
          />
        </div>
        <div className="inputYoutube">
          <label>Discount Price:</label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleInputChange}
            placeholder="Enter discount price"
            required
          />
        </div>
        <div className="inputYoutube">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            required
          />
        </div>
        <div className="inputYoutube">
          <label>Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            required
          />
        </div>
        <div className="inputYoutube">
          <label>Thumbnails:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleThumbnailsChange}
            required
          />
        </div>
        {[...Array(8)].map((_, index) => (
          <div className="inputYoutube" key={index}>
            <label>Images for Thumbnail {index + 1}:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleThumbnailImagesChange(index, e)}
            />
          </div>
        ))}
        <div className="inputYoutube">
          <button type="submit">{loading ? "Creating..." : "Submit"}</button>
        </div>
      </form>
    </>
  );
};

export default PopForm;
