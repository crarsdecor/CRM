import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import BrandModal from "./BrandModal";
import GmsModal from "./GmsModal";
import ProjectedSlabModal from "./ProjectedSlabModal";
import FbaModal from "./FbaModal";
import ProjectedPayoutModal from "./ProjectedPayoutModal";
import CurrentSlabModal from "./CurrentSlabModal";
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
      key: "gmsIn",
      width: 130,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "gmsIn")}
          style={{
            color: record.gmsIn ? "green" : "red",
          }}
        >
          {record.gmsIn || "Not Set"}
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
      title: "Projected Slab",
      key: "projectedSlabIn",
      width: 130,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "projectedSlabIn")}
          style={{
            color: record.projectedSlabIn ? "green" : "red",
          }}
        >
          {record.projectedSlabIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA",
      key: "fbaIn",
      width: 120,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "fbaIn")}
          style={{
            color: record.fbaIn ? "green" : "red",
          }}
        >
          {record.fbaIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Projected Payout",
      key: "projectedPayoutIn",
      width: 150,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "projectedPayoutIn")}
          style={{
            color: record.projectedPayoutIn ? "green" : "red",
          }}
        >
          {record.projectedPayoutIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Current Slab",
      key: "currentSlabIn",
      width: 130,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "currentSlabIn")}
          style={{
            color: record.currentSlabIn ? "green" : "red",
          }}
        >
          {record.currentSlabIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Account Status",
      key: "accountStatusGplIn",
      width: 140,
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "accountStatusGplIn")}
          style={{
            color: record.accountStatusGplIn ? "green" : "red",
          }}
        >
          {record.accountStatusGplIn || "Not Set"}
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
      {modalState.visible && modalState.type === "gmsIn" && selectedUser && (
        <GmsModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible &&
        modalState.type === "projectedSlabIn" &&
        selectedUser && (
          <ProjectedSlabModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible && modalState.type === "fbaIn" && selectedUser && (
        <FbaModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible &&
        modalState.type === "projectedPayoutIn" &&
        selectedUser && (
          <ProjectedPayoutModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "currentSlabIn" &&
        selectedUser && (
          <CurrentSlabModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "accountStatusGplIn" &&
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
