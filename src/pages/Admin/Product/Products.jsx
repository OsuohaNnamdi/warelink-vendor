import React, { useState, useEffect } from "react";
import { Api } from "../../../APIs/Api";
import { BiXCircle } from "react-icons/bi";
import { Modal, Button, Form } from "react-bootstrap"; // Import Bootstrap Modal
import Swal from "sweetalert2"; // Import SweetAlert2
import { ClipLoader } from "react-spinners";

export const Product = () => {
    const [products, setProducts] = useState([]); // All products
    const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
    const [categories, setCategories] = useState([]); // Categories
    const [category, setCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open
    const [showEditModal, setShowEditModal] = useState(false); // Control edit modal visibility
    const [editingProduct, setEditingProduct] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: ""
    });
    const [showPromoModal, setShowPromoModal] = useState(false); // Control promo modal visibility
    const [showReviewsModal, setShowReviewsModal] = useState(false); // Control reviews modal visibility
    const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for promotion
    const [promoPrice, setPromoPrice] = useState(""); // Promo price
    const [promoImage, setPromoImage] = useState(null); // Promo image (file)
    const [loading, setLoading] = useState(false); // Loading state
    const [user, setUser] = useState([]);
    const [reviews, setReviews] = useState([]); // Product reviews
    const [reviewsLoading, setReviewsLoading] = useState(false); // Reviews loading state
    
    useEffect(() => {
      const fetchUserData = async () => {
          const response = await Api.get('/api/user-profile/');
          const userData = Array.isArray(response.data) ? response.data[0] : response.data;
          setUser(userData);
      };
  
      fetchUserData();
    }, []);

    // Fetch products and categories on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const productResponse = await Api.get('/api/product/');
                setProducts(productResponse.data);
                setFilteredProducts(productResponse.data);

                const categoryResponse = await Api.get('/api/category/');
                setCategories(categoryResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch data!',
                });
            } finally {
                setLoading(false); // Stop loading
            }
        };

        Api.get('/api/category/')
            .then(response => {
                const categoriesData = response.data.reduce((acc, category) => {
                    acc[category.id] = category.name;
                    return acc;
                }, {});
                setCategory(categoriesData);
            })
            .catch(error => {
                console.error("There was an error fetching the categories!", error);
            });

        fetchData();
    }, []);

    // Handle category selection
    const handleCategoryChange = async (e) => {
        const category = e.target.value;
        setSelectedCategory(category);

        try {
            const response = await Api.get('/api/product/search_by_category/', {
                params: { category }
            });
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching filtered products:", error);
        }
    };

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle delete product with SweetAlert confirmation
    const handleDelete = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setLoading(true); // Start loading
            try {
                await Api.delete(`/api/product/${productId}/`);
                setProducts(products.filter(product => product.id !== productId));
                setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
                setOpenDropdownId(null);
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            } catch (error) {
                console.error("Error deleting product:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to delete product!',
                });
            } finally {
                setLoading(false); // Stop loading
            }
        }
    };

    // Handle update product with loading state
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const payload = {
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                quantity: editingProduct.quantity,
                category: editingProduct.category
            };

            await Api.patch(`/api/product/${editingProduct.id}/`, payload);
            setShowEditModal(false);
            Swal.fire('Updated!', 'Your product has been updated.', 'success');
        } catch (error) {
            console.error("Error updating product:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to update product!',
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product); // Set the product being edited
        setShowEditModal(true); // Open the modal
        setOpenDropdownId(null); // Close the dropdown
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct({ ...editingProduct, [name]: value });
    };

    // Toggle dropdown visibility
    const toggleDropdown = (productId) => {
        setOpenDropdownId(openDropdownId === productId ? null : productId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown")) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Handle promote button click - simplified to show single modal
    const handlePromote = (product) => {
        setSelectedProduct(product); // Set the selected product
        setShowPromoModal(true); // Open the promo modal
        setOpenDropdownId(null); // Close the dropdown
    };

    // Handle view reviews button click
    const handleViewReviews = async (product) => {
        setSelectedProduct(product);
        console.log(product.id)
        setReviewsLoading(true);
        try {
            const response = await Api.get('/api/review/by_product/', {
                params: { product_id: product.id }
            });
            setReviews(response.data);
            setShowReviewsModal(true);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to fetch product reviews!',
            });
        } finally {
            setReviewsLoading(false);
            setOpenDropdownId(null); // Close the dropdown
        }
    };

    // Handle promotion submission
    const handlePromotionSubmit = async () => {
        setLoading(true); // Start loading
        try {
            const formData = new FormData();
            formData.append("promo_price", promoPrice);
            await Api.patch(`/api/product/${selectedProduct.id}/`, formData);

            setShowPromoModal(false);
            Swal.fire('Promoted!', 'Your product has been promoted.', 'success');
        } catch (error) {
            console.error("Error promoting product:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to promote product!',
            });
        } finally {
            setLoading(false); // Stop loading
            setPromoPrice(""); // Clear the promo price
            setPromoImage(null); // Clear the file input
        }
    };

    // Render star ratings
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} style={{ color: i < rating ? '#ffc107' : '#e4e5e9' }}>
                ★
            </span>
        ));
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
                        {/* Page header */}
                        <div className="d-md-flex justify-content-between align-items-center">
                            <div>
                                <h2>Products</h2>
                                {/* Breadcrumb */}
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0">
                                        <li className="breadcrumb-item">
                                            <a href="/" className="text-inherit">Dashboard</a>
                                            <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                                            <a>Products</a>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                            {/* Add product button */}
                            <div>
                                <a href="/add-product" className="btn btn-primary">Add Product</a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Filters and search */}
                <div className="row">
                    <div className="col-xl-12 col-12 mb-5">
                        <div className="card h-100 card-lg">
                            <div className="px-6 py-6">
                                <div className="row justify-content-between">
                                    {/* Search form */}
                                    <div className="col-lg-4 col-md-6 col-12 mb-2 mb-lg-0">
                                        <form className="d-flex" role="search">
                                            <input
                                                className="form-control"
                                                type="search"
                                                placeholder="Search Products"
                                                aria-label="Search"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                            />
                                        </form>
                                    </div>
                                    {/* Category filter */}
                                    <div className="col-lg-2 col-md-4 col-12">
                                        <select
                                            className="form-select"
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* Product table */}
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-centered table-hover text-nowrap table-borderless mb-0 table-with-checkbox">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" defaultValue id="checkAll" />
                                                        <label className="form-check-label" htmlFor="checkAll" />
                                                    </div>
                                                </th>
                                                <th>Image</th>
                                                <th>Product Name</th>
                                                <th>Category</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Created at</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {filteredProducts.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultValue id={`product${product.id}`} />
                                                            <label className="form-check-label" htmlFor={`product${product.id}`} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <a href="#!"><img src={product.main_image} alt className="icon-shape icon-md" /></a>
                                                    </td>
                                                    <td><a href="#" className="text-reset">{product.name}</a></td>
                                                    <td>{category[product.category] || 'Uncategorized'}</td>
                                                    <td>
                                                        <span className={`badge bg-light-${product.quantity > 1 ? 'primary' : product.quantity === 0 ? 'danger' : 'warning'} text-dark-${product.quantity > 1 ? 'primary' : product.quantity === 0 ? 'danger' : 'warning'}`}>
                                                            {product.quantity}
                                                        </span>
                                                    </td>
                                                    <td>₦ {Number(product.price).toLocaleString()}</td>
                                                    <td>{product.created_at}</td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <a
                                                                href="#"
                                                                className="text-reset"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    toggleDropdown(product.id);
                                                                }}
                                                            >
                                                                <i className="feather-icon icon-more-vertical fs-5" />
                                                            </a>
                                                            {openDropdownId === product.id && (
                                                                <ul className="dropdown-menu show" style={{ top: "auto", bottom: "100%", left: "50%", transform: "translateX(-50%)" }}>
                                                                    <li>
                                                                        <a
                                                                            className="dropdown-item"
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handlePromote(product);
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-megaphone me-3" />
                                                                            Promote
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="dropdown-item"
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleViewReviews(product);
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-star-fill me-3" />
                                                                            View Reviews
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="dropdown-item"
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleEdit(product);
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-pencil-square me-3" />
                                                                            Edit
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="dropdown-item"
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleDelete(product.id);
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
                            {/* Pagination */}
                            <div className="border-top d-md-flex justify-content-between align-items-center px-6 py-6">
                                <span>Showing 1 to {filteredProducts.length} of {filteredProducts.length} entries</span>
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

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingProduct && (
                        <Form onSubmit={handleUpdateProduct}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={editingProduct.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={editingProduct.quantity}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={editingProduct.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category"
                                    value={editingProduct.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={editingProduct.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Single Promotion Modal */}
            <Modal show={showPromoModal} onHide={() => setShowPromoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Promote Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Promo Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={promoPrice}
                                onChange={(e) => setPromoPrice(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handlePromotionSubmit}>
                            Submit Promotion
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Reviews Modal */}
            <Modal show={showReviewsModal} onHide={() => setShowReviewsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Product Reviews - {selectedProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reviewsLoading ? (
                        <div className="text-center py-4">
                            <ClipLoader color="#36d7b7" size={30} />
                            <p>Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-4">
                            <p>No reviews yet for this product.</p>
                        </div>
                    ) : (
                        <div className="review-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="mb-4 pb-3 border-bottom">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <strong>{review.user.username}</strong>
                                            <div className="text-warning">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <small className="text-muted">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <p className="mb-0">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReviewsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Loading Spinner */}
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 }}>
                    <ClipLoader color="#36d7b7" size={50} />
                </div>
            )}
        </main>
    );
};