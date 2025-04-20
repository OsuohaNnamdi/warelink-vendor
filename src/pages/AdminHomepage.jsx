import React, { useEffect, useState } from "react";
import { ProfileCompletionAlert } from "./Admin/ProfileCompletionAlert";
import { Api } from "../APIs/Api";
import { Card, Table, Spinner } from "react-bootstrap";
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
import { useNavigate } from "react-router-dom";

export const AdminHomepage = () => {
  const [user, setUser] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    bankaccount: null,
    bankname: null
  });

  const navigate = useNavigate();

  const handleCompleteProfile = (details) => {
    setUserProfile(prev => ({
      ...prev,
      bankname: details.bankname,
      bankaccount: details.bankaccount
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await Api.get('/api/user-profile/');
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      setUser(userData);
    };
    fetchUserData();
  }, []);

     useEffect(() => {
          const fetchOrderItems = async () => {
              setLoading(true);
              try {
                  const response = await Api.get("/api/orders/");
                  
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
                  
                  let filteredItems = vendorItems;
                                   
                  setOrderItems(filteredItems);
              } catch (err) {
                
              } finally {
                  setLoading(false);
              }
          };
  
          if (user.id) {
              fetchOrderItems();
          }
      }, [user.id]);

  // useEffect(() => {
  //   const fetchSalesData = async () => {
  //     if (!user.id) return;
      
  //     setLoading(true);
  //     try {
  //       // Fetch sales data
  //       const salesResponse = await Api.get("/api/vendor-sales/");
  //       setSalesData(salesResponse.data);
        
  //       // Fetch recent orders
  //       const ordersResponse = await Api.get("/api/orders/");
  //       const vendorItems = ordersResponse.data.flatMap(order => 
  //         order.order_items
  //           .filter(item => item.vendor_id === user.id)
  //           .map(item => ({
  //             ...item,
  //             order_id: order.id,
  //             order_created_at: order.created_at,
  //             customer_details: order.customer_details,
  //             payment_info: order.payment_info
  //           }))
  //       );
        
  //       setOrderItems(vendorItems.slice(0, 5)); // Get only 5 most recent orders
  //     } catch (err) {
  //       console.error("Error fetching sales data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSalesData();
  // }, [user.id]);

  const totalSales = salesData.reduce((acc, item) => acc + (item.total || 0), 0);
  const totalOrders = orderItems.length;

  const categorySales = Object.values(
    salesData.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      acc[category] = acc[category] || { name: category, value: 0 };
      acc[category].value += product.total || 0;
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleOrderItemClick = (orderItemId) => {
    navigate(`/order/${orderItemId}`);
};

  return (
    <main className="main-content-wrapper">
      <section className="container">
        {/* row */}
        <div className="row mb-8">
          <div className="col-md-12">
            {/* card */}
            <div className="card bg-light border-0 rounded-4" style={{backgroundImage: 'url(../assets/images/slider/slider-image-1.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'right'}}>
              <div className="card-body p-lg-12">
                <h1>Welcome back to Lapi Naija!</h1>
                <p>Manage your products, track sales, and grow your business.</p>
                <a href="/add-product" className="btn btn-primary">Add New Product</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sales Summary Cards */}
        <div className="row mb-6">
          <div className="col-lg-4 col-12 mb-6">
            <div className="card h-100 card-lg">
              <div className="card-body p-6">
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <div>
                    <h4 className="mb-0 fs-5">Total Sales</h4>
                  </div>
                  <div className="icon-shape icon-md bg-light-primary text-dark-primary rounded-circle">
                    <i className="bi bi-currency-dollar fs-5" />
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-2 fw-bold fs-2">₦{totalSales.toLocaleString()}</h1>
                  <span>All time revenue</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-12 mb-6">
            <div className="card h-100 card-lg">
              <div className="card-body p-6">
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <div>
                    <h4 className="mb-0 fs-5">Total Orders</h4>
                  </div>
                  <div className="icon-shape icon-md bg-light-success text-dark-success rounded-circle">
                    <i className="bi bi-cart-check fs-5" />
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-2 fw-bold fs-2">{totalOrders}</h1>
                  <span>Completed orders</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-12 mb-6">
            <div className="card h-100 card-lg">
              <div className="card-body p-6">
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <div>
                    <h4 className="mb-0 fs-5">Top Category</h4>
                  </div>
                  <div className="icon-shape icon-md bg-light-warning text-dark-warning rounded-circle">
                    <i className="bi bi-trophy fs-5" />
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-2 fw-bold fs-2">{categorySales[0]?.name || "N/A"}</h1>
                  <span>Best performing category</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row mb-6">
          <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-6">
            <div className="card h-100 card-lg">
              <div className="card-body p-6">
                <h3 className="mb-0 fs-5">Sales by Category</h3>
                <div style={{ height: "300px" }}>
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <ClipLoader color="#36d7b7" size={50} />
                    </div>
                  ) : (
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
                        <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-6">
            <div className="card h-100 card-lg">
              <div className="card-body p-6">
                <h3 className="mb-0 fs-5">Recent Sales</h3>
                <div style={{ height: "300px" }}>
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <ClipLoader color="#36d7b7" size={50} />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData.slice(0, 5)}>
                        <XAxis dataKey="product_name" hide />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, "Total"]} />
                        <Bar dataKey="total" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-6">
            <div className="card h-100 card-lg">
              <div className="p-6">
                <h3 className="mb-0 fs-5">Recent Orders</h3>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-centered table-borderless text-nowrap table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Product</th>
                        <th scope="col">Date</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      ) : orderItems.length > 0 ? (
                        orderItems.map((item) => (
                          <tr key={item.id}
                            onClick={() => handleOrderItemClick(item.order_id, item.id)}>
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
                            <td>₦{Number(item.total || item.price || 0).toLocaleString()}</td>
                            <td>
                              <span className={`badge bg-light-${item.status === 'completed' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'} text-dark-${item.status === 'completed' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'}`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            No recent orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {!user.bankname && user.id ? (
        <ProfileCompletionAlert
          userProfile={userProfile} 
          onComplete={handleCompleteProfile} 
        />
      ) : null}
    </main>
  );
};