import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import BrandModal from "./BrandModal";
import GmsModal from "./GmsModal";
import ProjectedPayoutModal from "./ProjectedPayoutModal";
import FbaModal from "./FbaModal";
import AccountStatusModal from "./AccountStatusModal";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const GPL = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
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
  };

  const columns = [
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
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 100,
    },
    {
      title: "GMS",
      key: "gmsCom",
      width: 130,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "gmsCom")}
          style={{
            color: record.gmsCom ? "green" : "red",
          }}
        >
          {record.gmsCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "Launch Date",
      dataIndex: "Launch Date",
      key: "Launch Date",
      width: 120,
    },
    {
      title: "Projected Payout",
      key: "projectedPayoutCom",
      width: 130,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "projectedPayoutCom")}
          style={{
            color: record.projectedPayoutCom ? "green" : "red",
          }}
        >
          {record.projectedPayoutCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA",
      key: "fbaCom",
      width: 120,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "fbaCom")}
          style={{
            color: record.fbaCom ? "green" : "red",
          }}
        >
          {record.fbaCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "Account Status",
      key: "accountStatusGplCom",
      width: 140,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "accountStatusGplCom")}
          style={{
            color: record.accountStatusGplCom ? "green" : "red",
          }}
        >
          {record.accountStatusGplCom || "Not Set"}
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
      <Table
        dataSource={assignedUsers}
        columns={columns}
        rowKey="_id"
        bordered
        scroll={{ x: "max-content", y: 800 }}
        pagination={{ pageSize: 100 }}
        sticky
      />
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
      {modalState.visible && modalState.type === "gmsCom" && selectedUser && (
        <GmsModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible &&
        modalState.type === "projectedPayoutCom" &&
        selectedUser && (
          <ProjectedPayoutModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible && modalState.type === "fbaCom" && selectedUser && (
        <FbaModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible &&
        modalState.type === "accountStatusGplCom" &&
        selectedUser && (
          <AccountStatusModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
    </div>
  );
};

export default GPL;
