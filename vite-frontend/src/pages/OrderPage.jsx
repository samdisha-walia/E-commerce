//src/pages/OrderPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!userString) {
        console.error("❌ User not found in localStorage");
        return;
      }

      let user;
      try {
        user = JSON.parse(userString);
        if (user.id && !user._id) user._id = user.id;
      } catch (err) {
        console.error("❌ Failed to parse user from localStorage", err);
        return;
      }

      if (!user.id) {
        console.error("❌ User ID is missing from parsed user object:", user);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders );
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  fetchOrders();
}, []);




  return (
    <MainLayout >
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        📦 Your Previous Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg animate-fadeIn">
          No previous orders found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 transition-transform duration-300 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold mb-2">Order #{order._id.slice(-6)}</h3>
              <ul className="text-gray-700 mb-4">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm border-b py-1">
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>Total: ₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
};

export default OrderPage;
