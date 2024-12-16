import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const FbaModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fbaCom, setFbaCom] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setFbaCom(user.fbaCom || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        fbaCom,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        fbaCom,
      });

      message.success("FBA updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update FBA. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update FBA"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>FBA:</label>
        <Select
          value={fbaCom}
          onChange={(value) => setFbaCom(value)}
          style={{ width: "100%" }}
          placeholder="Select FBA status"
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default FbaModal;
