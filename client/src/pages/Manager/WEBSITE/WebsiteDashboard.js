import React, { useEffect, useState } from "react";
import { Card, Spin, message, Statistic } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AssignedUsersTable = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const countIncompleteStages = (stageKey) => {
    return assignedUsers.filter(
      (user) => !user[stageKey] || user[stageKey] === "Not Done"
    ).length;
  };

  const calculatePercentage = (numerator, denominator) => {
    return denominator === 0 ? 0 : ((numerator / denominator) * 100).toFixed(2);
  };

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

  if (assignedUsers.length === 0) {
    return <h3 style={{ textAlign: "center", marginTop: "20%" }}>No users assigned to you yet.</h3>;
  }

  const bounceRate = calculatePercentage(
    assignedUsers.filter(
      (user) => !user.stage2?.status || user.stage2.status === "Not Done"
    ).length,
    assignedUsers.length
  );

  const readyToHandover = calculatePercentage(
    assignedUsers.filter(
      (user) =>
        user.stage3?.status === "Done" &&
        (!user.readyToHandover || user.readyToHandover === "Not Done")
    ).length,
    assignedUsers.length
  );
  return (
    <div style={{ padding: "24px", display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
      <Card
        bordered={false}
        style={{ width: 300, textAlign: "center", backgroundColor: "#f0f2f5", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Statistic
          title="Total Assigned Users"
          value={assignedUsers.length}
          style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}
        />
      </Card>

      <Card
        bordered={false}
        style={{ width: 300, textAlign: "center", backgroundColor: "#f0f2f5", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Statistic
          title="Stage 1 Not Done"
          value={countIncompleteStages("stage1Completion")}
          style={{ fontSize: "24px", fontWeight: "bold", color: "#fa8c16" }}
        />
      </Card>

      <Card
        bordered={false}
        style={{ width: 300, textAlign: "center", backgroundColor: "#f0f2f5", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Statistic
          title="Stage 2 Not Done"
          value={countIncompleteStages("stage2Completion")}
          style={{ fontSize: "24px", fontWeight: "bold", color: "#fa541c" }}
        />
      </Card>

      <Card
        bordered={false}
        style={{ width: 300, textAlign: "center", backgroundColor: "#f0f2f5", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Statistic
          title="Stage 3 Not Done"
          value={countIncompleteStages("stage3Completion")}
          style={{ fontSize: "24px", fontWeight: "bold", color: "#f5222d" }}
        />
      </Card>

      <Card
        bordered={false}
        style={{ width: 300, textAlign: "center", backgroundColor: "#f0f2f5", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Statistic
          title="Bounce Rate (%)"
          value={bounceRate}
          style={{ fontSize: "24px", fontWeight: "bold", color: "#722ed1" }}
        />
      </Card>

      <Card
        bordered={false}
        style={{ width: 300, textAlign: "center", backgroundColor: "#f0f2f5", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Statistic
          title="Ready to Handover (%)"
          value={readyToHandover}
          style={{ fontSize: "24px", fontWeight: "bold", color: "#13c2c2" }}
        />
      </Card>
    </div>
  );
};

export default AssignedUsersTable;
