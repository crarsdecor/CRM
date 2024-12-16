// import React, { useEffect, useState } from "react";
// import { Table, Spin, message, Switch } from "antd";
// import axios from "axios";
// import moment from "moment";

// const apiUrl = process.env.REACT_APP_BACKEND_URL;

// const Main = () => {
//   const [assignedUsers, setAssignedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAssignedUsers = async () => {
//       try {
//         // Retrieve manager data from local storage
//         const manager = JSON.parse(localStorage.getItem("user"));

//         if (!manager || !manager.id) {
//           message.error("Manager data not found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         // API call to fetch users assigned to the manager
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

//   const toggleCallDone = async (userId, currentStatus) => {
//     try {
//       // Determine the new status
//       const newStatus = currentStatus === "Done" ? "Not Done" : "Done";

//       // Optimistically update the UI
//       const updatedUsers = assignedUsers.map((user) =>
//         user._id === userId ? { ...user, callDone: newStatus } : user
//       );
//       setAssignedUsers(updatedUsers);

//       // API call to update the status in the backend
//       await axios.put(`${apiUrl}/api/users/${userId}`, {
//         callDone: newStatus,
//       });

//       message.success("Call status updated successfully.");
//     } catch (error) {
//       message.error("Failed to update call status. Please try again.");
//     }
//   };

//   const columns = [
//     {
//       title: "UID",
//       dataIndex: "uid",
//       key: "uid",
//     },
//     {
//       title: "Date (Website)",
//       dataIndex: "dateWebsite",
//       key: "dateWebsite",
//       render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "-"),
//     },
//     {
//       title: "Enrollment ID (Website)",
//       dataIndex: "enrollmentIdWebsite",
//       key: "enrollmentIdWebsite",
//     },
//     {
//       title: "Password",
//       dataIndex: "password",
//       key: "password",
//     },
//     {
//       title: "Call Done",
//       key: "callDone",
//       render: (_, record) => (
//         <Switch
//           checked={record.callDone === "Done"}
//           onChange={() => toggleCallDone(record._id, record.callDone)}
//           checkedChildren="Done"
//           unCheckedChildren="Not Done"
//         />
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
//       />
//     </div>
//   );
// };

// export default Main;




import React, { useEffect, useState } from "react";
import { Table, Spin, message, Switch, Button } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Main = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Filter: all, archived, shifted, refunded

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

  const toggleStatus = async (userId, field, currentStatus) => {
    try {
      const newStatus = currentStatus === "Done" ? "Not Done" : "Done";

      // Optimistically update the UI
      const updatedUsers = assignedUsers.map((user) =>
        user._id === userId ? { ...user, [field]: newStatus } : user
      );
      setAssignedUsers(updatedUsers);

      // API call to update the status in the backend
      await axios.put(`${apiUrl}/api/users/${userId}`, {
        [field]: newStatus,
      });

      message.success(`${field} status updated successfully.`);
    } catch (error) {
      message.error(`Failed to update ${field} status. Please try again.`);
    }
  };

  const filteredUsers = assignedUsers.filter((user) => {
    if (filter === "all") return true;
    if (filter === "archiveWebsite") return user.archiveWebsite === "Done";
    if (filter === "shifted") return user.shiftToAmazon === "Done";
    if (filter === "refunded") return user.refunded === "Done";
    return true;
  });

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Date (Website)",
      dataIndex: "dateWebsite",
      key: "dateWebsite",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Enrollment ID (Website)",
      dataIndex: "enrollmentIdWebsite",
      key: "enrollmentIdWebsite",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Call Done",
      key: "callDone",
      render: (_, record) => (
        <Switch
          checked={record.callDone === "Done"}
          onChange={() => toggleStatus(record._id, "callDone", record.callDone)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      ),
    },
    {
      title: "Shift to Amazon",
      key: "shiftToAmazon",
      render: (_, record) => (
        <Switch
          checked={record.shiftToAmazon === "Done"}
          onChange={() => toggleStatus(record._id, "shiftToAmazon", record.shiftToAmazon)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      ),
    },
    {
      title: "Refunded",
      key: "refunded",
      render: (_, record) => (
        <Switch
          checked={record.refunded === "Done"}
          onChange={() => toggleStatus(record._id, "refunded", record.refunded)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      ),
    },
    {
      title: "Archive",
      key: "archiveWebsite",
      render: (_, record) => (
        <Switch
          checked={record.archiveWebsite === "Done"}
          onChange={() => toggleStatus(record._id, "archiveWebsite", record.archiveWebsite)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
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
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <Button type={filter === "all" ? "primary" : "default"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button type={filter === "archived" ? "primary" : "default"} onClick={() => setFilter("archiveWebsite")}>
          Archived
        </Button>
        <Button type={filter === "shifted" ? "primary" : "default"} onClick={() => setFilter("shifted")}>
          Shifted to Amazon
        </Button>
        <Button type={filter === "refunded" ? "primary" : "default"} onClick={() => setFilter("refunded")}>
          Refunded
        </Button>
      </div>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        bordered
      />
    </div>
  );
};

export default Main;
