import React, { useEffect, useState } from "react";
import { Api } from "../../../APIs/Api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

export const SingleOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    console.log(order)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user data
                const userResponse = await Api.get('/api/user-profile/');
                const userData = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
                setUser(userData);
                
                // Fetch order data
                const orderResponse = await Api.get(`/api/orders/${orderId}`);
                setOrder(orderResponse.data);
            } catch (err) {
                setError(err.message);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to fetch data!",
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [orderId]);

    const handleItemStatusUpdate = async (itemId, newStatus) => {
        // Find the item in the current order
        const item = order.order_items.find(item => item.id === itemId);
        
        // Check if the item is already delivered
        if (item.status.toLowerCase() === 'delivered') {
            Swal.fire({
                icon: "error",
                title: "Cannot Update",
                text: "Delivered items cannot be updated!",
            });
            return;
        }

        setLoading(true);
        try {
            // Correct endpoint to update order item status
            const response = await Api.patch(`/api/order-items/${itemId}/`, {
                status: newStatus
            });
            
            // Update the local state
            setOrder(prev => ({
                ...prev,
                order_items: prev.order_items.map(item => 
                    item.id === itemId ? { ...item, status: newStatus } : item
                )
            }));
            
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Item status has been updated.",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            console.error("Error updating item status:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Failed to update item status!",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (error) {
        return <div className="alert alert-danger">Error: {error}</div>;
    }

    if (!order) {
        return <div className="d-flex justify-content-center py-5">
            <ClipLoader color="#36d7b7" size={40} />
        </div>;
    }

    return (
        <main className="main-content-wrapper">
            <div className="container">
                <div className="row mb-8">
                    <div className="col-md-12">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                            <div>
                                <h2>Order #{order.order_items.id}</h2>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0">
                                        <a href="/" className="text-inherit">Dashboard</a>
                                        <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                                        <a href="/orders" className="text-inherit">Orders</a>
                                        <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                                        <a>#{order.id}</a>
                                    </ol>
                                </nav>
                            </div>
                            <div>
                                <button 
                                    onClick={() => navigate('/orders')}
                                    className="btn btn-primary"
                                >
                                    Back to Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12 col-12 mb-5">
                        <div className="card h-100 card-lg">
                            <div className="card-body p-6">
                                <div className="d-flex justify-content-between align-items-center mb-6">
                                    <div>
                                        <h4 className="mb-1">Order Details</h4>
                                        <p className="text-muted mb-0">
                                            Created: {formatDateTime(order.created_at)}
                                        </p>
                                    </div>
                                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <h5 className="mb-4">Order Items</h5>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.order_items
                                                .filter(item => item.vendor_id === user.id)
                                                .map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img 
                                                                    src={item.product.main_image}
                                                                    alt={item.product.name}
                                                                    className="rounded me-3"
                                                                    width="60"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://via.placeholder.com/60";
                                                                    }}
                                                                />
                                                                <div>
                                                                    <h6 className="mb-0">{item.product.name}</h6>
                                                                    <small className="text-muted">
                                                                        {item.product.processor}, {item.product.ram}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>₦{Number(item.product.price).toLocaleString()}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>₦{Number(item.total).toLocaleString()}</td>
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
                                                        <td>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                value={item.status}
                                                                onChange={(e) => handleItemStatusUpdate(item.id, e.target.value)}
                                                                disabled={loading || item.status.toLowerCase() === 'delivered'}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    position: "fixed", 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: "rgba(0, 0, 0, 0.5)", 
                    zIndex: 9999 
                }}>
                    <ClipLoader color="#36d7b7" size={50} />
                </div>
            )}
        </main>
    );
};