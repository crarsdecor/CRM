import React, { useState, useEffect } from "react";
import { Modal, Switch, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const LegalityModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [legalityAmazon, setLegalityAmazon] = useState(false);
  const [legalityAmazonDate, setLegalityAmazonDate] = useState(null);
  const [legalityAmazonLink, setLegalityAmazonLink] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setLegalityAmazon(user.legalityAmazon === "Done"); // Map "Done" to true and others to false
      setLegalityAmazonDate(user.legalityAmazonDate ? moment(user.legalityAmazonDate) : null);
      setLegalityAmazonLink(user.legalityAmazonLink || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        legalityAmazon: legalityAmazon ? "Done" : "Not Done",
        legalityAmazonDate: legalityAmazonDate ? legalityAmazonDate.toISOString() : null,
        legalityAmazonLink,
      };
      onUpdate(optimisticUser);
  
      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        legalityAmazon: optimisticUser.legalityAmazon,
        legalityAmazonDate: optimisticUser.legalityAmazonDate,
        legalityAmazonLink: optimisticUser.legalityAmazonLink,
      });
  
      message.success("Legality details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update legality details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  

  return (
    <Modal
      title="Update Legality Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Legality Status:</label>
        <Switch
          checked={legalityAmazon}
          onChange={(checked) => setLegalityAmazon(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Legality Date:</label>
        <DatePicker
          value={legalityAmazonDate}
          onChange={(date) => setLegalityAmazonDate(date)}
          style={{ width: "100%" }}
          placeholder="Select legality date"
        />
      </div>
      <div>
        <label>Legality Link:</label>
        <Input
          value={legalityAmazonLink}
          onChange={(e) => setLegalityAmazonLink(e.target.value)}
          placeholder="Enter legality link"
        />
      </div>
    </Modal>
  );
};

export default LegalityModal;
