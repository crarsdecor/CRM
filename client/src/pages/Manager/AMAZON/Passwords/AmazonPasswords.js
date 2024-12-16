import React, { useEffect, useState } from "react";
import { Table, Spin, message, Switch } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Archive = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        // Retrieve manager data from local storage
        const manager = JSON.parse(localStorage.getItem("user"));

        if (!manager || !manager.id) {
          message.error("Manager data not found. Please log in again.");
          setLoading(false);
          return;
        }

        // API call to fetch users assigned to the manager
        const { data } = await axios.get(`${apiUrl}/api/users?managerId=${manager.id}`);
        setAssignedUsers(data);
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  const toggleCallDone = async (userId, currentStatus) => {
    try {
      // Determine the new status
      const newStatus = currentStatus === "Done" ? "Not Done" : "Done";

      // Optimistically update the UI
      const updatedUsers = assignedUsers.map((user) =>
        user._id === userId ? { ...user, callDone: newStatus } : user
      );
      setAssignedUsers(updatedUsers);

      // API call to update the status in the backend
      await axios.put(`${apiUrl}/api/users/${userId}`, {
        callDone: newStatus,
      });

      message.success("Call status updated successfully.");
    } catch (error) {
      message.error("Failed to update call status. Please try again.");
    }
  };

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Date (Amazon)",
      dataIndex: "dateAmazon",
      key: "dateAmazon",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Enrollment ID (Amazon)",
      dataIndex: "enrollmentIdAmazon",
      key: "enrollmentIdAmazon",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
  }

  if (assignedUsers.length === 0) {
    return <h3 style={{ textAlign: "center", marginTop: "20%" }}>No users assigned to you yet.</h3>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Table
        dataSource={assignedUsers}
        columns={columns}
        rowKey="_id"
        bordered
      />
    </div>
  );
};

export default Archive;

