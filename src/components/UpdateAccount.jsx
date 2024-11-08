import React, { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import toast from "react-hot-toast";
import "../css/accountStyle.css";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateForm = ({ account, onClose, updateProductList }) => {
  const [formData, setFormData] = useState({
    title: account?.title || "",
    mainPrice: account?.mainPrice || "",
    discountPrice: account?.discountPrice || "",
    description: account?.description || "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [thumbnailImages, setThumbnailImages] = useState({});

  useEffect(() => {
    if (account) {
      setFormData({
        title: account.title,
        mainPrice: account.mainPrice,
        discountPrice: account.discountPrice,
        description: account.description,
      });
    }
  }, [account]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const data = new FormData();
    data.append("title", formData.title);
    data.append("mainPrice", formData.mainPrice);
    data.append("discountPrice", formData.discountPrice);
    data.append("description", formData.description);

    if (mainImage) {
      data.append("mainImage", mainImage);
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
      const response = await fetch(
        `${VITE_BASE_URL}/api/products/${account._id}`,
        {
          method: "PUT",
          headers: {
            "x-admin-token": adminToken,
          },
          body: data,
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        toast.success("Product updated successfully!");
        updateProductList(updatedProduct);
        onClose();
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
    }
  };

  return (
    <>
      <div className="youtubeFormFill">
        <h1>Update Product</h1>
        <RxCrossCircled className="CrossIcons" onClick={onClose} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputYoutube">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            required
          />
        </div>

        <div className="inputYoutube">
          <label>Main Price:</label>
          <input
            type="number"
            name="mainPrice"
            value={formData.mainPrice}
            onChange={handleChange}
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
            onChange={handleChange}
            placeholder="Enter discount price"
            required
          />
        </div>

        <div className="inputYoutube">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
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
          />
        </div>

        <div className="inputYoutube">
          <label>Thumbnails:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleThumbnailsChange}
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
          <button type="submit">Update</button>
        </div>
      </form>
    </>
  );
};

export default UpdateForm;
