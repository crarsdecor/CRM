import React, { useEffect, useState } from "react";
import { Tabs, Button, Spin, Layout, Typography, Space } from "antd";
import AmazonPasswords from "./AMAZON/Passwords/AmazonPasswords";
import { LogoutOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import AmazonDashboard from "./AMAZON/AmazonDashboard";
import WebsiteDashboard from "./WEBSITE/WebsiteDashboard";
import Main from "./WEBSITE/Main/Main";
import Stage1Website from "./WEBSITE/Stage1/Stage1Website";
import Stage2Website from "./WEBSITE/Stage2/Stage2Website";
import Stage3Website from "./WEBSITE/Stage3/Stage3Website";
import Archive from "./WEBSITE/Archive/Archive";
import Operations from "./AMAZON/Operations/Operations";
import Growth from "./AMAZON/Growth/Growth";
import axios from "axios";
import "./ManagerDashboard.css";
import { useNavigate } from "react-router-dom";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.id) {
      axios
        .get(`${apiUrl}/api/users/${user.id}`)
        .then((response) => {
          setService(response.data.service);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch user data");
          setLoading(false);
        });
    } else {
      setError("No user data found in local storage");
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
      >
        <Title level={4} type="danger">
          {error}
        </Title>
      </div>
    );
  }

  const tabsItems =
    service === "Amazon"
      ? [
          {
            label: "Amazon",
            key: "1",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AmazonDashboard />
              </motion.div>
            ),
          },
          {
            label: "Operations",
            key: "2",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Operations />
              </motion.div>
            ),
          },
          {
            label: "Growth",
            key: "3",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Growth />
              </motion.div>
            ),
          },
        ]
      : service === "Website"
      ? [
          {
            label: "Website",
            key: "4",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <WebsiteDashboard />
              </motion.div>
            ),
          },
          {
            label: "Main",
            key: "5",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Main />
              </motion.div>
            ),
          },
          {
            label: "Stage 1 (WEBSITE)",
            key: "6",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Stage1Website />
              </motion.div>
            ),
          },
          {
            label: "Stage 2 (WEBSITE)",
            key: "7",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Stage2Website />
              </motion.div>
            ),
          },
          {
            label: "Stage 3 (WEBSITE)",
            key: "8",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Stage3Website />
              </motion.div>
            ),
          },
          {
            label: "Archive",
            key: "9",
            children: (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Archive />
              </motion.div>
            ),
          },
        ]
      : [];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="header-container"
      >
        <div className="header-content">
          <Title
            level={3}
            style={{
              color: "#fff",
              margin: 0,
              textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            }}
          >
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
      <Content
        style={{
          padding: "24px",
          width: "100%",
          overflowX: "auto",
          paddingTop: "4rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs
            defaultActiveKey={tabsItems[0]?.key || "1"}
            tabBarStyle={{ marginBottom: "24px" }}
            size="large"
            items={tabsItems}
          />
        </motion.div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        <Space split={<span style={{ color: "#d9d9d9" }}>|</span>}>
          <Text
            style={{
              color: "#001529",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Saumic Craft ©2024
          </Text>
          <Text
            style={{
              color: "#1890ff",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Powered by
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
};

export default ManagerDashboard;
