import React, { useEffect, useState } from "react";
import { Table, Spin, message, Input } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Archive = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem("user"));

        if (!manager || !manager.id) {
          message.error("Manager data not found. Please log in again.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${apiUrl}/api/users?managerId=${manager.id}`);
        setAssignedUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filteredData = assignedUsers.filter((user) =>
      user.enrollmentIdWebsite?.toLowerCase().includes(value) ||
      user.uid?.toLowerCase().includes(value)
    );

    setFilteredUsers(filteredData);
  };

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Date (Website)",
      dataIndex: "dateWebsite",
      key: "dateWebsite",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Enrollment ID (Website)",
      dataIndex: "enrollmentIdWebsite",
      key: "enrollmentIdWebsite",
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

  if (filteredUsers.length === 0 && searchText === "") {
    return <h3 style={{ textAlign: "center", marginTop: "20%" }}>No users assigned to you yet.</h3>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Input
        placeholder="Search by Enrollment ID or UID"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: "16px", maxWidth: "400px" }}
      />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        bordered
      />
    </div>
  );
};

export default Archive;
