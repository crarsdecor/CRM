import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import axios from 'axios';
import AccountantModal from './AccountantModal';
import AccountantTable from './AccountantTable';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountantTab = () => {
  const [accountants, setAccountants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch accountants from the server
  const fetchAccountants = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=accountant`);
      setAccountants(data);
    } catch (error) {
      message.error('Failed to fetch accountants');
    }
  };

  useEffect(() => {
    fetchAccountants();
  }, []);

  // Handle accountant deletion
  const handleDeleteAccountant = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/users/${id}`);
      message.success('Accountant deleted successfully');
      fetchAccountants();
    } catch (error) {
      message.error('Failed to delete accountant');
    }
  };

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => setIsModalVisible(true)}
      >
        Add Accountant
      </Button>
      <AccountantTable
        accountants={accountants}
        handleDeleteAccountant={handleDeleteAccountant}
      />
      <AccountantModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        fetchAccountants={fetchAccountants}
      />
    </div>
  );
};

export default AccountantTab;
