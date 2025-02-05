import React from "react";
import { Table, Button, Select, Popconfirm, Tag } from "antd";
import moment from "moment";

const { Option } = Select;

const UserTable = ({
  users,
  managers,
  handleDeleteUser,
  handleAssignManagers,
}) => {
  const columns = [
    { title: "UID", dataIndex: "uid" },
    {
      title: "Date (AMAZON)",
      dataIndex: "dateAmazon",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "Enrollment ID AMAZON",
      dataIndex: "enrollmentIdAmazon",
    },
    {
      title: "Date (WEBSITE)",
      dataIndex: "dateWebsite",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
    },
    { title: "Enrollment ID WEBSITE", dataIndex: "enrollmentIdWebsite" },
    { title: "Batch (WEBSITE)", dataIndex: "batchWebsite" },
    { title: "Batch (AMAZON)", dataIndex: "batchAmazon" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "GST",
      dataIndex: "gstNumber",
      render: (gstNumber) => (gstNumber ? gstNumber : "N/A"),
    },
    {
      title: "State",
      dataIndex: "state",
      render: (state) => (state ? state : "N/A"),
    },
    { title: "Primary Contact", dataIndex: "primaryContact" },
    { title: "Secondary Contact", dataIndex: "secondaryContact" },
    { title: "Password", dataIndex: "password" },
    {
      title: "Assigned Managers",
      render: (_, record) =>
        record.managers && record.managers.length > 0 ? (
          record.managers.map((manager) => (
            <Tag color="blue" key={manager._id}>
              {manager.name}
            </Tag>
          ))
        ) : (
          <Tag color="red">No Managers Assigned</Tag>
        ),
    },
    {
      title: "Assign Managers",
      render: (_, record) => (
        <Select
          mode="multiple"
          placeholder="Select Managers"
          style={{ width: "100%" }}
          onChange={(value) => handleAssignManagers(record._id, value)}
          defaultValue={record.managers?.map((manager) => manager._id)}
        >
          {managers.map((manager) => (
            <Option key={manager._id} value={manager._id}>
              {manager.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      dataSource={users}
      rowKey="_id"
      columns={columns}
      scroll={{ x: 1200 }} // Enable horizontal scrolling for responsiveness
    />
  );
};

export default UserTable;
