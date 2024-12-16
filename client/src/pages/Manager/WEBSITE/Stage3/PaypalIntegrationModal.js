import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const PaypalIntegrationModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [readyToHandover, setReadyToHandover] = useState(false);
  const [readyToHandoverDate, setReadyToHandoverDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setReadyToHandover(user.readyToHandover === "Done"); // Map "Done" to true and others to false
      setReadyToHandoverDate(
        user.readyToHandoverDate ? moment(user.readyToHandoverDate) : null
      );
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        readyToHandover: readyToHandover ? "Done" : "Not Done",
        readyToHandoverDate: readyToHandoverDate
          ? readyToHandoverDate.toISOString()
          : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        readyToHandover: optimisticUser.readyToHandover,
        readyToHandoverDate: optimisticUser.readyToHandoverDate,
      });

      message.success("Ready to Handover details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Ready to Handover details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Ready to Handover Details"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={readyToHandover}
          onChange={(checked) => setReadyToHandover(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={readyToHandoverDate}
          onChange={(date) => setReadyToHandoverDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Ready to Handover Date"
        />
      </div>
    </Modal>
  );
};

export default PaypalIntegrationModal;
