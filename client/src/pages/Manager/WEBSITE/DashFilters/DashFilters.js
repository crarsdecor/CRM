import React, { useEffect, useState } from "react";
import { Spin, message, Input } from "antd";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import UserTable from "./UserTable";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AssignedUsersTable = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  if (loading) {
    return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
  }

  const filteredUsers = searchQuery
    ? assignedUsers.filter((user) =>
        user.batchWebsite?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : assignedUsers;

  const bounceRateUsers = filteredUsers.filter(
    (user) => !user.stage2?.status || user.stage2.status === "Not Done"
  );

  const readyToHandoverUsers = filteredUsers.filter(
    (user) =>
      user.stage3?.status === "Done" &&
      (!user.readyToHandover || user.readyToHandover === "Not Done")
  );

  const paypalIntegrationPendingUsers = filteredUsers.filter(
    (user) =>
      user.stage3?.status === "Done" &&
      (!user.paypalIntegration || user.paypalIntegration === "Not Done")
  );

  const paymentGatewayPendingUsers = filteredUsers.filter(
    (user) => user.stage3?.status === "Done" && !user.paymentGateway
  );

  const handleBarClick = (index) => {
    switch (index) {
      case 0:
        setSelectedUsers(bounceRateUsers);
        break;
      case 1:
        setSelectedUsers(readyToHandoverUsers);
        break;
      case 2:
        setSelectedUsers(paypalIntegrationPendingUsers);
        break;
      case 3:
        setSelectedUsers(paymentGatewayPendingUsers);
        break;
      default:
        setSelectedUsers(null);
    }
  };

  const data = {
    labels: [
      "Bounce Rate",
      "Ready to Handover",
      "PayPal Integration Pending",
      "Payment Gateway Pending",
    ],
    datasets: [
      {
        label: "Number of Users",
        data: [
          bounceRateUsers.length,
          readyToHandoverUsers.length,
          paypalIntegrationPendingUsers.length,
          paymentGatewayPendingUsers.length,
        ],
        backgroundColor: [
          "rgba(114, 46, 209, 0.7)",
          "rgba(19, 194, 194, 0.7)",
          "rgba(255, 77, 79, 0.7)",
          "rgba(250, 173, 20, 0.7)",
        ],
        borderColor: [
          "rgba(114, 46, 209, 1)",
          "rgba(19, 194, 194, 1)",
          "rgba(255, 77, 79, 1)",
          "rgba(250, 173, 20, 1)",
        ],
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        grid: {
          color: "#ddd",
        },
        ticks: {
          color: "#666",
        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        handleBarClick(index);
      }
    },
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Input
        placeholder="Search by Batch Website"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: "600px", marginBottom: "16px" }}
      />
      <div
        style={{
          width: "800px",
          padding: "16px",
          background: "linear-gradient(135deg, #f5f7fa, #e4eaf2)",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "24px" }}>User Statistics</h2>
        <Bar data={data} options={options} />
      </div>
      {selectedUsers && <UserTable users={selectedUsers} onClose={() => setSelectedUsers(null)} />}
    </div>
  );
};

export default AssignedUsersTable;