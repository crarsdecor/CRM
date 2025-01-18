import React, { useEffect, useState } from "react";
import { Table, Spin, message, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AssignedUsersTable = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem("user"));

        if (!manager || !manager.id) {
          message.error("Manager data not found. Please log in again.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${apiUrl}/api/users?managerId=${manager.id}`
        );
        setAssignedUsers(data);
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Enrollment ID",
      dataIndex: "enrollmentIdAmazon",
      key: "enrollmentIdAmazon",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Primary Contact",
      dataIndex: "primaryContact",
      key: "primaryContact",
      render: (contact) => {
        if (!contact) return "N/A"; // Handle cases where contact might be null or undefined
        return contact.replace(/\d(?=\d{4})/g, "*"); // Replace all digits except the last 4 with '*'
      },
    },
    {
      title: "Batch",
      dataIndex: "batchAmazon",
      key: "batchAmazon",
    },

    {
      title: "Date",
      dataIndex: "dateAmazon",
      key: "dateAmazon",
      render: (date) => new Date(date).toDateString(), // Format the date
    },
  ];

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full pb-2 mb-4 px-4 bg-gradient-to-r from-blue-500 to-red-300 shadow-lg rounded-lg">
        <h1 className="text-2xl p-2 font-bold text-white">All Users</h1>
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg">
        <Table
          dataSource={assignedUsers.map((user, index) => ({
            ...user,
            key: index, // Add a unique key for each row
          }))}
          columns={columns}
          pagination={{ pageSize: 20 }}
          bordered
        />
      </div>
    </div>
  );
};

export default AssignedUsersTable;
