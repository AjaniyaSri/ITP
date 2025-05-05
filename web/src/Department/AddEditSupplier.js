import React from "react";
import { Form, Row, Col, Input, Button } from "antd";

const SupplierForm = ({ form, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="contact"
            label="Contact"
            rules={[
              { required: true, message: "Please input contact!" },
              {
                pattern: /^0[0-9]{9}$/,
                message: "Please enter a valid 10-digit phone number starting with 0!",
              },
          
            ]}         
            >
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="address" label="Address"   rules={[
    { required: true, message: "Please enter your address!" },
    { min: 10, message: "Address must be at least 10 characters!" },
    { max: 100, message: "Address cannot exceed 100 characters!" },
    {
      pattern: /^[a-zA-Z0-9\s,.'-]{10,100}$/,
      message: "Please enter a valid address!",
    },
  ]}
>
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SupplierForm;
