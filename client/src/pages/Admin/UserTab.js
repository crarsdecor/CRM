import React, { useEffect, useState } from "react";
import { Button, message, Upload, Input } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";
import UserModal from "./UserModal";
import UserTable from "./UserTable";

const { Search } = Input;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const UserTab = () => {
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  const fetchManagers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=manager`);
      setManagers(data);
    } catch (error) {
      message.error("Failed to fetch managers");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchManagers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/users/${id}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleAssignManagers = async (userId, managerIds) => {
    try {
      await axios.put(`${apiUrl}/api/users/${userId}`, { managerIds });
      message.success("Managers assigned successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to assign managers");
    }
  };

  const handleCsvUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("CSV uploaded successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    try {
      const data = users.map((user) => ({
        Name: user.name,
        UID: user.uid,
        "Enrollment ID Website": user.enrollmentIdWebsite,
        "Enrollment ID Amazon": user.enrollmentIdAmazon,
        Email: user.email,
        "Primary Contact": user.primaryContact,
        Role: user.role,
        Manager:
          user.managers.length > 0
            ? user.managers.map((manager) => manager.name).join(", ")
            : "N/A",
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, "UsersData.xlsx");
      message.success("Excel file downloaded successfully");
    } catch (error) {
      message.error("Failed to download Excel file");
    }
  };

  const filteredUsers = users.filter((user) =>
    [
      user.uid,
      user.enrollmentIdWebsite,
      user.enrollmentIdAmazon,
      user.name,
      user.email,
      user.primaryContact,
    ]
      .filter(Boolean) // Remove undefined/null values
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", gap: "10px" }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add User
        </Button>
        <Upload
          beforeUpload={(file) => {
            handleCsvUpload(file);
            return false;
          }}
          accept=".csv"
          showUploadList={false}
        >
          <Button type="default" icon={<UploadOutlined />} loading={loading}>
            Bulk Import CSV
          </Button>
        </Upload>
        <Button
          type="default"
          icon={<DownloadOutlined />}
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
        <Search
          placeholder="Search users..."
          allowClear
          enterButton
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <UserTable
        users={filteredUsers}
        managers={managers}
        handleDeleteUser={handleDeleteUser}
        handleAssignManagers={handleAssignManagers}
      />
      <UserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        fetchUsers={fetchUsers}
        managers={managers}
      />
    </div>
  );
};

export default UserTab;
