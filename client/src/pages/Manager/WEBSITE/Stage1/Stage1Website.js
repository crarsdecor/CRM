import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import moment from "moment";
import Stage1PaymentModal from "./Stage1PaymentModal";
import LegalityModal from "./LegalityModal";
import GstModal from "./GstModal";
import StateModal from "./StateModal";
import OvcModal from "./OvcModal";
import IdcardModal from "./IdcardModal";
import SocialmediaModal from "./SocialmediaModal";
import ThemeModal from "./ThemeModal";
import Stage1CompletionModal from "./Stage1CompletionModal";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage1Website = () => {
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
      title: "Date (Website)",
      dataIndex: "dateWebsite",
      key: "dateWebsite",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
      responsive: ["lg"],
    },
    {
        title: "Enrollment ID (Website)",
        dataIndex: "enrollmentIdWebsite",
        key: "enrollmentIdWebsite",
        fixed: "left",
        width: 200,
      },
    {
      title: "Batch",
      dataIndex: "batchWebsite",
      key: "batchWebsite",
      responsive: ["md"],
    },
    {
        title: "Stage 1 Payment",
        key: "stage1payment",
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "stage1payment")}>
            {record.stage1?.status || "Not Set"}
          </a>
        ),
      },      
    {
      title: "Legality",
      key: "legalityWebsite",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "legality")}>
          {record.legalityWebsite || "Not Set"}
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
      title: "State",
      key: "state",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "state")}>
          {record.state || "Not Set"}
        </a>
      ),
    },
    {
      title: "OVC",
      key: "ovc",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "ovc")}>
          {record.ovc || "Not Set"}
        </a>
      ),
    },
    {
      title: "ID Card",
      key: "idCard",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "idCard")}>
          {record.idCard || "Not Set"}
        </a>
      ),
    },
    {
      title: "Social Media Content",
      key: "socialMediaContent",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "socialMediaContent")}>
          {record.socialMediaContent || "Not Set"}
        </a>
      ),
    },
    {
      title: "Theme",
      key: "theme",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "theme")}>
          {record.theme || "Not Set"}
        </a>
      ),
    },
    {
      title: "Stage 1 Completion",
      key: "stage1Completion",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "stage1Completion")}>
          {record.stage1Completion || "Not Set"}
        </a>
      ),
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
        scroll={{ x: "max-content", y: 400 }}
        sticky
      />
      {modalState.visible && modalState.type === "stage1payment" && selectedUser && (
       <Stage1PaymentModal
       user={selectedUser}
       visible={modalState.visible}
       onClose={handleModalClose}
       onUpdate={handleUpdateUser}
     />
      )}
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
      {modalState.visible && modalState.type === "state" && selectedUser && (
        <StateModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "ovc" && selectedUser && (
        <OvcModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "idCard" && selectedUser && (
        <IdcardModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "socialMediaContent" && selectedUser && (
        <SocialmediaModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "theme" && selectedUser && (
        <ThemeModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "stage1Completion" && selectedUser && (
        <Stage1CompletionModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Stage1Website;
