import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const GmsModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [gmsIn, setGmsIn] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setGmsIn(user.gmsIn || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        gmsIn,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        gmsIn,
      });

      message.success("GMS updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update GMS. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update GMS"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>GMS:</label>
        <Input
          value={gmsIn}
          onChange={(e) => setGmsIn(e.target.value)}
          placeholder="Enter GMS value"
        />
      </div>
    </Modal>
  );
};

export default GmsModal;
