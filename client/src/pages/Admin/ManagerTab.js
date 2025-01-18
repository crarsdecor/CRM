import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Select, Modal, message } from 'antd';
import axios from 'axios';

const { Option } = Select;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ManagerTab = () => {
    const [managers, setManagers] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchManagers = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/users?role=manager`);
            setManagers(data);
        } catch (error) {
            message.error('Failed to fetch managers');
        }
    };


    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
            setUsers(data);
        } catch (error) {
            message.error('Failed to fetch users');
        }
    };


    useEffect(() => {
        fetchManagers();
        fetchUsers();
    }, []);


    const handleCreateManager = async (values) => {
        try {
            setLoading(true);
            await axios.post(`${apiUrl}/api/users`, { ...values, role: 'manager' });
            message.success('Manager created successfully');
            fetchManagers();
        } catch (error) {
            message.error('Failed to create manager');
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteManager = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/users/${id}`);
            message.success('Manager deleted successfully');
            fetchManagers();
            setSelectedManager(null);
        } catch (error) {
            message.error('Failed to delete manager');
        }
    };


    const handleSelectManager = (manager) => {
        setSelectedManager(manager);
        setAssignedUsers(users.filter((user) => user.manager === manager._id));
    };

    const handleAssignUser = async (userId) => {
        try {
            await axios.put(`${apiUrl}/api/users/${userId}`, { managerId: selectedManager._id });
            message.success('User assigned to manager');
            fetchUsers();
            handleSelectManager(selectedManager);
        } catch (error) {
            message.error('Failed to assign user');
        }
    };


    const handleUnassignUser = async (userId) => {
        try {
            await axios.put(`${apiUrl}/api/users/${userId}`, { managerId: null });
            message.success('User unassigned from manager');
            fetchUsers();
            handleSelectManager(selectedManager);
        } catch (error) {
            message.error('Failed to unassign user');
        }
    };

    return (
        <div>
            <Form layout="inline" onFinish={handleCreateManager}>
                <Form.Item name="name" rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="Manager Name" />
                </Form.Item>
                <Form.Item name="uid" rules={[{ required: true, message: 'Position is required' }]}>
                    <Input placeholder="Manager Position" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'Email is required' }]}>
                     <Input placeholder="Manager Email"/>   
                </Form.Item>
                <Form.Item name="service">
                     <Input placeholder="Manager Service"/>   
                </Form.Item>
                <Form.Item name="primaryContact">
                     <Input placeholder="Manager Primary Contact"/>   
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Password is required' }]}>
                      <Input.Password placeholder="Password"/>  
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Manager
                </Button>
            </Form>

            <Table
            dataSource={managers}
            rowKey="_id"
            columns={[
                { title: 'Position', dataIndex: 'uid' },
                { title: 'Name', dataIndex: 'name' },
                { title: 'Email', dataIndex: 'email' },
                { title: 'Primary Contact', dataIndex: 'primaryContact' },
                { title: 'Service', dataIndex: 'service' },
                { title: 'Password', dataIndex: 'password' },
                {
                    title: 'Actions',
                    render: (_, record) => (
                        <Button danger onClick={() => handleDeleteManager(record._id)}>
                            Delete
                        </Button>
                    ),
                },
            ]}
            onRow={(record) => ({
                onClick: () => handleSelectManager(record),
            })}
            style={{ marginTop: 20 }}
            />


            {selectedManager && (
                <>
                <h3>Manage Users for {selectedManager.name}</h3>
                <Table
                dataSource={users}
                rowKey="_id"
                columns={[
                    { title: 'Name', dataIndex: 'name' },
                    { title: 'Email', dataIndex: 'email' },
                    {
                        title: 'Actions',
                        render: (_, record) =>
                          assignedUsers.find((u) => u._id === record._id) ? (
                            <Button onClick={() => handleUnassignUser(record._id)}>Unassign</Button>
                          ) : (
                            <Button onClick={() => handleAssignUser(record._id)}>Assign</Button>
                          ),   
                    },
                ]}
                style={{ marginTop: 20 }}
                />
                </>
            )}
        </div>
    );

};

export default ManagerTab;