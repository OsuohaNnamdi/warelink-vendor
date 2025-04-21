import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { ClipLoader } from "react-spinners";
import { BiXCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ProfileCompletionAlert } from "./Admin/ProfileCompletionAlert";
import { Api } from "../APIs/Api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6B6B"];

const VendorHomepage = () => {
  const [user, setUser] = useState({ is_banned: false });
  const [salesData, setSalesData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [totalOrderItems, setTotalOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    bankaccount: null,
    bankname: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await Api.get('/api/user-profile/');
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        setUser(userData);
        setUserProfile({
          bankaccount: userData.bankaccount,
          bankname: userData.bankname
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch sales data
    const fetchSalesData = async () => {
      try {
        const response = await Api.get('/api/vendor-sales/');
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        Swal.fire({
          icon: "error",
          title: "Sales Data Error",
          text: "Could not load sales analytics data",
        });
      }
    };

    fetchUserData();
    fetchSalesData();
  }, []);

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!user.id) return;
      
      setLoading(true);
      try {
        const response = await Api.get("/api/orders/");
        // Extract order items belonging to this vendor
        const vendorItems = response.data.flatMap(order => 
          order.order_items
            .filter(item => item.vendor_id === user.id)
            .map(item => ({
              ...item,
              order_id: order.id,
              order_created_at: order.created_at,
              customer_details: order.customer_details,
              payment_info: order.payment_info
            }))
        );
        setTotalOrderItems(vendorItems);
        setOrderItems(vendorItems.slice(0, 5)); 
      } catch (err) {
        console.error("Error fetching order items:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch order items!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [user.id]);

  const handleCompleteProfile = (details) => {
    setUserProfile(prev => ({
      ...prev,
      bankname: details.bankname,
      bankaccount: details.bankaccount
    }));
  };

  const handleOrderItemClick = (orderId, itemId) => {
    navigate(`/order/${orderId}`);
  };

  // Prepare data for charts
  const categoryBarData = salesData?.salesByCategory?.map(item => ({
    name: item.category,
    quantity: item.quantity_sold,
    sales: item.total_sales
  })) || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <main className="main-content-wrapper position-relative">
      {user.is_banned && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}>
          <div className="text-center p-5 bg-white rounded-3 shadow-lg border border-danger">
            <BiXCircle className="text-danger mb-3" size={48} />
            <h2 className="text-danger mb-3">ACCOUNT BANNED</h2>
            <p className="mb-0">This account has been suspended. Please contact support.</p>
          </div>
        </div>
      )}
      
      <div className={`container ${user.is_banned ? 'pe-none' : ''}`} style={{ filter: user.is_banned ? 'blur(3px)' : 'none' }}>
        {/* Welcome Banner */}
        <div className="row mb-8">
          <div className="col-md-12">
            <Card className="bg-light border-0 rounded-4" style={{backgroundImage: 'url(../assets/images/slider/slider-image-1.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'right'}}>
              <Card.Body className="p-lg-12">
                <h1>Welcome back to your Dashboard!</h1>
                <p>Manage your products, track sales, and grow your business.</p>
                <a href="/add-product" className="btn btn-primary">Add New Product</a>
              </Card.Body>
            </Card>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="row mb-6">
              <div className="col-xl-4 col-md-6 col-12 mb-4">
                <Card className="h-100 card-lg">
                  <Card.Body className="p-6">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">Total Sales</h6>
                        <p className="mb-0 text-dark fs-4 fw-bold">
                          {salesData ? formatCurrency(salesData.netSales) : '$0'}
                        </p>
                      </div>
                      <div className="icon-shape bg-light-primary rounded-3">
                        <span className="fs-3 text-primary">₦</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-xl-4 col-md-6 col-12 mb-4">
                <Card className="h-100 card-lg">
                  <Card.Body className="p-6">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">Total Orders</h6>
                        <p className="mb-0 text-dark fs-4 fw-bold">{totalOrderItems.length}</p>
                      </div>
                      <div className="icon-shape bg-light-success rounded-3">
                        <i className="bi bi-box-seam fs-3 text-success"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-xl-4 col-md-6 col-12 mb-4">
                <Card className="h-100 card-lg">
                  <Card.Body className="p-6">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">Top Category</h6>
                        <p className="mb-0 text-dark fs-4 fw-bold">
                          {salesData?.salesByCategory?.[0]?.category || "N/A"}
                        </p>
                      </div>
                      <div className="icon-shape bg-light-warning rounded-3">
                        <i className="bi bi-trophy fs-3 text-warning"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Charts */}
            <div className="row mb-6">
              <div className="col-xl-6 col-12 mb-4">
                <Card className="h-100 card-lg">
                  <Card.Header className="bg-white py-4">
                    <h5 className="mb-0">Sales by Category</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBarData}
                            dataKey="sales"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryBarData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip 
                            formatter={(value) => formatCurrency(value)}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-xl-6 col-12 mb-4">
                <Card className="h-100 card-lg">
                  <Card.Header className="bg-white py-4">
                    <h5 className="mb-0">Quantity Sold by Category</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryBarData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="row">
              <div className="col-xl-12 col-12 mb-5">
                <Card className="h-100 card-lg">
                  <Card.Header className="bg-white py-4">
                    <h5 className="mb-0">Recent Orders</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table className="table-centered table-hover text-nowrap table-borderless mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item) => (
                            <tr key={item.id} onClick={() => handleOrderItemClick(item.order_id, item.id)} style={{ cursor: 'pointer' }}>
                              <td>#{item.id}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={item.product?.main_image || "https://via.placeholder.com/60"}
                                    alt={item.product?.name || "Product"}
                                    className="rounded me-3"
                                    width="60"
                                    height="60"
                                  />
                                  <div>
                                    <h6 className="mb-0">{item.product?.name || "Unknown Product"}</h6>
                                    <small className="text-muted">Qty: {item.quantity || 1}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{formatDate(item.order_created_at)}</td>
                              <td>
                                <span className={`badge bg-light-${item.status === 'delivered' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'} text-dark-${item.status === 'delivered' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td>₦{Number(item.total || item.price || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                          {orderItems.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                No recent orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
      
      {!userProfile.bankname && user.id ? (
        <ProfileCompletionAlert
          userProfile={userProfile} 
          onComplete={handleCompleteProfile} 
        />
      ) : null}
    </main>
  );
};

export default VendorHomepage;