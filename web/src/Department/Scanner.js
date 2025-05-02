import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

import {
  Layout,
  Typography,
  Input,
  Space,
  Button,
} from "antd";
import {
  PlusOutlined,
  StockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";

const { Title } = Typography;
const { Content } = Layout;

const Scanner = () => {
  const webcamRef = useRef(null);
  const [scanned, setScanned] = useState(null);
  const navigate = useNavigate();
  const [loggedInUserType, setLoggedInUserType] = useState('');

  // Determine if it's a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const videoConstraints = {
    facingMode: isMobile ? 'environment' : 'user'
  };

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  const handleScan = () => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState !== 4) {
      alert('Camera not ready. Please wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      setScanned(code.data);
      navigate(`/details/${code.data}`);
    } else {
      alert('No QR code found');
    }
  };

  return (
    <LayoutNew userType={loggedInUserType}>
      <Layout>
        <Content style={{ padding: "24px" }}>
          {/* Page header */}
          <Space
            style={{
              background: "#001529",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Space>
              <StockOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              <Title level={2} style={{ fontSize: "24px", margin: 0, color: "white" }}>
                QR Code Scanner
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
                Add New Supplier
              </Button>
            </div>
          </Space>

          <br /><br />

          <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={() => {}}
              style={{ marginRight: "8px" }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh'
          }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={500}
              height={320}
              videoConstraints={videoConstraints}
            />
            <div style={{ marginTop: "20px" }}>
              <Button type="primary" onClick={handleScan}>
                Scan
              </Button>
            </div>
            <br />
            {scanned && <p>Scanned: {scanned}</p>}
          </div>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default Scanner;
