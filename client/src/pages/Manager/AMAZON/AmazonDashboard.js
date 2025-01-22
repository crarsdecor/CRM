import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  message,
  Typography,
  Input,
  Modal,
  Form,
  Button,
} from "antd";
import axios from "axios";

const { Title } = Typography;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AssignedUsersTable = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem("user"));

        if (!manager || !manager.id) {
          message.error("Manager data not found. Please log in again.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${apiUrl}/api/users?managerId=${manager.id}`
        );
        setAssignedUsers(data);
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      enrollmentIdAmazon: user.enrollmentIdAmazon,
      enrollmentIdWebsite: user.enrollmentIdWebsite,
      primaryContact: user.primaryContact,
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      const updatedUser = { ...selectedUser, ...values };
      await axios.put(
        `${apiUrl}/api/users/update/${selectedUser._id}`,
        updatedUser
      );
      message.success("User details updated successfully!");

      // Update the local state with the edited user
      setAssignedUsers((prev) =>
        prev.map((user) =>
          user.uid === selectedUser.uid ? { ...user, ...values } : user
        )
      );

      setIsModalVisible(false);
      setSelectedUser(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update user details.");
    }
  };

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Enrollment ID",
      dataIndex: "enrollmentIdAmazon",
      key: "enrollmentIdAmazon",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Primary Contact",
      dataIndex: "primaryContact",
      key: "primaryContact",
      render: (contact) => {
        if (!contact) return "N/A";
        return contact.replace(/\d(?=\d{4})/g, "*");
      },
    },
    {
      title: "Batch",
      dataIndex: "batchAmazon",
      key: "batchAmazon",
    },
    {
      title: "Date Amazon",
      dataIndex: "dateAmazon",
      key: "dateAmazon",
      render: (date) => new Date(date).toDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, user) => (
        <Button type="link" onClick={() => handleEdit(user)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = assignedUsers.filter(
    (user) =>
      user.uid.toLowerCase().includes(searchText.toLowerCase()) ||
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.enrollmentIdAmazon.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full pb-2 mb-4 px-4 bg-gradient-to-r from-blue-500 to-red-300 shadow-lg rounded-lg">
        <h1 className="text-2xl p-2 font-bold text-white">All Users</h1>
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg mb-4">
        <div>
          <Input
            placeholder="Search by UID, Name, Email, or Enrollment ID"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: "16px", width: "30%" }}
          />
          <h2 className="font-bold">Total Users: {assignedUsers.length}</h2>
        </div>
        <Table
          dataSource={filteredUsers.map((user, index) => ({
            ...user,
            key: index,
          }))}
          columns={columns}
          pagination={{ pageSize: 100 }}
          bordered
        />
      </div>

      <Modal
        title={
          <h2 className="text-xl font-bold text-gray-800">Edit User Details</h2>
        }
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        className="rounded-lg shadow-lg"
        bodyStyle={{
          backgroundColor: "#f9fafb", // Tailwind's `bg-gray-100`
          borderRadius: "8px",
        }}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="font-semibold text-gray-700">Name</span>}
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input className="rounded-lg shadow-sm border-gray-300" />
          </Form.Item>
          <Form.Item
            label={<span className="font-semibold text-gray-700">Email</span>}
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input className="rounded-lg shadow-sm border-gray-300" />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Enrollment ID (Amazon)
              </span>
            }
            name="enrollmentIdAmazon"
          >
            <Input className="rounded-lg shadow-sm border-gray-300" />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Enrollment ID (Website)
              </span>
            }
            name="enrollmentIdWebsite"
          >
            <Input className="rounded-lg shadow-sm border-gray-300" />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Primary Contact
              </span>
            }
            name="primaryContact"
          >
            <Input className="rounded-lg shadow-sm border-gray-300" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssignedUsersTable;
