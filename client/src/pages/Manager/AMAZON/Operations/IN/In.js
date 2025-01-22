import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import moment from "moment";
import LegalityModal from "./LegalityModal";
import GstModal from "./GstModal";
import AccountOpenModal from "./AccountOpenModal";
import AccountStatusModal from "./AccountStatusModal";
import BrandModal from "./BrandModal";
import ListingsModal from "./ListingsModal";
import UserIdPassModal from "./UserIdPassModal";
import AccountLaunchModal from "./AccountLaunchModal";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const In = () => {
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
      title: "Date (AMAZON)",
      dataIndex: "dateAmazon",
      key: "dateAmazon",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
      responsive: ["lg"],
    },
    {
      title: "Enrollment ID (Amazon)",
      dataIndex: "enrollmentIdAmazon",
      key: "enrollmentIdAmazon",
      fixed: "left",
      width: 200,
    },
    {
      title: "Batch",
      dataIndex: "batchAmazon",
      key: "batchAmazon",
      responsive: ["md"],
    },
    {
      title: "Legality",
      key: "legalityAmazon",
      width: 100,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "legality")}>
          {record.legalityAmazon || "Not Set"}
        </a>
      ),
    },
    {
      title: "GST",
      key: "gst",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "gst")}>
          {record.gst || "Not Set"}
        </a>
      ),
    },
    {
      title: "GST Number",
      dataIndex: "gstNumber",
      key: "gstNumber",
      width: 120,
      responsive: ["md"],
    },
    {
      title: "Account Open",
      key: "accountOpenIn",
      width: 130,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "accountOpenIn")}>
          {record.accountOpenIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Account Status",
      key: "accountStatusIn",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "accountStatusIn")}>
          {record.accountStatusIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Brand Name",
      key: "brandName",
      width: 120,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "brandName")}>
          {record.brandName || "Not Set"}
        </a>
      ),
    },
    {
      title: "Listings",
      key: "listingsIn",
      width: 100,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "listingsIn")}>
          {record.listingsIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "User ID & PASS",
      key: "theme",
      width: 140,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "userIDPASS")}>
          {record.amazonIdIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Account Launched",
      key: "accountLaunchIn",
      width: 160,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "accountLaunchIn")}>
          {record.accountLaunchIn || "Not Set"}
        </a>
      ),
    },
    {
      title: "Remark",
      key: "accountLaunchIn",
      width: 100,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "accountLaunchIn")}>
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
      {modalState.visible && modalState.type === "legality" && selectedUser && (
        <LegalityModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "gst" && selectedUser && (
        <GstModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible &&
        modalState.type === "accountOpenIn" &&
        selectedUser && (
          <AccountOpenModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "accountStatusIn" &&
        selectedUser && (
          <AccountStatusModal
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
        modalState.type === "listingsIn" &&
        selectedUser && (
          <ListingsModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "userIDPASS" &&
        selectedUser && (
          <UserIdPassModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
      {modalState.visible &&
        modalState.type === "accountLaunchIn" &&
        selectedUser && (
          <AccountLaunchModal
            user={selectedUser}
            visible={modalState.visible}
            onClose={handleModalClose}
            onUpdate={handleUpdateUser}
          />
        )}
    </div>
  );
};

export default In;
