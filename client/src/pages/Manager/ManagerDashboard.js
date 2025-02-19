import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Layout,
  Typography,
  message,
  Modal,
  Switch,
  Input,
  Select,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateField, setUpdateField] = useState("");
  const [status, setStatus] = useState(false);
  const [reason, setReason] = useState("");
  const [listingsModalVisible, setListingsModalVisible] = useState(false);
  const [listingsValue, setListingsValue] = useState("");
  const [fbaModalVisible, setFbaModalVisible] = useState(false);
  const [fbaField, setFbaField] = useState("");
  const [fbaStatus, setFbaStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchAssignedUsers = async () => {
    try {
      const manager = JSON.parse(localStorage.getItem("user"));
      if (!manager || !manager.id) {
        message.error("Manager data not found. Please log in again.");
        return;
      }
      const { data } = await axios.get(
        `${apiUrl}/api/users?managerId=${manager.id}`
      );
      setUsers(data);
      setFilteredUsers(data); // Initialize filtered users
    } catch (error) {
      message.error("Failed to fetch assigned users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const handleOpenModal = (user, field) => {
    setSelectedUser(user);
    setUpdateField(field);
    setStatus(user[field] === "true");

    // Adjust reason field dynamically
    setReason(user[`reason${field.replace("accountOpen", "")}`] || "");

    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setUpdateField("");
  };

  const handleOpenFbaModal = (user, field) => {
    setSelectedUser(user);
    setFbaField(field);
    setFbaStatus(user[field] === "true" ? "Yes" : "No");
    setFbaModalVisible(true);
  };

  const handleCloseFbaModal = () => {
    setFbaModalVisible(false);
    setSelectedUser(null);
    setFbaField("");
  };

  const handleSaveFbaStatus = async () => {
    try {
      await axios.put(`${apiUrl}/api/users/updatefba/${selectedUser._id}`, {
        [fbaField]: fbaStatus,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, [fbaField]: fbaStatus }
            : user
        )
      );
      message.success("FBA status updated successfully.");
      fetchAssignedUsers();
      handleCloseFbaModal();
    } catch (error) {
      message.error("Failed to update FBA status.");
    }
  };

  const handleOpenListingsModal = (user, field) => {
    setSelectedUser(user);
    setUpdateField(field);
    setListingsModalVisible(true);
  };

  const handleCloseListingsModal = () => {
    setListingsModalVisible(false);
    setSelectedUser(null);
    setUpdateField("");
    setListingsValue("");
  };

  const handleSaveListings = async () => {
    if (!listingsValue) {
      message.error("Please enter a value.");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/api/users/update-listing/${selectedUser._id}`,
        {
          [updateField]: listingsValue,
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, [updateField]: listingsValue }
            : user
        )
      );
      message.success("Listings updated successfully.");
      fetchAssignedUsers();
      handleCloseListingsModal();
    } catch (error) {
      message.error("Failed to update listings.");
    }
  };

  const handleSave = async () => {
    if (!status && !reason) {
      message.error("Reason is required if status is 'Not Done'.");
      return;
    }

    try {
      await axios.put(`${apiUrl}/api/users/${selectedUser._id}`, {
        [updateField]: status,
        [`${updateField}Reason`]: status ? "" : reason,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                [updateField]: status,
                [`${updateField}Reason`]: reason,
              }
            : user
        )
      );
      message.success("Status updated successfully.");
      handleCloseModal();
      fetchAssignedUsers();
    } catch (error) {
      message.error("Failed to update status.");
    }
  };

  // Filter users based on search query
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredData = users.filter((user) => {
      // Ensure the fields are not undefined and convert them to lowercase
      const enrollmentIdAmazon = user.enrollmentIdAmazon || ""; // Default to empty string if undefined
      const enrollmentIdWebsite = user.enrollmentIdWebsite || ""; // Default to empty string if undefined

      return (
        enrollmentIdAmazon.toLowerCase().includes(query.toLowerCase()) ||
        enrollmentIdWebsite.toLowerCase().includes(query.toLowerCase())
      );
    });

    setFilteredUsers(filteredData);
  };

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
      render: (_, record) => (
        <span className="bg-blue-100 p-1">{record.uid}</span>
      ),
    },
    {
      title: "PASSWORD",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "E.ID (Amazon)",
      dataIndex: "enrollmentIdAmazon",
      key: "enrollmentIdAmazon",
      // Add filter for Amazon ID
    },
    {
      title: "E.ID (Website)",
      dataIndex: "enrollmentIdWebsite",
      key: "enrollmentIdWebsite",
    },
    {
      title: "Account Open In",
      dataIndex: "accountOpenIn",
      key: "accountOpenIn",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleOpenModal(record, "accountOpenIn")}
        >
          {record.accountOpenIn === "true" ? (
            <span className="text-green-500">Done</span>
          ) : (
            <span className="text-red-500">Not Done</span>
          )}
        </Button>
      ),
      // Add filter for "Done" / "Not Done"
      filters: [
        { text: "Done", value: "Done" },
        { text: "Not Done", value: "Not Done" },
      ],
      onFilter: (value, record) =>
        value === "Done"
          ? record.accountOpenIn === "true"
          : record.accountOpenIn !== "true",
    },
    {
      title: "Account Open Com",
      dataIndex: "accountOpenCom",
      key: "accountOpenCom",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleOpenModal(record, "accountOpenCom")}
        >
          {record.accountOpenCom === "true" ? (
            <span className="text-green-500">Done</span>
          ) : (
            <span className="text-red-500">Not Done</span>
          )}
        </Button>
      ),
      // Add filter for "Done" / "Not Done"
      filters: [
        { text: "Done", value: "Done" },
        { text: "Not Done", value: "Not Done" },
      ],
      onFilter: (value, record) =>
        value === "Done"
          ? record.accountOpenCom === "true"
          : record.accountOpenCom !== "true",
    },
    {
      title: "Listings Count In",
      dataIndex: "listingsCountIn",
      key: "listingsCountIn",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleOpenListingsModal(record, "listingsCountIn")}
        >
          <span className="text-green-500">
            {record.listingsCountIn || (
              <span className="text-red-500">Not Done</span>
            )}
          </span>
        </Button>
      ),
      // Add filter for "Done" / "Not Done"
      filters: [
        { text: "Done", value: "Done" },
        { text: "Not Done", value: "Not Done" },
      ],
      onFilter: (value, record) =>
        value === "Done"
          ? record.listingsCountIn > 0
          : record.listingsCountIn === 0,
    },
    {
      title: "Listings Count Com",
      dataIndex: "listingsCountCom",
      key: "listingsCountCom",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleOpenListingsModal(record, "listingsCountCom")}
        >
          <span className="text-green-500">
            {record.listingsCountCom || (
              <span className="text-red-500">Not Done</span>
            )}
          </span>
        </Button>
      ),
      // Add filter for "Done" / "Not Done"
      filters: [
        { text: "Done", value: "Done" },
        { text: "Not Done", value: "Not Done" },
      ],
      onFilter: (value, record) =>
        value === "Done"
          ? record.listingsCountCom > 0
          : record.listingsCountCom === 0,
    },
    {
      title: "FBA IN",
      dataIndex: "fbaIn",
      key: "fbaIn",
      render: (_, record) => (
        <Button type="link" onClick={() => handleOpenFbaModal(record, "fbaIn")}>
          {record.fbaIn === "true" ? (
            <span className="text-green-500">Done</span>
          ) : (
            <span className="text-red-500">Not Done</span>
          )}
        </Button>
      ),
      // Add filter for "Done" / "Not Done"
      filters: [
        { text: "Done", value: "Done" },
        { text: "Not Done", value: "Not Done" },
      ],
      onFilter: (value, record) =>
        value === "Done" ? record.fbaIn === "true" : record.fbaIn !== "true",
    },
    {
      title: "FBA COM",
      dataIndex: "fbaCom",
      key: "fbaCom",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleOpenFbaModal(record, "fbaCom")}
        >
          {record.fbaCom === "true" ? (
            <span className="text-green-500">Done</span>
          ) : (
            <span className="text-red-500">Not Done</span>
          )}
        </Button>
      ),
      // Add filter for "Done" / "Not Done"
      filters: [
        { text: "Done", value: "Done" },
        { text: "Not Done", value: "Not Done" },
      ],
      onFilter: (value, record) =>
        value === "Done" ? record.fbaCom === "true" : record.fbaCom !== "true",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f4f4", padding: 20 }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="header-container"
        style={{ marginBottom: 20 }}
      >
        <div
          className="header-content"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "white" }}>
            Manager Dashboard
          </Title>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </motion.div>

      <Content className="mt-12">
        <Input
          className="rounded-lg mt-4"
          placeholder="Search by Enrollment ID (Amazon or Website)"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginBottom: 20, width: 300 }}
        />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 100 }}
          bordered
        />
      </Content>

      <Modal
        visible={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleSave}
        title="Update Status"
      >
        <Switch
          checked={status}
          onChange={(checked) => setStatus(checked)} // Update the status based on toggle
        />
        <span style={{ marginLeft: 10 }} />
        {!status && (
          <Input
            placeholder="Enter Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ marginTop: 10 }}
          />
        )}
      </Modal>
      <Modal
        visible={listingsModalVisible}
        onCancel={handleCloseListingsModal}
        onOk={handleSaveListings}
        title="Update Listings"
      >
        <Input
          placeholder="Enter Listings Count"
          value={listingsValue}
          onChange={(e) => setListingsValue(e.target.value)}
        />
      </Modal>
      <Modal
        visible={fbaModalVisible}
        onCancel={handleCloseFbaModal}
        onOk={handleSaveFbaStatus}
        title={`Update ${fbaField === "fbaIn" ? "FBA IN" : "FBA COM"} Status`}
      >
        <Select
          value={fbaStatus}
          onChange={(value) => setFbaStatus(value)}
          style={{ width: "100%" }}
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </Select>
      </Modal>
    </Layout>
  );
};

export default ManagerDashboard;
