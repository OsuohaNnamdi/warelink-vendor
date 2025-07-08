import React, { useEffect, useState } from "react";
import "./styles.css";
import { Api } from "../../APIs/Api";
import { allPages } from "../../data";

export const AdminNavbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
      const fetchUserData = async () => {
       
          const response = await Api.get('/api/user-profile/');
          const userData = Array.isArray(response.data) ? response.data[0] : response.data;
          setUser(userData);
        
      };
  
      fetchUserData();
    }, []);

    sessionStorage.setItem("ban", user.is_banned)


    const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchQuery(query);
  
  if (query.length > 0) {
    const results = allPages.filter(page => 
      page.name.toLowerCase().includes(query) || 
      page.path.toLowerCase().includes(query)
    );
    setSearchResults(results);
  } else {
    setSearchResults([]);
  }
};

  const handleLogout = () => {
     
    localStorage.removeItem("token"); 
    localStorage.removeItem("user"); 

    // Optionally clear session storage if used
    sessionStorage.clear();
    localStorage.clear();
 
    window.location.href = "/";
};

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-glass">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <a
                className="text-inherit d-block d-xl-none me-4"
                data-bs-toggle="offcanvas"
                href="#offcanvasExample"
                role="button"
                aria-controls="offcanvasExample"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  fill="currentColor"
                  className="bi bi-text-indent-right"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm10.646 2.146a.5.5 0 0 1 .708.708L11.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zM2 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                </svg>
              </a>
             <div className="search-container">
                <form role="search">
                  <label htmlFor="search" className="form-label visually-hidden">
                    Search
                  </label>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search pages..."
                    aria-label="Search"
                    id="search"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </form>
                
                {searchResults.length > 0 && (
                  <div className="search-results">
                    <ul className="list-group">
                      {searchResults.map((page, index) => (
                        <li key={index} className="list-group-item">
                          <a href={page.path}>{page.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div>
              <ul className="list-unstyled d-flex align-items-center mb-0 ms-5 ms-lg-0">
                {/* Notification Dropdown */}
                <li className="dropdown dropdown-start">
                  <a
                    className="position-relative btn-icon btn-ghost-secondary btn rounded-circle"
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowNotification(!showNotification);
                      setShowProfile(false);
                    }}
                  >
                    <i className="bi bi-bell fs-5" />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2">
                      1
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  </a>
                  {showNotification && (
                    <div 
                      className="dropdown-menu dropdown-menu-start dropdown-menu-lg p-0 border-0 show"
                      style={{ left: 'auto', right: 0 }}
                    >
                      <div className="border-bottom p-5 d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">Notifications</h5>
                          <p className="mb-0 small">You have 1 unread message</p>
                        </div>
                        <a
                          href="#"
                          className="btn btn-ghost-secondary btn-icon rounded-circle"
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          data-bs-title="Mark all as read"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={14}
                            height={14}
                            fill="currentColor"
                            className="bi bi-check2-all text-success"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
                            <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z" />
                          </svg>
                        </a>
                      </div>
                      <div data-simplebar style={{ height: 250 }}>
                        <ul className="list-group list-group-flush notification-list-scroll fs-6">
                          <li className="list-group-item px-5 py-4 list-group-item-action active">
                            <a href="#!" className="text-muted">
                              <div className="d-flex">
                                <div className="avatar avatar-md rounded-circle bg-info text-white d-flex align-items-center justify-content-center">
                                  <i className="bi bi-laptop fs-5"></i>
                                </div>
                                <div className="ms-4">
                                  <p className="mb-1">
                                    <span className="text-dark">UK Used Laptop Listing</span>
                                    <br />
                                    Complete your laptop specifications to increase visibility
                                  </p>
                                  <span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={12}
                                      fill="currentColor"
                                      className="bi bi-clock text-muted"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                    </svg>
                                    <small className="ms-2">Just now</small>
                                  </span>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="list-group-item px-5 py-4 list-group-item-action">
                            <a href="#!" className="text-muted">
                              <div className="d-flex">
                                <img
                                  src="../assets/images/avatar/avatar-5.jpg"
                                  alt=""
                                  className="avatar avatar-md rounded-circle"
                                />
                                <div className="ms-4">
                                  <p className="mb-1">
                                    <span className="text-dark">Marketplace Tips</span>
                                    <br />
                                    Best practices for selling used laptops in the UK
                                  </p>
                                  <span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={12}
                                      fill="currentColor"
                                      className="bi bi-clock text-muted"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                    </svg>
                                    <small className="ms-2">2 days ago</small>
                                  </span>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="border-top px-5 py-4 text-center">
                        <a href="#!">View All</a>
                      </div>
                    </div>
                  )}
                </li>
                {/* Profile Dropdown */}
                <li className="dropdown dropdown-start ms-4">
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfile(!showProfile);
                      setShowNotification(false);
                    }}
                  >
                    <div className="avatar avatar-md rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                      {user.firstname && user.firstname.charAt(0).toUpperCase()}
                      {user.lastname && user.lastname.charAt(0).toUpperCase()}
                    </div>
                  </a>
                  {showProfile && (
                    <div 
                      className="dropdown-menu dropdown-menu-start p-0 show"
                      style={{ left: 'auto', right: 0 }}
                    >
                      <div className="lh-1 px-5 py-4 border-bottom">
                        <h5 className="mb-1 h6">Hello {user.firstname}</h5>
                        <small>{user.email}</small>
                      </div>
                      <ul className="list-unstyled px-2 py-3">
                        <li>
                          <a className="dropdown-item" href="/">Home</a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/profile">Profile</a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/support">Contact us</a>
                        </li>
                      </ul>
                      <div className="border-top px-5 py-3">
                        <a onClick={handleLogout}>Log Out</a>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="main-wrapper">
        {/* Sidebar Navigation */}
        <nav className="navbar-vertical-nav d-none d-xl-block">
          <div className="navbar-vertical">
            <div className="px-4 py-5">
              <a href="/" className="navbar-brand">
                <img
                  src="../assets/images/logo/logo.svg"
                  alt="Logo"
                  className="logo-size"
                />
              </a>
            </div>
            <div className="navbar-vertical-content flex-grow-1" data-simplebar>
              <ul className="navbar-nav flex-column" id="sideNavbar">
                <li className="nav-item">
                  <a className="nav-link active" href="/">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-house" /></span>
                      <span className="nav-link-text">Dashboard</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item mt-6 mb-3">
                  <span className="nav-label">Store Managements</span>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/product">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-box-seam" /></span>
                      <span className="nav-link-text">Products</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add-product">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-plus-square" /></span>
                      <span className="nav-link-text">Add Product</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/stock">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-clipboard2-pulse" /></span>
                      <span className="nav-link-text">Inventory</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/orders">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-receipt" /></span>
                      <span className="nav-link-text">Orders</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/sales">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-graph-up" /></span>
                      <span className="nav-link-text">Sales</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar Navigation */}
        <nav className="navbar-vertical-nav offcanvas offcanvas-start navbar-offcanvac" tabIndex={-1} id="offcanvasExample">
          <div className="navbar-vertical">
            <div className="px-4 py-5 d-flex justify-content-between align-items-center">
              <a href="/" className="navbar-brand">
                <img
                  src="../assets/images/logo/logo.svg"
                  alt=""
                  className="logo-size"
                />
              </a>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="navbar-vertical-content flex-grow-1" data-simplebar>
              <ul className="navbar-nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active" href="/">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-speedometer2" /></span>
                      <span>Dashboard</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item mt-6 mb-3">
                  <span className="nav-label">Store Management</span>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/product">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-box-seam" /></span>
                      <span className="nav-link-text">Products</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add-product">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-plus-square" /></span>
                      <span className="nav-link-text">Add Product</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/stock">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-clipboard2-pulse" /></span>
                      <span className="nav-link-text">Inventory</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/orders">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-receipt" /></span>
                      <span className="nav-link-text">Orders</span>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/sales">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon"><i className="bi bi-graph-up" /></span>
                      <span className="nav-link-text">Sales</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};