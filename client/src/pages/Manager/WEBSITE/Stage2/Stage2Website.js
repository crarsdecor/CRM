// import React, { useEffect, useState } from "react";
// import { Table, Spin, message } from "antd";
// import axios from "axios";
// import Stage2PaymentModal from "./Stage2PaymentModal";
// import CatfileModal from "./CatfileModal";
// import LogoModal from "./LogoModal";
// import BannerModal from "./BannerModal";
// import GalleryModal from "./GalleryModal";
// import Stage2CompletionModal from "./Stage2CompletionModal";

// const apiUrl = process.env.REACT_APP_BACKEND_URL;

// const Stage2Website = () => {
//   const [assignedUsers, setAssignedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [modalState, setModalState] = useState({ visible: false, type: null });

//   useEffect(() => {
//     const fetchAssignedUsers = async () => {
//       try {
//         const manager = JSON.parse(localStorage.getItem("user"));

//         if (!manager || !manager.id) {
//           message.error("Manager data not found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         const { data } = await axios.get(`${apiUrl}/api/users?managerId=${manager.id}`);
//         setAssignedUsers(data);
//       } catch (error) {
//         message.error("Failed to fetch assigned users.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedUsers();
//   }, []);

//   const handleModalOpen = (user, type) => {
//     setSelectedUser(user);
//     setModalState({ visible: true, type });
//   };

//   const handleModalClose = () => {
//     setModalState({ visible: false, type: null });
//   };

//   const handleUpdateUser = (updatedUser) => {
//     setAssignedUsers((users) =>
//       users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
//     );
//   };

//   const columns = [
//     {
//         title: "Enrollment ID (Website)",
//         dataIndex: "enrollmentIdWebsite",
//         key: "enrollmentIdWebsite",
//         fixed: "left",
//         width: 200,
//       },
//     {
//         title: "Stage 2 Payment",
//         key: "stage2payment",
//         render: (_, record) => (
//           <a onClick={() => handleModalOpen(record, "stage2payment")}>
//             {record.stage2?.status || "Not Set"}
//           </a>
//         ),
//       },      
//     {
//       title: "CAT File",
//       key: "catFile",
//       render: (_, record) => (
//         <a onClick={() => handleModalOpen(record, "catFile")}>
//           {record.catFile || "Not Set"}
//         </a>
//       ),
//     },
//     {
//       title: "Logo",
//       key: "logo",
//       render: (_, record) => (
//         <a onClick={() => handleModalOpen(record, "logo")}>
//           {record.logo || "Not Set"}
//         </a>
//       ),
//     },
//     {
//       title: "Banner",
//       key: "banner",
//       render: (_, record) => (
//         <a onClick={() => handleModalOpen(record, "banner")}>
//           {record.banner || "Not Set"}
//         </a>
//       ),
//     },
//     {
//       title: "Gallery",
//       key: "gallery",
//       render: (_, record) => (
//         <a onClick={() => handleModalOpen(record, "gallery")}>
//           {record.gallery || "Not Set"}
//         </a>
//       ),
//     },
//     {
//       title: "Stage 2 Completion",
//       key: "stage2Completion",
//       render: (_, record) => (
//         <a onClick={() => handleModalOpen(record, "stage2Completion")}>
//           {record.stage2Completion || "Not Set"}
//         </a>
//       ),
//     },
//   ];

//   if (loading) {
//     return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
//   }

//   if (assignedUsers.length === 0) {
//     return <h3 style={{ textAlign: "center", marginTop: "20%" }}>No users assigned to you yet.</h3>;
//   }

//   return (
//     <div style={{ padding: "24px" }}>
//       <Table
//         dataSource={assignedUsers}
//         columns={columns}
//         rowKey="_id"
//         bordered
//         scroll={{ x: "max-content", y: 400 }}
//         sticky
//       />
//       {modalState.visible && modalState.type === "stage2payment" && selectedUser && (
//        <Stage2PaymentModal
//        user={selectedUser}
//        visible={modalState.visible}
//        onClose={handleModalClose}
//        onUpdate={handleUpdateUser}
//      />
//       )}
//       {modalState.visible && modalState.type === "catFile" && selectedUser && (
//         <CatfileModal
//           user={selectedUser}
//           visible={modalState.visible}
//           onClose={handleModalClose}
//           onUpdate={handleUpdateUser}
//         />
//       )}
//       {modalState.visible && modalState.type === "logo" && selectedUser && (
//         <LogoModal
//           user={selectedUser}
//           visible={modalState.visible}
//           onClose={handleModalClose}
//           onUpdate={handleUpdateUser}
//         />
//       )}
//       {modalState.visible && modalState.type === "banner" && selectedUser && (
//         <BannerModal
//           user={selectedUser}
//           visible={modalState.visible}
//           onClose={handleModalClose}
//           onUpdate={handleUpdateUser}
//         />
//       )}
//       {modalState.visible && modalState.type === "gallery" && selectedUser && (
//         <GalleryModal
//           user={selectedUser}
//           visible={modalState.visible}
//           onClose={handleModalClose}
//           onUpdate={handleUpdateUser}
//         />
//       )}
//       {modalState.visible && modalState.type === "stage2Completion" && selectedUser && (
//         <Stage2CompletionModal
//           user={selectedUser}
//           visible={modalState.visible}
//           onClose={handleModalClose}
//           onUpdate={handleUpdateUser}
//         />
//       )}
//     </div>
//   );
// };

