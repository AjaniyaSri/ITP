import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Modal,
  Space,
  Input,
  notification,
} from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { formatDate } from "../Common/date";
import { exportToPDF } from "../Common/report";

const { Title } = Typography;
const { Content } = Layout;

const BookingsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { field: "bookingId", headerName: "Booking ID", width: 150 },
    {
      field: "user",
      headerName: "Customer",
      width: 200,
      renderCell: (params) => {
        if (!params.value) return "Unknown";
        const ID = params.value.customerId || "N/A";
        const Name = params.value.firstName && params.value.lastName
          ? `${params.value.firstName} ${params.value.lastName}`
          : "Unknown";
        return (
          <div>
            <p>ID: {ID}</p>
            <p>Name: {Name}</p>
          </div>
        );
      },
    },
    {
      field: "room",
      headerName: "Room",
      width: 200,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        return (
          <div>
            <p>No: {params.value.number || "N/A"}</p>
            <p>Price: {params.value.price || "N/A"} LKR</p>
          </div>
        );
      },
    },
    {
      field: "checkInDate",
      headerName: "Check-in Date",
      width: 150,
      renderCell: (params) => formatDate(params.value) || "N/A",
    },
    {
      field: "checkOutDate",
      headerName: "Check-out Date",
      width: 150,
      renderCell: (params) => formatDate(params.value) || "N/A",
    },
    { field: "numberOfGuests", headerName: "Guests", width: 100 },
    {
      field: "status",
      headerName: "Booking Status",
      width: 200,
      renderCell: (params) => <span style={{ color: params.value === "Cancelled" ? "red" : "black" }}>{params.value || "N/A"}</span>,
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = data.map((row) => ({ id: row._id, ...row }))
      .filter((row) =>
        [row._id, row.user?.firstName, row.user?.lastName, row.room?.number, row.status]
          .some(term => term && term.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/bookings`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const generatePDF = () => {
    const columnsToExport = columns.filter((col) => col.field !== "action");
    const reportData = filteredData.map((booking) => {
      return {
        bookingId: booking.bookingId || "N/A",
        customer: booking.user ? `${booking.user.firstName || ""} ${booking.user.lastName || ""}` : "Unknown",
        room: booking.room ? booking.room.number || "N/A" : "N/A",
        checkInDate: formatDate(booking.checkInDate) || "N/A",
        checkOutDate: formatDate(booking.checkOutDate) || "N/A",
        guests: booking.numberOfGuests || "N/A",
        status: booking.status || "N/A",
      };
    });
    exportToPDF(columnsToExport, reportData, { title: "Room Reservations Report" });
  };

  return (
    <LayoutNew>
      <Layout>
        <Content style={{ padding: "24px" }}>
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <Space style={{ background: "#001529", color: "white", padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
              <Title level={2} style={{ color: "white" }}>Room Reservations</Title>
              <Button type="primary" icon={<FilePdfOutlined />} onClick={generatePDF}>Export to PDF</Button>
            </Space>
            <br />
            <Input placeholder="Search..." prefix={<SearchOutlined />} onChange={(e) => setSearchQuery(e.target.value)} style={{ marginBottom: "16px" }} />
            <div style={{ overflowX: "auto", width: "100%" }}>
              <DataGrid rows={filteredData} columns={columns} pageSize={5} disableSelectionOnClick />
            </div>
          </div>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default BookingsPage;