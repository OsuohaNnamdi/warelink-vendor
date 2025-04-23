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
  Legend,
  Text
} from "recharts";
import { ClipLoader } from "react-spinners";
import { BiXCircle, BiPieChartAlt, BiBarChartAlt2 } from "react-icons/bi";
import Swal from "sweetalert2";
import { Api } from "../../APIs/Api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6B6B"];

const EmptyChartPlaceholder = ({ chartType }) => {
  const iconSize = 48;
  const iconColor = "#ddd";
  
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100%" }}>
      {chartType === 'pie' ? (
        <BiPieChartAlt size={iconSize} color={iconColor} />
      ) : (
        <BiBarChartAlt2 size={iconSize} color={iconColor} />
      )}
      <p className="mt-3 text-muted">No sales data available</p>
    </div>
  );
};

const SalesPage = () => {
  const [salesData, setSalesData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ is_banned: false });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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
        setSalesData({}); // Set empty object to indicate no data
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await Api.get('/api/user-profile/');
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    Promise.all([fetchSalesData(), fetchUserData()])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!user.id) return;
      
      setLoading(true);
      try {
        const response = await Api.get("/api/orders/");
        const vendorItems = response.data.flatMap(order => 
          order.order_items
            .filter(item => item.vendor_id === user.id && item.status === "delivered")
            .map(item => ({
              ...item,
              order_id: order.id,
              order_created_at: order.created_at,
              customer_details: order.customer_details,
              payment_info: order.payment_info
            }))
        );
        
        let filteredItems = vendorItems;
        if (searchQuery) {
          filteredItems = vendorItems.filter(item => 
            item.id.toString().includes(searchQuery) ||
            (item.product && item.product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.order_id.toString().includes(searchQuery)
          );
        }
        
        setOrderItems(filteredItems);
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
  }, [user.id, searchQuery]);

  // Prepare data for charts with fallback for empty data
  const categoryBarData = salesData?.salesByCategory?.map(item => ({
    name: item.category,
    quantity: item.quantity_sold,
    sales: item.total_sales
  })) || [];

  const hasSalesData = categoryBarData.length > 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <Text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </Text>
    );
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
        <div className="row mb-8">
          <div className="col-md-12">
            <div className="d-md-flex justify-content-between align-items-center">
              <div>
                <h2>Sales Dashboard</h2>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-inherit">Dashboard</a>
                      <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                      <a>Sales</a>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
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
                          {formatCurrency(salesData?.netSales)}
                        </p>
                      </div>
                      <div className="icon-shape bg-light-primary rounded-3">
                        <i className="bi bi-currency-dollar fs-3 text-primary"></i>
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
                        <h6 className="mb-0">Delivered Orders</h6>
                        <p className="mb-0 text-dark fs-4 fw-bold">{orderItems.length}</p>
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
                        <h6 className="mb-0">Top Selling Brand</h6>
                        <p className="mb-0 text-dark fs-4 fw-bold">
                          {hasSalesData ? categoryBarData[0]?.name : "N/A"}
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
                      {hasSalesData ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryBarData}
                              dataKey="sales"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={renderCustomizedLabel}
                              labelLine={false}
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
                      ) : (
                        <EmptyChartPlaceholder chartType="pie" />
                      )}
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
                      {hasSalesData ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryBarData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar 
                              dataKey="quantity" 
                              fill="#8884d8" 
                              name="Quantity Sold"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <EmptyChartPlaceholder chartType="bar" />
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Orders Table */}
            <div className="row">
              <div className="col-xl-12 col-12 mb-5">
                <Card className="h-100 card-lg">
                  <div className="p-6">
                    <div className="row justify-content-between">
                      <div className="col-md-4 col-12 mb-2 mb-md-0">
                        <form className="d-flex" role="search">
                          <input
                            className="form-control"
                            type="search"
                            placeholder="Search by ID or product"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                  <Card.Header className="bg-white py-4">
                    <h5 className="mb-0">Delivered Orders</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {orderItems.length > 0 ? (
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
                              <tr key={item.id}>
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
                                  <span className="badge bg-success">
                                    {item.status}
                                  </span>
                                </td>
                                <td>{formatCurrency(item.total || item.price)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No delivered orders found</p>
                      </div>
                    )}
                  </Card.Body>
                  {orderItems.length > 0 && (
                    <div className="border-top d-md-flex justify-content-between align-items-center p-6">
                      <span>Showing 1 to {orderItems.length} of {orderItems.length} entries</span>
                      <nav className="mt-2 mt-md-0">
                        <ul className="pagination mb-0">
                          <li className="page-item disabled"><a className="page-link" href="#!">Previous</a></li>
                          <li className="page-item"><a className="page-link active" href="#!">1</a></li>
                          <li className="page-item"><a className="page-link" href="#!">2</a></li>
                          <li className="page-item"><a className="page-link" href="#!">3</a></li>
                          <li className="page-item"><a className="page-link" href="#!">Next</a></li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default SalesPage;