import React, { useEffect, useState } from "react";
import { Table, Spin, message, Input } from "antd";
import axios from "axios";
import DateModal from "./DateModal";
import BrandModal from "./BrandModal";
import ApobModal from "./ApobModal";
import FbaAmountModal from "./FbaAmountModal";
import FbaLiveModal from "./FbaLiveModal";
import ShipmentModal from "./ShipmentModal";
import SkuModal from "./SkuModal";
import StateModal from "./StateModal";

const apiUrl = process.env.REACT_APP_BACKEND_URL;
const { Search } = Input;

const FBA = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
        setFilteredUsers(data); // Initialize the filtered data
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  const handleSearch = (value) => {
    const filtered = assignedUsers.filter((user) =>
      Object.values(user).join(" ").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

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

  const columns = [
    {
      title: "Date",
      key: "dateFbaIn",
      width: 100,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "dateFbaIn")}
          style={{
            color: record.dateFbaIn ? "green" : "red",
          }}
        >
          {record.dateFbaIn
            ? new Date(record.dateFbaIn).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Not Set"}
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
      key: "fbaAmountIn",
      width: 130,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "fbaAmountIn")}
          style={{
            color: record.fbaAmountIn ? "green" : "red",
          }}
        >
          {record.fbaAmountIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "State",
      key: "state",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "state")}
          style={{
            color: record.state ? "green" : "red",
          }}
        >
          {record.state || "Not Set"}
        </a>
      ),
    },
    {
      title: "SKU",
      key: "skuIn",
      width: 120,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "skuIn")}
          style={{
            color: record.skuIn ? "green" : "red",
          }}
        >
          {record.skuIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "A.P.O.B.",
      key: "apobIn",
      width: 100,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "apobIn")}
          style={{
            color: record.apobIn ? "green" : "red",
          }}
        >
          {record.apobIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Shipment",
      key: "shipmentIn",
      width: 140,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "shipmentIn")}
          style={{
            color: record.shipmentIn ? "green" : "red",
          }}
        >
          {record.shipmentIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA Live",
      key: "fbaLiveIn",
      width: 160,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "fbaLiveIn")}
          style={{
            color: record.fbaLiveIn ? "green" : "red",
          }}
        >
          {record.fbaLiveIn || "Not Set"}
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
        placeholder="Search users"
        onSearch={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
        allowClear
      />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        bordered
        scroll={{ x: "max-content", y: 800 }}
        pagination={{ pageSize: 100 }}
        sticky
      />
      {modalState.visible &&
        modalState.type === "dateFbaIn" &&
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
        modalState.type === "fbaAmountIn" &&
        selectedUser && (
          <FbaAmountModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible && modalState.type === "state" && selectedUser && (
        <StateModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "skuIn" && selectedUser && (
        <SkuModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "apobIn" && selectedUser && (
        <ApobModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible &&
        modalState.type === "shipmentIn" &&
        selectedUser && (
          <ShipmentModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "fbaLiveIn" &&
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
