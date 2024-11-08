import React, { useEffect, useState } from "react";
import "../css/table.css";
import toast from "react-hot-toast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function SlideShow() {
  const [slides, setSlides] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setFetching(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${VITE_BASE_URL}/api/slideshow/all`, {
        method: "GET",
        headers: {
          "x-admin-token": adminToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch slides");
      }
      const data = await response.json();
      setSlides(data);
      fetchSlides();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    if (image) {
      formData.append("images", image);
    }

    try {
      const response = await fetch(`${VITE_BASE_URL}/api/slideshow/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "x-admin-token": localStorage.getItem("adminToken"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const newSlide = await response.json();
      setSlides((prevSlides) => [...prevSlides, newSlide]);
      toast.success("Image uploaded successfully");
      setImage(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/slideshow/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": localStorage.getItem("adminToken"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete slideshow");
      }

      toast.success("Slideshow deleted successfully");
      setSlides((prevSlides) => prevSlides.filter((slide) => slide._id !== id));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="main-slideshow">
      <h2>SlideShow Image Upload</h2>
      <h2>Total Slides {slides.length}</h2>
      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit" className="upload">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {fetching ? (
        <div className="loader">Loading slides...</div>
      ) : (
        <div className="carousel">
          {slides.length === 0 ? (
            <p className="loading-data">No slides available</p>
          ) : (
            slides.map((slide) => (
              <div className="slide" key={slide._id}>
                {slide.images && slide.images.length > 0 ? (
                  <img src={slide.images[0]} alt="Slideshow" />
                ) : (
                  <p className="loading-data">No image available</p>
                )}
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SlideShow;
