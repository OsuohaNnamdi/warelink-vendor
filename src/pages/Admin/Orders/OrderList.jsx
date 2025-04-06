import React, { useEffect, useState } from "react";
import { Api } from "../../../APIs/Api";
import { BiXCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";

Modal.setAppElement("#root");

export const OrderList = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderItemToDelete, setOrderItemToDelete] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
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
            setLoading(true);
            try {
                const response = await Api.get("/api/orders/");
                // Extract order items belonging to this vendor with order info
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
                
                // Apply filters
                let filteredItems = vendorItems;
                if (searchQuery) {
                    filteredItems = vendorItems.filter(item => 
                        item.id.toString().includes(searchQuery) ||
                        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.order_id.toString().includes(searchQuery)
                    );
                }
                if (statusFilter) {
                    filteredItems = filteredItems.filter(item => item.status === statusFilter);
                }
                
                setOrderItems(filteredItems);
            } catch (err) {
                setError(err.message);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to fetch order items!",
                });
            } finally {
                setLoading(false);
            }
        };

        if (user.id) {
            fetchOrderItems();
        }
    }, [user.id, searchQuery, statusFilter]);
    console.log(order)

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleOrderItemClick = (orderItemId) => {
        navigate(`/order/${orderItemId}`);
    };

    

    const toggleDropdown = (e, orderItemId) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === orderItemId ? null : orderItemId);
    };

    const openDeleteModal = (e, orderItemId) => {
        e.stopPropagation();
        setOrderItemToDelete(orderItemId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setOrderItemToDelete(null);
    };

    const handleDelete = async () => {
        if (!orderItemToDelete) return;

        setLoading(true);
        try {
            await Api.delete(`/api/order-items/${orderItemToDelete}/`);
            setOrderItems(orderItems.filter(item => item.id !== orderItemToDelete));
            Swal.fire("Deleted!", "Your order item has been deleted.", "success");
        } catch (error) {
            console.error("Error deleting order item:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to delete order item!",
            });
        } finally {
            setLoading(false);
            closeDeleteModal();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (error) {
        return <div className="alert alert-danger">Error: {error}</div>;
    }

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
                        <div>
                            <h2>Order Items</h2>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <a href="/" className="text-inherit">Dashboard</a>
                                    <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                                    <a>List of Order Items</a>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-xl-12 col-12 mb-5">
                        <div className="card h-100 card-lg">
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
                                                onChange={handleSearchChange}
                                            />
                                        </form>
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-12">
                                        <select 
                                            className="form-select" 
                                            value={statusFilter} 
                                            onChange={handleStatusChange}
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="card-body p-0">
  <div className="table-responsive">
    <table className="table table-centered table-hover text-nowrap table-borderless mb-0">
      <thead className="bg-light">
        <tr>
          <th>Order ID</th>
          <th>Product</th>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item) => (
          <tr 
            key={item.id} 
            onClick={() => handleOrderItemClick(item.order_id, item.id)} 
            style={{ cursor: "pointer" }}
          >
            <td>#{item.id}</td>
            <td>
              <div className="d-flex align-items-center">
                <img 
                  src={item.product.main_image} 
                  alt={item.product.name}
                  className="rounded me-3"
                  width="60"
                  height="60"
                />
                <div>
                  <h6 className="mb-0">{item.product.name}</h6>
                  <small className="text-muted">{item.product.processor}</small>
                </div>
              </div>
            </td>
            <td>{formatDate(item.order_created_at)}</td>
            <td>
                <span className={`badge 
                    ${item.status === 'delivered' ? 'bg-success' : 
                    item.status === 'pending' ? 'bg-warning' : 
                    item.status === 'processing' ? 'bg-info' : 
                    item.status === 'shipped' ? 'bg-primary' : 
                    item.status === 'cancelled' ? 'bg-danger' : 
                    'bg-secondary'}`}
                >
                    {item.status}
                </span>
                                    </td>
            <td>₦{Number(item.total).toLocaleString()}</td>
            <td>
              <div className="dropdown">
                <a
                  href="#"
                  className="text-reset"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(e, item.id);
                  }}
                >
                  <i className="feather-icon icon-more-vertical fs-5" />
                </a>
                {openDropdownId === item.id && (
                  <ul 
                    className="dropdown-menu show" 
                    style={{ 
                      top: "auto", 
                      bottom: "100%", 
                      left: "50%", 
                      transform: "translateX(-50%)",
                      zIndex: 1000
                    }}
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(e, item.id);
                        }}
                      >
                        <i className="bi bi-trash me-3" />
                        Delete
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
                            
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
                        </div>
                    </div>
                </div>
            </div>
            
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 }}>
                    <ClipLoader color="#36d7b7" size={50} />
                </div>
            )}

            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Delete Confirmation Modal"
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        width: "400px",
                        padding: "20px",
                    },
                }}
            >
                <h2>Are you sure?</h2>
                <p>You won't be able to revert this!</p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button 
                        onClick={closeDeleteModal} 
                        style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete} 
                        style={{ padding: "8px 16px", backgroundColor: "#d33", color: "#fff", border: "none", borderRadius: "4px" }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </main>
    );
};

const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800'; // Yellow/orange for pending
      case 'processing':
        return 'bg-blue-100 text-blue-800';   // Blue for processing
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'; // Indigo for shipped
      case 'delivered':
        return 'bg-green-100 text-green-800';  // Green for delivered
      case 'cancelled':
        return 'bg-red-100 text-red-800';      // Red for cancelled
      default:
        return 'bg-gray-100 text-gray-800';    // Gray for unknown status
    }
  };