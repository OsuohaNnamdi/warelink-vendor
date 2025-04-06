import React, { useState, useEffect } from "react";
import { BiUser, BiCalendar, BiIdCard, BiCheckShield, BiXCircle } from "react-icons/bi";
import { Api } from "../../APIs/Api";
import Swal from "sweetalert2";

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await Api.get('/api/user-profile/');
        // If response.data is an array, take the first element
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        setUser(userData);
        setEditedUser(userData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile data');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to load profile data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!editedUser.firstname || !editedUser.lastname) {
        throw new Error('First name and last name are required');
      }

      const response = await Api.patch(`/api/user-profile/${editedUser.id}/`, editedUser);
      
      // Update the user state with the new data
      setUser(response.data);
      setEditedUser(response.data);
      setIsEditing(false);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile updated successfully',
      });
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || err.response?.data?.message || 'Failed to update profile');
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="text-center py-5">Loading profile...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <div className="alert alert-warning">No user data found</div>;

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

      <div className={`container ${user.is_banned ? 'pe-none' : ''}`} style={{ filter: user.is_banned ? 'blur(3px)' : 'none' }}>
        <div className="row mb-8">
          <div className="col-md-12">
            <div>
              <h2>Profile</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><a href="#" className="text-inherit">Dashboard</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Profile</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-12">
            {/* Profile Card */}
            <div className="card mb-6">
              <div className="card-body p-6">
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <h3 className="mb-0">Personal Information</h3>
                  {!isEditing ? (
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setIsEditing(true)}
                      disabled={user.is_banned}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div>
                      <button 
                        className="btn btn-outline-secondary me-2"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedUser({ ...user });
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="firstname"
                        value={editedUser.firstname || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <div className="form-control-plaintext">{user.firstname}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        value={editedUser.lastname || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <div className="form-control-plaintext">{user.lastname}</div>
                    )}
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label">Email</label>
                    <div className="form-control-plaintext">{user.email}</div>
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label">Business Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="businessname"
                        value={editedUser.businessname || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="form-control-plaintext">{user.businessname}</div>
                    )}
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label">Business Address</label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        name="businessaddress"
                        value={editedUser.businessaddress || ''}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    ) : (
                      <div className="form-control-plaintext">{user.businessaddress}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information Card */}
            <div className="card">
              <div className="card-body p-6">
                <h3 className="mb-6">Bank Information</h3>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Bank Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="bankname"
                        value={editedUser.bankname || ''}
                        onChange={handleInputChange}
                        placeholder="Enter bank name"
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        {user.bankname || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Account Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="bankaccount"
                        value={editedUser.bankaccount || ''}
                        onChange={handleInputChange}
                        placeholder="Enter account number"
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        {user.bankaccount || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Account Details */}
          <div className="col-lg-4 col-12">
            <div className="card mb-6 position-relative">
              {/* Verification Sticker */}
              <div className="position-absolute top-0 end-0 m-3">
                {user.is_verified ? (
                  <div className="bg-success text-white rounded-pill px-3 py-1 d-flex align-items-center">
                    <BiCheckShield className="me-1" />
                    <span className="small">Verified</span>
                  </div>
                ) : (
                  <div className="bg-warning text-dark rounded-pill px-3 py-1 d-flex align-items-center">
                    <BiXCircle className="me-1" />
                    <span className="small">Not Verified</span>
                  </div>
                )}
              </div>
              
              <div className="card-body p-6">
                <div className="text-center">
                <div className="avatar avatar-xxl mb-4 position-relative">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt="Profile"
                        className="avatar-img rounded-circle"
                      />
                    ) : (
                      <div className="avatar-img rounded-circle d-flex align-items-center justify-content-center bg-light text-secondary" 
                          style={{ fontSize: '3rem', width: '100%', height: '100%' }}>
                        <BiUser />
                      </div>
                    )}
                  </div>
                  <h4 className="mb-1">{user.firstname} {user.lastname}</h4>
                  <p className="text-muted mb-3">{user.businessname}</p>
                  <div className="d-flex justify-content-center mb-3">
                    {user.is_banned && (
                      <span className="badge bg-danger ms-2">Banned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-6">
                <h3 className="mb-4 d-flex align-items-center">
                  <BiUser className="me-2" />
                  Account Details
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <BiCalendar className="me-2 text-muted" />
                    <div>
                      <strong>Member Since:</strong>
                      <span className="text-muted ms-2 d-block">{formatDate(user.created_at)}</span>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <BiCalendar className="me-2 text-muted" />
                    <div>
                      <strong>Last Updated:</strong>
                      <span className="text-muted ms-2 d-block">{formatDate(user.updated_at)}</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <BiIdCard className="me-2 text-muted" />
                    <div>
                      <strong>Account ID:</strong>
                      <span className="text-muted ms-2 d-block">{user.shopid}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};