import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Badge, Spin } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const UserDash = () => {
  const [userData, setUserData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  async function fetchUserData() {
    try {
      const response = await axios.get(`${apiUrl}/api/users/${user.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 text-center mb-6">
        Welcome, {userData.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="shadow-xl bg-white bg-opacity-80 backdrop-blur-lg p-4 rounded-lg border border-gray-200 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <UserOutlined className="text-3xl text-blue-500" />
            <h2 className="text-xl font-semibold">{userData.name}</h2>
          </div>
          <p className="text-gray-600">📧 {userData.email}</p>
          <p className="text-gray-800 font-semibold">UID: {userData.uid}</p>
          <p>
            <strong>Batch:</strong> {userData.batchAmazon}
          </p>
        </Card>

        {/* Amazon.in Details */}
        <Card className="shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-lg hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingOutlined className="text-3xl" />
            <h2 className="text-xl font-semibold">Amazon.in Details</h2>
          </div>
          <p>
            <strong>Enrollment ID:</strong> {userData.enrollmentIdAmazon}
          </p>
          <p>
            <strong>Listings:</strong> {userData.listingsCountIn}
          </p>

          <Badge
            count="Active"
            style={{ backgroundColor: "#52c41a", fontSize: "0.85rem" }}
          />
        </Card>

        {/* Amazon.com Details */}
        <Card className="shadow-xl bg-gradient-to-r from-green-500 to-blue-600 text-white p-5 rounded-lg hover:shadow-2xl transition-all">
          <div className="flex items-center gap-2 mb-3">
            <GlobalOutlined className="text-3xl" />
            <h2 className="text-xl font-semibold">Amazon.com Details</h2>
          </div>
          <p>
            <strong>Enrollment ID:</strong> {userData.enrollmentIdAmazon}
          </p>
          <p>
            <strong>Listings:</strong> {userData.listingsCountCom}
          </p>
          <Badge
            count="Active"
            style={{ backgroundColor: "#1890ff", fontSize: "0.85rem" }}
          />
        </Card>
      </div>
    </div>
  );
};

export default UserDash;
