// import React, { useEffect, useState } from 'react';
// import { Button, message } from 'antd';
// import axios from 'axios';
// import UserModal from './UserModal';
// import UserTable from './UserTable';

// const apiUrl = process.env.REACT_APP_BACKEND_URL;

// const UserTab = () => {
//   const [users, setUsers] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const fetchUsers = async () => {
//     try {
//       const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
//       setUsers(data);
//     } catch (error) {
//       message.error('Failed to fetch users');
//     }
//   };

//   const fetchManagers = async () => {
//     try {
//       const { data } = await axios.get(`${apiUrl}/api/users?role=manager`);
//       setManagers(data);
//     } catch (error) {
//       message.error('Failed to fetch managers');
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchManagers();
//   }, []);

//   const handleDeleteUser = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/users/${id}`);
//       message.success('User deleted successfully');
//       fetchUsers();
//     } catch (error) {
//       message.error('Failed to delete user');
//     }
//   };

//   const handleAssignManagers = async (userId, managerIds) => {
//     try {
//       await axios.put(`${apiUrl}/api/users/${userId}`, { managerIds });
//       message.success('Managers assigned successfully');
//       fetchUsers();
//     } catch (error) {
//       message.error('Failed to assign managers');
//     }
//   };

//   return (
//     <div>
//       <h2>User Management</h2>
//       <Button
//         type="primary"
//         style={{ marginBottom: 20 }}
//         onClick={() => setIsModalVisible(true)}
//       >
//         Add User
//       </Button>
//       <UserTable
//         users={users}
//         managers={managers}
//         handleDeleteUser={handleDeleteUser}
//         handleAssignManagers={handleAssignManagers}
//       />
//       <UserModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         fetchUsers={fetchUsers}
//         managers={managers}
//       />
//     </div>
//   );
// };

// export default UserTab;





import React, { useEffect, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import UserModal from './UserModal';
import UserTable from './UserTable';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const UserTab = () => {
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    }
  };

  const fetchManagers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=manager`);
      setManagers(data);
    } catch (error) {
      message.error('Failed to fetch managers');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchManagers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/users/${id}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleAssignManagers = async (userId, managerIds) => {
    try {
      await axios.put(`${apiUrl}/api/users/${userId}`, { managerIds });
      message.success('Managers assigned successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to assign managers');
    }
  };

  const handleCsvUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('CSV uploaded successfully');
      fetchUsers(); // Refresh users after upload
    } catch (error) {
      message.error('Failed to upload CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginRight: 10 }}
        >
          Add User
        </Button>
        <Upload
          beforeUpload={(file) => {
            handleCsvUpload(file);
            return false; // Prevent auto upload by Ant Design
          }}
          accept=".csv"
          showUploadList={false}
        >
          <Button type="default" icon={<UploadOutlined />} loading={loading}>
            Bulk Import CSV
          </Button>
        </Upload>
      </div>
      <UserTable
        users={users}
        managers={managers}
        handleDeleteUser={handleDeleteUser}
        handleAssignManagers={handleAssignManagers}
      />
      <UserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        fetchUsers={fetchUsers}
        managers={managers}
      />
    </div>
  );
};

export default UserTab;
