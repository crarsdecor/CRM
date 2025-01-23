import React, { useEffect, useState } from "react";
import { Table, Spin, message, Input } from "antd"; // Added Input for the search bar
import axios from "axios";
import BrandModal from "./BrandModal";
import DateModal from "./DateModal";
import FbaAmountModal from "./FbaAmountModal";
import FbaLiveModal from "./FbaLiveModal";
import FbaRegistrationModal from "./FbaRegistrationModal";
import ShipmentModal from "./ShipmentModal";
import SkuModal from "./SkuModal";

const { Search } = Input; // Destructuring Search from Input
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const FBA = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State for search filtering
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalState, setModalState] = useState({ visible: false, type: null });

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
        setFilteredUsers(data); // Initialize filteredUsers with full user list
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  const handleModalOpen = (user, type) => {
    setSelectedUser(user);
    setModalState({ visible: true, type });
  };

  const handleModalClose = () => {
    setModalState({ visible: false, type: null });
  };

  const handleUpdateUser = (updatedUser) => {
    setAssignedUsers((users) =>
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    setFilteredUsers((users) =>
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const handleSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filteredData = assignedUsers.filter((user) =>
      Object.values(user).some(
        (field) =>
          field && field.toString().toLowerCase().includes(lowercasedValue)
      )
    );
    setFilteredUsers(filteredData);
  };

  const columns = [
    {
      title: "Date",
      key: "dateFbaCom",
      width: 100,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "dateFbaCom")}
          style={{
            color: record.dateFbaCom ? "green" : "red",
          }}
        >
          {record.dateFbaCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "Enrollment ID (Amazon)",
      dataIndex: "enrollmentIdAmazon",
      key: "enrollmentIdAmazon",
      fixed: "left",
      width: 200,
    },
    {
      title: "Brand Name",
      key: "brandName",
      width: 120,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "brandName")}
          style={{
            color: record.brandName ? "green" : "red",
          }}
        >
          {record.brandName || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA Amount",
      key: "fbaAmountCom",
      width: 130,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "fbaAmountCom")}
          style={{
            color: record.fbaAmountCom ? "green" : "red",
          }}
        >
          {record.fbaAmountCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "SKU",
      key: "skuCom",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "skuCom")}
          style={{
            color: record.skuCom ? "green" : "red",
          }}
        >
          {record.skuCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA Registration",
      key: "fbaRegistration",
      width: 120,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "fbaRegistration")}
          style={{
            color: record.fbaRegistration ? "green" : "red",
          }}
        >
          {record.fbaRegistration || "Not Set"}
        </a>
      ),
    },
    {
      title: "Shipment Create",
      key: "shipmentCom",
      width: 100,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "shipmentCom")}
          style={{
            color: record.shipmentCom ? "green" : "red",
          }}
        >
          {record.shipmentCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA Live",
      key: "fbaLiveCom",
      width: 160,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "fbaLiveCom")}
          style={{
            color: record.fbaLiveCom ? "green" : "red",
          }}
        >
          {record.fbaLiveCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "Remark",
      key: "accountLaunchIn",
      width: 100,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "accountLaunchIn")}
          style={{
            color: record.accountLaunchIn ? "green" : "red",
          }}
        >
          {record.accountLaunchIn || "Not Set"}
        </a>
      ),
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

  if (assignedUsers.length === 0) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "20%" }}>
        No users assigned to you yet.
      </h3>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Search
        placeholder="Search users..."
        onSearch={handleSearch}
        allowClear
        style={{ marginBottom: "16px", maxWidth: "300px" }}
      />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        bordered
        scroll={{ x: "max-content", y: 400 }}
        sticky
      />
      {modalState.visible &&
        modalState.type === "dateFbaCom" &&
        selectedUser && (
          <DateModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "brandName" &&
        selectedUser && (
          <BrandModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "fbaAmountCom" &&
        selectedUser && (
          <FbaAmountModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible && modalState.type === "skuCom" && selectedUser && (
        <SkuModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible &&
        modalState.type === "fbaRegistration" &&
        selectedUser && (
          <FbaRegistrationModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "shipmentCom" &&
        selectedUser && (
          <ShipmentModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "fbaLiveCom" &&
        selectedUser && (
          <FbaLiveModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
    </div>
  );
};

export default FBA;
