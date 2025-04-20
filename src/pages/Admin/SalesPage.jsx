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
import Swal from "sweetalert2";
import { Api } from "../../APIs/Api";

const mockData = [
  {
    id: 1,
    title: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    image: "https://via.placeholder.com/100"
  },
  {
    id: 2,
    title: "Yoga Mat",
    category: "Sports",
    price: 24.99,
    image: "https://via.placeholder.com/100"
  },
  {
    id: 3,
    title: "Coffee Maker",
    category: "Home Appliances",
    price: 49.99,
    image: "https://via.placeholder.com/100"
  },
  {
    id: 4,
    title: "Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    image: "https://via.placeholder.com/100"
  },
  {
    id: 5,
    title: "Running Shoes",
    category: "Fashion",
    price: 74.99,
    image: "https://via.placeholder.com/100"
  }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ is_banned: false });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load mock data for charts
    setSalesData(mockData);
    
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await Api.get('/api/user-profile/');
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!user.id) return;
      
      setLoading(true);
      try {
        const response = await Api.get("/api/orders/");
        // Extract order items belonging to this vendor with order info
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

        
        
        // Apply search filter
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



  const totalSales = salesData.reduce((acc, item) => acc + item.price, 0);

  const categorySales = Object.values(
    salesData.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || { name: product.category, value: 0 };
      acc[product.category].value += product.price;
      return acc;
    }, {})
  );

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
                        <p className="mb-0 text-dark fs-4 fw-bold">${totalSales.toFixed(2)}</p>
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
                        <h6 className="mb-0">Top Category</h6>
                        <p className="mb-0 text-dark fs-4 fw-bold">
                          {categorySales[0]?.name || "N/A"}
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
                    <h5 className="mb-0">Category Sales</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categorySales}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {categorySales.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-xl-6 col-12 mb-4">
                <Card className="h-100 card-lg">
                  <Card.Header className="bg-white py-4">
                    <h5 className="mb-0">Sales per Product</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                          <XAxis dataKey="title" hide />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="price" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
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
                              <td>₦{Number(item.total || item.price || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
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