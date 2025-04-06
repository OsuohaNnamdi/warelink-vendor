import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiDownload, FiGrid, FiList } from 'react-icons/fi';
import { BiXCircle } from "react-icons/bi";
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';
import * as XLSX from 'xlsx';
import { Api } from "../../../APIs/Api";
import { ListView } from './ListView';
import { GridView } from './GridView';



const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState({
    inventory: false,
    search: false,
    action: false
  });
  const [viewMode, setViewMode] = useState('grid'); 
  const [user, setUser] = useState([]);
    
    
        useEffect(() => {
          const fetchUserData = async () => {
           
              const response = await Api.get('/api/user-profile/');
              const userData = Array.isArray(response.data) ? response.data[0] : response.data;
              setUser(userData);
            
          };
      
          fetchUserData();
        }, []);


  // Load initial inventory
  useEffect(() => {
    const loadInventory = async () => {
      setLoading(prev => ({ ...prev, inventory: true }));
      try {
        const response = await Api.get('/api/product/available_products/');
        setInventory(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to load inventory:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load inventory!",
        });
      } finally {
        setLoading(prev => ({ ...prev, inventory: false }));
      }
    };
    
    loadInventory();
  }, []);

  // Search products when query changes
  useEffect(() => {
    if (!isModalOpen || searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const search = async () => {
      setLoading(prev => ({ ...prev, search: true }));
      try {
        const response = await Api.get('/api/product/', {
          params: { search: searchQuery }
        });
        // Assuming the API returns products filtered for the current vendor
        setSearchResults(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Search failed:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Search failed! Please try again.",
        });
        setSearchResults([]); // Clear results on error
      } finally {
        setLoading(prev => ({ ...prev, search: false }));
      }
    };
    
    const timer = setTimeout(search, 500);
    return () => clearTimeout(timer);
    }, [searchQuery, isModalOpen]);

    const handleAddStock = async () => {
      if (!selectedProduct || selectedProduct.quantity < 1) return;
      
      setLoading(prev => ({ ...prev, action: true }));
      try {
        const response = await Api.patch(`/api/product/${selectedProduct.id}/`, {
          quantity: selectedProduct.quantity // Use selectedProduct.quantity instead of quantity
        });
 
   
          setInventory(prev => 
            prev.map(item => 
              item.id === selectedProduct.id 
                ? { 
                    ...item, 
                    quantity: selectedProduct.quantity,
                  }
                : item
            )
          );
       
        
        Swal.fire("Success!", `${selectedProduct.quantity} ${selectedProduct.name} added to inventory`, "success");
        closeModal();
      } catch (error) {
        console.error("Failed to add stock:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add stock!",
        });
      } finally {
        setLoading(prev => ({ ...prev, action: false }));
      }
    };
    
    const handleIncreaseStock = async (inventoryId , quantity) => {
      setLoading(prev => ({ ...prev, action: true }));
      try {
        const response = await Api.patch(`/api/product/${inventoryId}/`, {
          quantity: quantity + 1 
        });
        
        setInventory(prev => 
          prev.map(item => 
            item.id === inventoryId 
              ? { ...item, quantity: item.quantity + 1}
              : item
          )
        );
      } catch (error) {
        console.error("Failed to increase stock:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to increase stock!",
        });
      } finally {
        setLoading(prev => ({ ...prev, action: false }));
      }
    };
    
    const handleDecreaseStock = async (inventoryId, quantity) => {
      setLoading(prev => ({ ...prev, action: true }));
      try {
        const response = await Api.patch(`/api/product/${inventoryId}/`, {
          quantity: quantity - 1
        });
        
        setInventory(prev => 
          prev.map(item => 
            item.id === inventoryId 
              ? { ...item, quantity: item.quantity - 1}
              : item
          )
        );
      } catch (error) {
        console.error("Failed to decrease stock:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to decrease stock!",
        });
      } finally {
        setLoading(prev => ({ ...prev, action: false }));
      }
    };
    
    const handleRemove = async (inventoryId) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
    
      if (result.isConfirmed) {
        setLoading(prev => ({ ...prev, action: true }));
        try {
          // Set quantity to 0 to remove item
          await Api.patch(`/api/product/${inventoryId}/`, {
            quantity: 0
          });
          
          setInventory(prev => prev.filter(item => item.id !== inventoryId));
          Swal.fire("Deleted!", "Item removed from inventory.", "success");
        } catch (error) {
          console.error("Failed to remove item:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to remove item!",
          });
        } finally {
          setLoading(prev => ({ ...prev, action: false }));
        }
      }
    };

  const openModal = () => {
    setIsModalOpen(true);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const exportToExcel = () => {
    const data = inventory.map(item => ({
      'Product Name': item.name,
      'Specifications': item.specs,
      'Price': `$${item.price.toFixed(2)}`,
      'Stock': item.stock,
      'Status': item.stock > 15 ? 'High' : item.stock > 5 ? 'Medium' : 'Low',
      'Last Updated': formatDate(item.lastUpdated)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `laptop_inventory_${date}.xlsx`);
  };

  const getStockStatus = (stock) => {
    if (stock > 15) return 'success';
    if (stock > 5) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
              <div>
                <h2>Stock Management</h2>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <a href="/" className="text-inherit">
                      Dashboard
                    </a>
                    <span style={{ marginLeft: "8px", marginRight: "8px" }}>&gt;</span>
                    <a>Inventory</a>
                  </ol>
                </nav>
              </div>
              <div className="d-flex gap-2">
                <div className="btn-group">
                  <button 
                    className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <FiGrid />
                  </button>
                  <button 
                    className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <FiList />
                  </button>
                </div>
                <button 
                  className="btn btn-outline-primary rounded-pill px-3 py-2 d-flex align-items-center"
                  onClick={exportToExcel}
                >
                  <FiDownload className="me-2" size={18} />
                  Export Excel
                </button>
                <button 
                  className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center"
                  onClick={openModal}
                >
                  <FiPlus className="me-2" size={18} />
                  Add Stock
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12 col-12 mb-5">
            <div className="card h-100 card-lg">
              <div className="px-6 py-6">
                <div className="row justify-content-between">
                  <div className="col-lg-4 col-md-6 col-12 mb-2 mb-lg-0">
                    <form className="d-flex" role="search">
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Search Inventory"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </form>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                {loading.inventory && inventory.length === 0 ? (
                  <div className="text-center py-5">
                    <ClipLoader color="#36d7b7" size={50} />
                    <p className="mt-3 text-muted">Loading inventory...</p>
                  </div>
                ) : inventory.length === 0 ? (
                  <div className="text-center py-5">
                    <img 
                      src="/images/empty-inventory.svg" 
                      alt="Empty inventory" 
                      style={{ width: '200px', opacity: 0.7 }}
                    />
                    <h5 className="mb-3">Your inventory is empty</h5>
                    <p className="text-muted mb-4">Add your first product to get started</p>
                    <button 
                      className="btn btn-primary"
                      onClick={openModal}
                    >
                      <FiPlus className="me-2" />
                      Add Product
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <GridView 
                    inventory={inventory}
                    loading={loading}
                    handleIncreaseStock={handleIncreaseStock}
                    handleDecreaseStock={handleDecreaseStock}
                    handleRemove={handleRemove}
                    getStockStatus={getStockStatus}
                    formatDate={formatDate}
                  />
                ) : (
                  <ListView 
                    inventory={inventory}
                    loading={loading}
                    handleIncreaseStock={handleIncreaseStock}
                    handleDecreaseStock={handleDecreaseStock}
                    handleRemove={handleRemove}
                    getStockStatus={getStockStatus}
                    formatDate={formatDate}
                  />
                )}
              </div>

              {inventory.length > 0 && (
                <div className="border-top d-flex justify-content-between align-items-md-center px-6 py-6 flex-md-row flex-column gap-4">
                  <span>Showing 1 to {inventory.length} of {inventory.length} entries</span>
                  <nav>
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
            </div>
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Product to Inventory</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              {selectedProduct ? (
                <div className="row">
                  <div className="col-md-4">
                    <div className="bg-light rounded p-3 text-center mb-3">
                      <img 
                        src={selectedProduct.main_image || '/images/default-laptop.jpg'} 
                        alt={selectedProduct.name}
                        className="img-fluid"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h5>{selectedProduct.name}</h5>
                    <p className="text-muted">{selectedProduct.description}</p>
                    <h4 className="text-success">₦ {Number(selectedProduct.price).toLocaleString()}</h4>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold">Quantity to Add</label>
                      <div className="d-flex align-items-center" style={{ width: '160px' }}>
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => handleDecreaseStock(selectedProduct.id, selectedProduct.quantity)}
                          disabled={selectedProduct.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                            className="form-control text-center mx-2"
                            min="1"
                            value={selectedProduct.quantity}
                            onChange={(e) => {
                              const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                              setSelectedProduct(prev => ({
                                ...prev,
                                quantity: newQuantity
                              }));
                            }}
                          />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => handleIncreaseStock(selectedProduct.id, selectedProduct.quantity)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-light p-3 rounded mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Total Value:</span>
                        <span className="fw-bold">
                          ₦ {Number(selectedProduct.price * selectedProduct.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <FiSearch className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search products by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  {loading.search ? (
                    <div className="text-center py-4">
                      <ClipLoader color="#36d7b7" size={30} className="me-2" />
                      <span className="text-muted">Searching products...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {searchResults.map(product => (
                        <div 
                          key={product.id} 
                          className="d-flex align-items-center py-3 border-bottom cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="flex-shrink-0 me-3">
                            <img 
                              src={product.main_image} 
                              alt={product.name}
                              className="img-fluid rounded"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1">{product.name}</h6>
                              <span className="text-success fw-bold">₦ {Number(product.price).toLocaleString()}</span>
                            </div>
                            <small className="text-muted">{product.description}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-5">
                      <img 
                        src="/images/no-results.svg" 
                        alt="No results" 
                        style={{ width: '150px', opacity: 0.7 }}
                        className="mb-3"
                      />
                      <h6 className="mb-2">No products found</h6>
                      <p className="text-muted small">Try a different search term</p>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <img 
                        src="/images/search-products.svg" 
                        alt="Search products" 
                        style={{ width: '150px', opacity: 0.7 }}
                        className="mb-3"
                      />
                      <h6 className="mb-2">Search for products</h6>
                      <p className="text-muted small">Start typing to find products to add to inventory</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                Cancel
              </button>
              {selectedProduct && (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAddStock}
                  disabled={loading.action}
                >
                  {loading.action ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiPlus className="me-2" />
                      Add {selectedProduct.quantity} to Inventory
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading.action && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
    </main>
  );
};

export default Inventory;