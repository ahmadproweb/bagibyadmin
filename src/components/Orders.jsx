import React, { useEffect, useState } from "react";
import "../css/order.css";
import toast from "react-hot-toast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(
        `${VITE_BASE_URL}/api/orders/allOrderAdmin`,
        {
          method: "GET",
          headers: { "x-admin-token": adminToken },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setFullscreenImage(imageUrl);
    document.body.classList.add("no-scroll");
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
    document.body.classList.remove("no-scroll");
  };

  return (
    <div className="orders-container">
      <h2>Total Orders {orders.length}</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <div className="order-table">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Order ID : {order._id}</h3>
              <p>
                <strong>Customer : </strong> {order.customerName.first}{" "}
                {order.customerName.last}
              </p>
              <p>
                <strong>Email : </strong>{" "}
                <a href={`mailto:${order.contact.email}`}>
                  {order.contact.email}
                </a>
              </p>
              <p>
                <strong>Phone : </strong>
                <a href={`tel:+${order.contact.phone.replace(/^0/, "92")}`}>
                  +{order.contact.phone.replace(/^0/, "92")}
                </a>
              </p>
              <p>
                <strong>Whatsapp : </strong>
                <a
                  href={`https://wa.me/+${order.contact.phone.replace(
                    /^0/,
                    "92"
                  )}?text=Hello%20${
                    order.customerName.first
                  },%20regarding%20your%20order%20id%20${order._id}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {order.contact.phone}
                </a>
              </p>
              <p>
                <strong>Alternative Phone : </strong>
                <a href={`tel:+${order.contact.alternativePhone}`}>
                  {order.contact.alternativePhone || "Nothing"}
                </a>
              </p>
              <p>
                <strong>Address : </strong> {order.address.addressComplete} ,
                <strong> Near {order.address.famousPlace || "Nothing"}</strong> ,{" "}
                {order.address.city} -{" "}
                <strong>
                  Postal Code : {order.address.postalCode || "Nothing"}
                </strong>
              </p>
              <h4>Items : </h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>
                    <div>
                      <strong>Product : </strong> {item.title}
                    </div>
                    <div>
                      <strong>Quantity : </strong> {item.quantity}
                    </div>
                    <div>
                      <strong>Price per Item : </strong> {item.discountPrice}
                    </div>
                    <div>
                      <strong>Total Price : </strong> {item.totalPrice}
                    </div>
                    <img
                      src={item.cartImage}
                      alt={item.title}
                      onClick={() => handleImageClick(item.cartImage)}
                    />
                  </li>
                ))}
              </ul>

              <p className="last">
                <strong>Total Price :</strong> {order.total}
              </p>
              <p className="last">
                <strong>Order Date :</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullscreenImage}>
          <img src={fullscreenImage} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
}

export default Orders;