// export default Stage2Website;



import React, { useEffect, useState } from "react";
import { Table, Spin, message, Input, Button, Space } from "antd";
import axios from "axios";
import Stage2PaymentModal from "./Stage2PaymentModal";
import CatfileModal from "./CatfileModal";
import LogoModal from "./LogoModal";
import BannerModal from "./BannerModal";
import GalleryModal from "./GalleryModal";
import Stage2CompletionModal from "./Stage2CompletionModal";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage2Website = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalState, setModalState] = useState({ visible: false, type: null });

  const [enrollmentIdMin, setEnrollmentIdMin] = useState("");
  const [enrollmentIdMax, setEnrollmentIdMax] = useState("");
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
        setFilteredUsers(data); // Initialize filteredUsers with full dataset
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  const handleFilter = () => {
    let filtered = [...assignedUsers];

    if (enrollmentIdMin && enrollmentIdMax) {
      const min = parseInt(enrollmentIdMin.replace(/[^\d]/g, ""), 10);
      const max = parseInt(enrollmentIdMax.replace(/[^\d]/g, ""), 10);

      filtered = filtered.filter((user) => {
        const enrollmentNumber = parseInt(user.enrollmentIdWebsite.replace(/[^\d]/g, ""), 10);
        return enrollmentNumber >= min && enrollmentNumber <= max;
      });
    }

    if (batchWebsite) {
      filtered = filtered.filter((user) =>
        user.batchWebsite?.toLowerCase().includes(batchWebsite.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleReset = () => {
    setEnrollmentIdMin("");
    setEnrollmentIdMax("");
    setBatchWebsite("");
    setFilteredUsers(assignedUsers);
  };

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
    setFilteredUsers((users) =>
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
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
      title: "Batch (Website)",
      dataIndex: "batchWebsite",
      key: "batchWebsite",
    },
    {
      title: "Stage 2 Payment",
      key: "stage2payment",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "stage2payment")}
          style={{
            backgroundColor: record.stage2?.status === "Done" ? "#d4edda" : "inherit",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {record.stage2?.status || "Not Set"}
        </a>
      ),
    },
    {
      title: "CAT File",
      key: "catFile",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "catFile")}
          style={{
            backgroundColor: record.catFile === "Done" ? "#d4edda" : "inherit",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {record.catFile || "Not Set"}
        </a>
      ),
    },
    {
      title: "Logo",
      key: "logo",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "logo")}
          style={{
            backgroundColor: record.logo === "Done" ? "#d4edda" : "inherit",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {record.logo || "Not Set"}
        </a>
      ),
    },
    {
      title: "Banner",
      key: "banner",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "banner")}
          style={{
            backgroundColor: record.banner === "Done" ? "#d4edda" : "inherit",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {record.banner || "Not Set"}
        </a>
      ),
    },
    {
      title: "Gallery",
      key: "gallery",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "gallery")}
          style={{
            backgroundColor: record.gallery === "Done" ? "#d4edda" : "inherit",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {record.gallery || "Not Set"}
        </a>
      ),
    },
    {
      title: "Stage 2 Completion",
      key: "stage2Completion",
      render: (_, record) => (
        <a
          onClick={() => handleModalOpen(record, "stage2Completion")}
          style={{
            backgroundColor: record.stage2Completion === "Done" ? "#d4edda" : "inherit",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {record.stage2Completion || "Not Set"}
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
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Min Enrollment ID"
          value={enrollmentIdMin}
          onChange={(e) => setEnrollmentIdMin(e.target.value)}
        />
        <Input
          placeholder="Max Enrollment ID"
          value={enrollmentIdMax}
          onChange={(e) => setEnrollmentIdMax(e.target.value)}
        />
        <Input
          placeholder="Batch (Website)"
          value={batchWebsite}
          onChange={(e) => setBatchWebsite(e.target.value)}
        />
        <Button type="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </Space>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        bordered
        scroll={{ x: "max-content", y: 400 }}
        sticky
      />
      {modalState.visible && modalState.type === "stage2payment" && selectedUser && (
        <Stage2PaymentModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
     {modalState.visible && modalState.type === "catFile" && selectedUser && (
        <CatfileModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "logo" && selectedUser && (
        <LogoModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "banner" && selectedUser && (
        <BannerModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "gallery" && selectedUser && (
        <GalleryModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "stage2Completion" && selectedUser && (
        <Stage2CompletionModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Stage2Website;
