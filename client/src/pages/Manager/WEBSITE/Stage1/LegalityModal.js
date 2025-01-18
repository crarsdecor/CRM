import React, { useState, useEffect } from "react";
import { Modal, Switch, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const LegalityModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [legalityWebsite, setLegalityWebsite] = useState(false);
  const [legalityWebsiteDate, setLegalityWebsiteDate] = useState(null);
  const [legalityWebsiteLink, setLegalityWebsiteLink] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setLegalityWebsite(user.legalityWebsite === "Done"); // Map "Done" to true and others to false
      setLegalityWebsiteDate(user.legalityWebsiteDate ? moment(user.legalityWebsiteDate) : null);
      setLegalityWebsiteLink(user.legalityWebsiteLink || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        legalityWebsite: legalityWebsite ? "Done" : "Not Done",
        legalityWebsiteDate: legalityWebsiteDate ? legalityWebsiteDate.toISOString() : null,
        legalityWebsiteLink,
      };
      onUpdate(optimisticUser);
  
      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        legalityWebsite: optimisticUser.legalityWebsite,
        legalityWebsiteDate: optimisticUser.legalityWebsiteDate,
        legalityWebsiteLink: optimisticUser.legalityWebsiteLink,
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
          checked={legalityWebsite}
          onChange={(checked) => setLegalityWebsite(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Legality Date:</label>
        <DatePicker
          value={legalityWebsiteDate}
          onChange={(date) => setLegalityWebsiteDate(date)}
          style={{ width: "100%" }}
          placeholder="Select legality date"
        />
      </div>
      <div>
        <label>Legality Link:</label>
        <Input
          value={legalityWebsiteLink}
          onChange={(e) => setLegalityWebsiteLink(e.target.value)}
          placeholder="Enter legality link"
        />
      </div>
    </Modal>
  );
};

export default LegalityModal;
