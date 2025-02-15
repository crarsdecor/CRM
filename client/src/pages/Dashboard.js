// import React from 'react';
// import { Card, Tabs, Button } from 'antd';
// import { LogoutOutlined } from '@ant-design/icons';
// import ManagerDashboard from './Admin/ManagerTab';
// import UserDashboard from './Admin/UserTab';
// import AccountantTab from './Admin/Accountant/AccountantTab';

// const { TabPane } = Tabs;

// const Dashboard = () => {
//   const handleLogout = () => {
//     localStorage.clear(); // Clear all local storage
//     window.location.reload(); // Optionally redirect to the login page
//   };

//   return (
//     <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
//       <Card
//         style={{
//           width: '100%',
//           maxWidth: '1200px',
//           borderRadius: '8px',
//           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//         }}
//         bodyStyle={{ padding: '24px' }}
//       >
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//           <h2 style={{ margin: 0 }}>Dashboard</h2>
//           <Button
//             type="primary"
//             danger
//             icon={<LogoutOutlined />}
//             onClick={handleLogout}
//           >
//             Logout
//           </Button>
//         </div>
//         <Tabs defaultActiveKey="1" centered>
//           <TabPane tab="Manage Managers" key="1">
//             <ManagerDashboard />
//           </TabPane>
//           <TabPane tab="Manage Users" key="2">
//             <UserDashboard />
//           </TabPane>
//           <TabPane tab="Manage Accountant" key="3">
//             <AccountantTab />
//           </TabPane>
//         </Tabs>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import { Tabs, Button, Layout, Typography, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ManagerDashboard from "./Admin/ManagerTab";
import UserDashboard from "./Admin/UserTab";
import AccountantTab from "./Admin/Accountant/AccountantTab";
import "./Dashboard.css";
import { Navigate, useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

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
            Admin Dashboard
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
            defaultActiveKey="1"
            tabBarStyle={{ marginBottom: "24px" }}
            size="large"
          >
            <TabPane tab="Managers" key="1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ManagerDashboard />
              </motion.div>
            </TabPane>
            <TabPane tab="Users" key="2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <UserDashboard />
              </motion.div>
            </TabPane>
            <TabPane tab="Accountants" key="3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AccountantTab />
              </motion.div>
            </TabPane>
          </Tabs>
        </motion.div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <Space split={<span style={{ color: "#d9d9d9" }}>|</span>}>
          <Text
            style={{ color: "#001529", fontWeight: "500", fontSize: "14px" }}
          >
            Crarts Decor ©2024
          </Text>
          <Text
            style={{ color: "#1890ff", fontWeight: "500", fontSize: "14px" }}
          >
            Powered by CreativeAvi
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
};

export default Dashboard;
