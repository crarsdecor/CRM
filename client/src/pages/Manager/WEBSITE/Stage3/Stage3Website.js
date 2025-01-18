import React, { useEffect, useState } from "react";
import { Table, Spin, message, Col, Row, Button, Input } from "antd";
import axios from "axios";
import Stage3PaymentModal from "./Stage3PaymentModal";
import ServerpurchaseModal from "./ServerpurchaseModal";
import DomainclaimModal from "./DomainclaimModal";
import DomainmailverificationModal from "./DomainmailverificationModal";
import WebsiteuploadedModal from "./WebsiteuploadedModal";
import IdandpassModal from "./IdandpassModal";
import ReadytohandoverModal from "./ReadytohandoverModal";
import Stage3CompletionModal from "./Stage3CompletionModal";
import PaypalIntegrationModal from "./PaypalIntegrationModal";
import PaymentGatewayModal from "./PaymentGatewayModal";
import LetterOfCompletionModal from "./LetterOfCompletionModal";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage3Website = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalState, setModalState] = useState({ visible: false, type: null });
  
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [minEnrollmentId, setMinEnrollmentId] = useState("");
  const [maxEnrollmentId, setMaxEnrollmentId] = useState("");
  const [batchWebsite, setBatchWebsite] = useState("");

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
        setFilteredUsers(data); // Initialize filtered users
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

  const handleSearch = () => {
    const filterByRange = (user) => {
      const id = parseInt(user.enrollmentIdWebsite.replace(/[^0-9]/g, ""), 10);
      const min = minEnrollmentId ? parseInt(minEnrollmentId.replace(/[^0-9]/g, ""), 10) : null;
      const max = maxEnrollmentId ? parseInt(maxEnrollmentId.replace(/[^0-9]/g, ""), 10) : null;

      return (
        (!min || id >= min) &&
        (!max || id <= max)
      );
    };

    const filterByBatch = (user) =>
      !batchWebsite || user.batchWebsite?.toLowerCase().includes(batchWebsite.toLowerCase());

    const filtered = assignedUsers.filter(
      (user) => filterByRange(user) && filterByBatch(user)
    );
    setFilteredUsers(filtered);
  };

  const resetFilters = () => {
    setMinEnrollmentId("");
    setMaxEnrollmentId("");
    setBatchWebsite("");
    setFilteredUsers(assignedUsers);
  };

  const columns = [
    {
        title: "Enrollment ID (Website)",
        dataIndex: "enrollmentIdWebsite",
        key: "enrollmentIdWebsite",
        fixed: "left",
        width: 200,
      },
      {
        title: "Stage 1 Payment",
        key: "stage1payment",
        render: (_, record) => (
          <a
            onClick={() => handleModalOpen(record, "stage1payment")}
            style={{
              backgroundColor: record.stage1?.status === "Done" ? "#d4edda" : "inherit",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {record.stage1?.status || "Not Set"}
          </a>
        ),
      },
    {
        title: "Stage 3 Payment",
        key: "stage3payment",
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "stage3payment")}>
            {record.stage3?.status || "Not Set"}
          </a>
        ),
      },      
    {
      title: "Server Purchase",
      key: "serverPurchase",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "serverPurchase")}>
          {record.serverPurchase || "Not Set"}
        </a>
      ),
    },
    {
      title: "Domain Claim",
      key: "domainClaim",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "domainClaim")}>
          {record.domainClaim || "Not Set"}
        </a>
      ),
    },
    {
      title: "Domain Mail Verification",
      key: "domainMailVerification",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "domainMailVerification")}>
          {record.domainMailVerification || "Not Set"}
        </a>
      ),
    },
    {
      title: "Website Uploaded",
      key: "websiteUploaded",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "websiteUploaded")}>
          {record.websiteUploaded || "Not Set"}
        </a>
      ),
    },
    {
      title: "ID & PASS",
      key: "idAndPass",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "idAndPass")}>
          {record.idAndPass || "Not Set"}
        </a>
      ),
    },
    {
      title: "Ready To Handover",
      key: "readyToHandover",
      width: 100,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "readyToHandover")}>
          {record.readyToHandover || "Not Set"}
        </a>
      ),
    },
    {
      title: "Paypal Integration",
      key: "paypalIntegration",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "paypalIntegration")}>
          {record.paypalIntegration || "Not Set"}
        </a>
      ),
    },
    {
      title: "Payment Gateway 1",
      key: "paymentGateway",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "paymentGateway")}>
          {record.paymentGateway || "Not Set"}
        </a>
      ),
    },
    {
      title: "Letter Of Completion",
      key: "letterOfCompletion",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "letterOfCompletion")}>
          {record.letterOfCompletion || "Not Set"}
        </a>
      ),
    },
    {
      title: "Stage 3 Completion",
      key: "stage3Completion",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "stage3Completion")}>
          {record.stage3Completion || "Not Set"}
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
      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col span={6}>
          <Input
            placeholder="Min Enrollment ID"
            value={minEnrollmentId}
            onChange={(e) => setMinEnrollmentId(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Max Enrollment ID"
            value={maxEnrollmentId}
            onChange={(e) => setMaxEnrollmentId(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Batch Website"
            value={batchWebsite}
            onChange={(e) => setBatchWebsite(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button onClick={resetFilters} style={{ marginLeft: "8px" }}>
            Reset
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        bordered
        scroll={{ x: "max-content", y: 400 }}
        sticky
      />
      {modalState.visible && modalState.type === "stage3payment" && selectedUser && (
       <Stage3PaymentModal
       user={selectedUser}
       visible={modalState.visible}
       onClose={handleModalClose}
       onUpdate={handleUpdateUser}
     />
      )}
      {modalState.visible && modalState.type === "serverPurchase" && selectedUser && (
        <ServerpurchaseModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "domainClaim" && selectedUser && (
        <DomainclaimModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "domainMailVerification" && selectedUser && (
        <DomainmailverificationModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "websiteUploaded" && selectedUser && (
        <WebsiteuploadedModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "idAndPass" && selectedUser && (
        <IdandpassModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "readyToHandover" && selectedUser && (
        <ReadytohandoverModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "paypalIntegration" && selectedUser && (
        <PaypalIntegrationModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "paymentGateway" && selectedUser && (
        <PaymentGatewayModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "letterOfCompletion" && selectedUser && (
        <LetterOfCompletionModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "stage3Completion" && selectedUser && (
        <Stage3CompletionModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Stage3Website;
