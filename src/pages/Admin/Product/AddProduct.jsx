import React, { useState, useEffect } from "react";
import { Api } from "../../../APIs/Api";
import { BiXCircle } from "react-icons/bi";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

export const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    main_image: null,
    other_images: [], 
    processor: "",
    ram: "",
    storage: "",
    display: "",
    os: "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    is_verified: true,
    is_banned: false
  });
  const [statusChecked, setStatusChecked] = useState(false);

  // Fetch user data and check verification/banned status
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Api.get('/api/user-profile/');
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        setUser({
          is_verified: userData.is_verified,
          is_banned: userData.is_banned
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser({
          is_verified: true,
          is_banned: false
        });
      } finally {
        setStatusChecked(true);
      }
    };
    
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await Api.get("/api/category/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch categories!",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for quantity field
    if (name === "quantity") {
      // Check if the value is empty or a valid positive integer
      if (value === "" || /^[0-9]*$/.test(value)) {
        setProductData({ ...productData, [name]: value });
        // Clear error if valid
        const newErrors = { ...errors };
        delete newErrors.quantity;
        setErrors(newErrors);
      } else {
        // Set error if invalid
        setErrors({ ...errors, quantity: "Only whole numbers are allowed" });
        return;
      }
    } 
    // Special handling for price field
    else if (name === "price") {
      // Check if the value is empty or a valid positive number with up to 2 decimal places
      if (value === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
        setProductData({ ...productData, [name]: value });
        // Clear error if valid
        const newErrors = { ...errors };
        delete newErrors.price;
        setErrors(newErrors);
      } else {
        // Set error if invalid
        setErrors({ ...errors, price: "Only numbers with up to 2 decimal places are allowed" });
        return;
      }
    }
    else {
      // Normal handling for other fields
      setProductData({ ...productData, [name]: value });
    }

    // Clear any existing error for this field
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const { name } = e.target;
    const files = e.target.files;
    setProductData({
      ...productData,
      [name]: name === "main_image" ? files[0] : Array.from(files),
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!productData.name) newErrors.name = "Name is required";
    if (!productData.description) newErrors.description = "Description is required";
    if (!productData.category) newErrors.category = "Category is required";
    
    // Price validation
    if (!productData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(productData.price) || parseFloat(productData.price) < 0) {
      newErrors.price = "Please enter a valid positive number";
    }
    
    // Quantity validation
    if (!productData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(productData.quantity) || parseInt(productData.quantity) < 0) {
      newErrors.quantity = "Please enter a valid whole number";
    }
    
    if (!productData.main_image) newErrors.main_image = "Main image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (Array.isArray(productData[key])) {
        productData[key].forEach((file) => formData.append(key, file));
      } else if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    setLoading(true);
    try {
      const response = await Api.post("/api/product/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added successfully!",
      });
      // Reset form after successful submission
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        main_image: null,
        other_images: [],
        processor: "",
        ram: "",
        storage: "",
        display: "",
        os: "",
      });
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add product!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!statusChecked) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  return (
    <main className="main-content-wrapper position-relative">
      {/* Banned Overlay */}
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
      
      {/* Unverified Overlay */}
      {!user.is_banned && !user.is_verified && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{
               backgroundColor: 'rgba(255,255,255,0.8)',
               zIndex: 1000,
               backdropFilter: 'blur(5px)'
             }}>
          <div className="text-center p-5 bg-white rounded-3 shadow-lg border border-warning">
            <BiXCircle className="text-warning mb-3" size={48} />
            <h2 className="text-warning mb-3">ACCOUNT NOT VERIFIED</h2>
            <p className="mb-3">You need to verify your account to add products.</p>
            <a href="/support" className="btn btn-warning">
              Contact Customer Care
            </a>
          </div>
        </div>
      )}

      <div className={`container ${user.is_banned || !user.is_verified ? 'pe-none' : ''}`} 
           style={{ 
             filter: user.is_banned || !user.is_verified ? 'blur(3px)' : 'none',
             pointerEvents: user.is_banned || !user.is_verified ? 'none' : 'auto'
           }}>
        <div className="row mb-8">
          <div className="col-md-12">
            <div className="d-md-flex justify-content-between align-items-center">
              <div>
                <h2>Add New Product</h2>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <a href="/" className="text-inherit">Dashboard</a>
                    <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                    <a href="/product" className="text-inherit">Products</a>
                    <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                    <a> Add New Product</a>
                  </ol>
                </nav>
              </div>
              <div>
                <a href="/product" className="btn btn-light">
                  Back to Products
                </a>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-8 col-12">
              <div className="card mb-6 card-lg">
                <div className="card-body p-6">
                  <h4 className="mb-4 h5">Product Information</h4>
                  <div className="row">
                    <div className="mb-3 col-lg-6">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>
                    <div className="mb-3 col-lg-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <div className="text-danger">{errors.category}</div>}
                    </div>
                    <div className="mb-3 col-lg-6">
                      <label className="form-label">Price</label>
                      <input
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        type="text"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key) && 
                              e.key !== 'Backspace' && 
                              e.key !== 'Delete' && 
                              e.key !== 'Tab' && 
                              e.key !== 'Escape' && 
                              e.key !== 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.price && <div className="text-danger">{errors.price}</div>}
                    </div>
                    <div className="mb-3 col-lg-6">
                      <label className="form-label">Quantity</label>
                      <input
                        type="text"
                        className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                        name="quantity"
                        value={productData.quantity}
                        onChange={handleInputChange}
                        required
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key) && 
                              e.key !== 'Backspace' && 
                              e.key !== 'Delete' && 
                              e.key !== 'Tab' && 
                              e.key !== 'Escape' && 
                              e.key !== 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
                    </div>
                  </div>

                  <h4 className="mb-4 h5">Product Images</h4>
                  <div className="mb-3">
                    <label className="form-label">Main Image</label>
                    <input
                      type="file"
                      className="form-control"
                      name="main_image"
                      onChange={handleImageChange}
                      required
                    />
                    {errors.main_image && <div className="text-danger">{errors.main_image}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Other Images</label>
                    <input
                      type="file"
                      className="form-control"
                      name="other_images"
                      multiple
                      onChange={handleImageChange}
                      required
                    />
                  </div>

                  <h4 className="mb-4 h5">Other Laptop Specification</h4>
                  <div className="mb-3">
                    <label className="form-label">Specification</label>
                    <textarea
                      className="form-control"
                      name="description"
                      placeholder="example: Allenware || 4GB Graphics Card || 360 inch screen"
                      value={productData.description}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-12">
              <div className="card mb-6 card-lg">
                <div className="card-body p-6">
                  <h4 className="mb-4 h5">Laptop Specifications</h4>
                  <div className="mb-3">
                    <label className="form-label">Processor</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Processor"
                      name="processor"
                      value={productData.processor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">RAM Size</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="RAM Size"
                      name="ram"
                      value={productData.ram}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Storage Size</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Storage Size"
                      name="storage"
                      value={productData.storage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Display Size</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Display Size"
                      name="display"
                      value={productData.display}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Operating System</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Operating System"
                      name="os"
                      value={productData.os}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Add Product"}
          </button>
        </form>

        {loading && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 }}>
                <ClipLoader color="#36d7b7" size={50} />
            </div>
        )}
      </div>
    </main>
  );
};