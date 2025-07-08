import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiX, FiCreditCard, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Api } from '../../APIs/Api';
import Swal from 'sweetalert2';

export const ProfileCompletionAlert = ({ userProfile, onComplete }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState([]);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [banks, setBanks] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bank_code: '',
    bank_name: '',
    bank_account: '',
    account_name: ''
  });

  // Fetch bank list on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await Api.get('/api/banks/');
        if (response.data.success) {
          setBanks(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load bank list. Please try again later.',
        });
      }
    };
    
    fetchBanks();
  }, []);

  // Show modal if bank details are missing
  useEffect(() => {
    if (userProfile && (!userProfile.bank_account || !userProfile.bank_name)) {
      const timer = setTimeout(() => setShowModal(true), 100);
      return () => clearTimeout(timer);
    }
  }, [userProfile]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await Api.get('/api/user-profile/');
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      setUser(userData);
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBankSelect = (e) => {
    const selectedBank = banks.find(bank => bank.bank_code === e.target.value);
    setBankDetails(prev => ({
      ...prev,
      bank_code: selectedBank.bank_code,
      bank_name: selectedBank.bank_name
    }));
  };

  const verifyAccount = async () => {
    if (!bankDetails.bank_code || !bankDetails.bank_account) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please select a bank and enter account number',
      });
      return;
    }

    setVerifying(true);
    try {
      const response = await Api.post('/api/banks/verify_account/', {
        bank_code: bankDetails.bank_code,
        account_number: bankDetails.bank_account
      });

      if (response.data.success) {
        setBankDetails(prev => ({
          ...prev,
          account_name: response.data.data.account_name
        }));
        Swal.fire({
          icon: 'success',
          title: 'Verification Successful',
          text: `Account name: ${response.data.data.account_name}`,
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.response?.data?.message || 'Could not verify account details. Please check and try again.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bankDetails.account_name) {
      Swal.fire({
        icon: 'warning',
        title: 'Account Not Verified',
        text: 'Please verify your account before submitting',
      });
      return;
    }
  
    setLoading(true);
    
    try {
      const response = await Api.patch(`/api/user-profile/${user.id}/`, {
        bankname: bankDetails.bank_name,
        bankaccount: bankDetails.bank_account
      });
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Bank details saved successfully!',
        });
        // Call onComplete with the new details
        onComplete({
          bankname: bankDetails.bank_name,
          bankaccount: bankDetails.bank_account
        });
        setShowModal(false);
        setShowFloatingButton(false);
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save bank details. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setTimeout(() => setShowFloatingButton(true), 500);
  };

  return (
    <>
      {/* Pop-up Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light">
                <div className="d-flex align-items-center">
                  <FiAlertCircle className="text-warning me-2 fs-4" />
                  <h5 className="modal-title fs-5">Complete Payment Setup</h5>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCancel}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="modal-body p-4">
                <p className="text-muted mb-4">
                  To receive payments, please add your bank account information:
                </p>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Bank Name</label>
                    <select
                      name="bank_code"
                      className="form-select"
                      value={bankDetails.bank_code}
                      onChange={handleBankSelect}
                      required
                    >
                      <option value="">Select your bank</option>
                      {banks.map(bank => (
                        <option key={bank.bank_code} value={bank.bank_code}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Account Number</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="bank_account"
                        className="form-control"
                        placeholder="Enter your account number"
                        value={bankDetails.bank_account}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={verifyAccount}
                        disabled={verifying || !bankDetails.bank_code || !bankDetails.bank_account}
                      >
                        {verifying ? (
                          <>
                            <FiLoader className="spin me-1" />
                            Verifying...
                          </>
                        ) : 'Verify'}
                      </button>
                    </div>
                  </div>
                  
                  {bankDetails.account_name && (
                    <div className="mb-4 alert alert-success">
                      <strong>Account Name:</strong> {bankDetails.account_name}
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading || !bankDetails.account_name}
                    >
                      {loading ? 'Saving...' : 'Save Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Button */}
      <AnimatePresence>
        {showFloatingButton && !(userProfile?.bank_account && userProfile?.bank_name) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="position-fixed bottom-0 end-0 m-3"
            style={{ zIndex: 9999 }}
          >
            <button
              onClick={() => {
                setShowModal(true);
                setShowFloatingButton(false);
              }}
              className="btn btn-danger rounded-circle p-3 shadow"
            >
              <div className="position-relative">
                <FiCreditCard className="fs-4 text-white" />
                <motion.span
                  className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      {userProfile?.bank_account && userProfile?.bank_name && (
        <div className="toast show position-fixed bottom-0 end-0 m-3" style={{ zIndex: 9999 }}>
          <div className="toast-header bg-success text-white">
            <FiCheckCircle className="me-2" />
            <strong className="me-auto">Success</strong>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => {}}
            />
          </div>
          <div className="toast-body">
            Bank details saved successfully! Payments will be deposited to {userProfile.bank_name} account {userProfile.bank_account}.
          </div>
        </div>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};