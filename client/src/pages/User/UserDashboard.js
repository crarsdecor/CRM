import React, { useEffect, useState } from "react";
import { Tabs, Button, Spin, Layout, Typography, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import AmazonDashboard from "./AMAZON/AmazonDashboard";
import WebsiteDashboard from "./WEBSITE/WebsiteDashboard";
import axios from "axios";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
import UserDash from "./UserDash";

const { TabPane } = Tabs;
const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const UserDashboard = () => {
  const navigate = useNavigate();
  const [enrollmentIdAmazon, setEnrollmentIdAmazon] = useState(null);
  const [enrollmentIdWebsite, setEnrollmentIdWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.id) {
      axios
        .get(`${apiUrl}/api/users/${user.id}`)
        .then((response) => {
          setEnrollmentIdAmazon(response.data.enrollmentIdAmazon);
          setEnrollmentIdWebsite(response.data.enrollmentIdWebsite);
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
            User Dashboard
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
        <UserDash />
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs
            defaultActiveKey="1"
            tabBarStyle={{ marginBottom: "24px" }}
            size="large"
          >
            {enrollmentIdAmazon && (
              <>
                <TabPane tab="Amazon" key="1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AmazonDashboard />
                  </motion.div>
                </TabPane>
              </>
            )}
            {enrollmentIdWebsite && (
              <>
                <TabPane tab="Website" key="4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <WebsiteDashboard />
                  </motion.div>
                </TabPane>
              </>
            )}
          </Tabs>
        </motion.div> */}
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
            Powered SaumicCraft
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
};

export default UserDashboard;

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import AmazonDashboard from "./AMAZON/AmazonDashboard";
// import IN from "./AMAZON/IN";
// import COM from "./AMAZON/COM";
// import WebsiteDashboard from "./WEBSITE/WebsiteDashboard";
// import Stage1 from "./WEBSITE/Stage1";
// import Stage2 from "./WEBSITE/Stage2";
// import Stage3 from "./WEBSITE/Stage3";
// import axios from "axios";

// const apiUrl = process.env.REACT_APP_BACKEND_URL;

// const UserDashboard = () => {
//   const [activeTab, setActiveTab] = useState("Amazon");
//   const [enrollmentIdAmazon, setEnrollmentIdAmazon] = useState(null);
//   const [enrollmentIdWebsite, setEnrollmentIdWebsite] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user.id) {
//       axios
//         .get(`${apiUrl}/api/users/${user.id}`)
//         .then((response) => {
//           setEnrollmentIdAmazon(response.data.enrollmentIdAmazon);
//           setEnrollmentIdWebsite(response.data.enrollmentIdWebsite);
//           setLoading(false);
//         })
//         .catch(() => {
//           setError("Failed to fetch user data");
//           setLoading(false);
//         });
//     } else {
//       setError("No user data found in local storage");
//       setLoading(false);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.reload();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="spinner border-t-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <h1 className="text-red-600 text-lg">{error}</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="fixed top-0 w-full bg-gradient-to-r from-[#001529] to-[#004080] text-white py-4 px-6 shadow-lg z-50 border-b border-opacity-10"
//       >
//         <div className="flex justify-between items-center">
//           <h1 className="text-lg font-semibold">User Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-gradient-to-r from-[#ff4d4f] to-[#ff7875] text-white rounded shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
//           >
//             Logout
//           </button>
//         </div>
//       </motion.div>

//       {/* Content */}
//       <div className="pt-24 px-6">
//         {/* Tabs */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           {enrollmentIdAmazon && (
//             <>
//               <button
//                 onClick={() => setActiveTab("Amazon")}
//                 className={`px-6 py-3 rounded-lg font-medium ${
//                   activeTab === "Amazon"
//                     ? "bg-gradient-to-r from-[#001529] to-[#004080] text-white shadow-lg"
//                     : "bg-gray-200 text-gray-700"
//                 } hover:shadow-md transition`}
//               >
//                 Amazon
//               </button>
//               <button
//                 onClick={() => setActiveTab("IN")}
//                 className={`px-6 py-3 rounded-lg font-medium ${
//                   activeTab === "IN"
//                     ? "bg-gradient-to-r from-[#001529] to-[#004080] text-white shadow-lg"
//                     : "bg-gray-200 text-gray-700"
//                 } hover:shadow-md transition`}
//               >
//                 IN
//               </button>
//               <button
//                 onClick={() => setActiveTab("COM")}
//                 className={`px-6 py-3 rounded-lg font-medium ${
//                   activeTab === "COM"
//                     ? "bg-gradient-to-r from-[#001529] to-[#004080] text-white shadow-lg"
//                     : "bg-gray-200 text-gray-700"
//                 } hover:shadow-md transition`}
//               >
//                 COM
//               </button>
//             </>
//           )}
//           {enrollmentIdWebsite && (
//             <>
//               <button
//                 onClick={() => setActiveTab("Website")}
//                 className={`px-6 py-3 rounded-lg font-medium ${
//                   activeTab === "Website"
//                     ? "bg-gradient-to-r from-[#001529] to-[#004080] text-white shadow-lg"
//                     : "bg-gray-200 text-gray-700"
//                 } hover:shadow-md transition`}
//               >
//                 Website
//               </button>
//               <button
//                 onClick={() => setActiveTab("Stage1")}
//                 className={`px-6 py-3 rounded-lg font-medium ${
//                   activeTab === "Stage1"
//                     ? "bg-gradient-to-r from-[#001529] to-[#004080] text-white shadow-lg"
//                     : "bg-gray-200 text-gray-700"
//                 } hover:shadow-md transition`}
//               >
//                 Stage1
//               </button>
//               <button
//                 onClick={() => setActiveTab("Stage2")}
//                 className={`px-6 py-3 rounded-lg font-medium ${
//                   activeTab === "Stage2"
//                     ? "bg-gradient-to-r from-[#001529] to-[#004080] text-white shadow-lg"
//                     : "bg-gray-200 text-gray-700"
//                 } hover:shadow-md transition`}
//               >
//                 Stage2
//               </button>
//               <button
//                 onClick={() => setActiveTab("Stage3")}
//                 className={`px-6 py-3 rounded-lg font-medium ${
//                   activeTab === "Stage3"
//                     ? "bg-gradient-to-r from-[#001529] to-[#004080] text-white shadow-lg"
//                     : "bg-gray-200 text-gray-700"
//                 } hover:shadow-md transition`}
//               >
//                 Stage3
//               </button>
//             </>
//           )}
//         </div>

//         {/* Active Tab Content */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           {activeTab === "Amazon" && <AmazonDashboard />}
//           {activeTab === "IN" && <IN />}
//           {activeTab === "COM" && <COM />}
//           {activeTab === "Website" && <WebsiteDashboard />}
//           {activeTab === "Stage1" && <Stage1 />}
//           {activeTab === "Stage2" && <Stage2 />}
//           {activeTab === "Stage3" && <Stage3 />}
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="text-center py-4 text-gray-700 text-sm">
//         <p>Crarts Decor ©2024 | Powered by CreativeAvi</p>
//       </footer>
//     </div>
//   );
// };

// export default UserDashboard;
