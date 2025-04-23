import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiX, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Api } from '../../APIs/Api';
import Swal from 'sweetalert2';

const banks = [
  "Chase Bank",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "U.S. Bank",
  "Truist Bank",
  "PNC Bank",
  "Capital One",
  "TD Bank",
  "HSBC Bank"
];

export const ProfileCompletionAlert = ({ userProfile, onComplete }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState([]);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankname: '',
    bankaccount: ''
  });

  // Show modal if bank details are missing
  useEffect(() => {
    if (userProfile && (!userProfile.bankaccount || !userProfile.bankname)) {
      const timer = setTimeout(() => setShowModal(true), 100);
      return () => clearTimeout(timer);
    }
  }, [userProfile]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare the data to send to the API
      const updatedProfile = {
        ...userProfile,
        bankname: bankDetails.bankname,
        bankaccount: bankDetails.bankaccount
      };

      // Send the update to the API
      const response = await Api.patch(`/api/user-profile/${user.id}/`, updatedProfile);
      
      // If the API call is successful
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Bank details saved successfully!',
        });
        onComplete(bankDetails);
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
                      name="bankname"
                      className="form-select"
                      value={bankDetails.bankname}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your bank</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      name="bankaccount"
                      className="form-control"
                      placeholder="Enter your account number"
                      value={bankDetails.bankaccount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
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
                      disabled={loading}
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
        {showFloatingButton && !(userProfile?.bankaccount && userProfile?.bankname) && (
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
      {userProfile?.bankaccount && userProfile?.bankname && (
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
            Bank details saved successfully! Payments will be deposited to {userProfile.bankname}.
          </div>
        </div>
      )}
    </>
  );
};

// import React, { useState, useEffect } from 'react';
// import { FiAlertCircle, FiX, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Api } from '../../APIs/Api';
// import Swal from 'sweetalert2';
// import axios from 'axios';

// export const ProfileCompletionAlert = ({ userProfile, onComplete }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [user, setUser] = useState([]);
//   const [showFloatingButton, setShowFloatingButton] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [banks, setBanks] = useState([]);
//   const [bankDetails, setBankDetails] = useState({
//     bankname: '',
//     bankaccount: ''
//   });

//   // Fetch user profile
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const response = await Api.get('/api/user-profile/');
//       const userData = Array.isArray(response.data) ? response.data[0] : response.data;
//       setUser(userData);
//     };
//     fetchUserData();
//   }, []);

//   // Show modal if bank details are missing
//   useEffect(() => {
//     if (userProfile && (!userProfile.bankaccount || !userProfile.bankname)) {
//       const timer = setTimeout(() => setShowModal(true), 100);
//       return () => clearTimeout(timer);
//     }
//   }, [userProfile]);

//   // Fetch banks with logos from BudPay API
//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await axios.get('https://api.budpay.com/api/v2/bank_list/NGN', {
//           headers: {
//             Authorization: 'sk_test_fliu2hzessxdw3lsoh3mfxrt4evlfblgcytzibs' 
//           }
//         });
//         setBanks(response.data.data);
//       } catch (error) {
//         console.error('Error fetching banks:', error);
//       }
//     };
//     fetchBanks();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setBankDetails(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const updatedProfile = {
//         ...userProfile,
//         bankname: bankDetails.bankname,
//         bankaccount: bankDetails.bankaccount
//       };

//       const response = await Api.patch(`/api/user-profile/${user.id}/`, updatedProfile);
//       if (response.status === 200) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: 'Bank details saved successfully!',
//         });
//         onComplete(bankDetails);
//         setShowModal(false);
//         setShowFloatingButton(false);
//       }
//     } catch (error) {
//       console.error('Error saving bank details:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to save bank details. Please try again.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setShowModal(false);
//     setTimeout(() => setShowFloatingButton(true), 500);
//   };

//   return (
//     <>
//       {/* Pop-up Modal */}
//       {showModal && (
//         <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg">
//               <div className="modal-header bg-light">
//                 <div className="d-flex align-items-center">
//                   <FiAlertCircle className="text-warning me-2 fs-4" />
//                   <h5 className="modal-title fs-5">Complete Payment Setup</h5>
//                 </div>
//                 <button 
//                   type="button" 
//                   className="btn-close" 
//                   onClick={handleCancel}
//                 >
//                   <FiX />
//                 </button>
//               </div>
              
//               <div className="modal-body p-4">
//                 <p className="text-muted mb-4">
//                   To receive payments, please add your bank account information:
//                 </p>
                
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-3">
//                     <label className="form-label">Bank Name</label>
//                     <select
//                       name="bankname"
//                       className="form-select"
//                       value={bankDetails.bankname}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select your bank</option>
//                       {banks.map((bank) => (
//                         <option key={bank.bank_code} value={bank.bank_name.trim()}>
//                           {bank.logo && <img src={bank.logo} alt="" width="20" height="20" style={{ marginRight: '8px' }} />}
//                           {bank.bank_name.trim()}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="mb-4">
//                     <label className="form-label">Account Number</label>
//                     <input
//                       type="text"
//                       name="bankaccount"
//                       className="form-control"
//                       placeholder="Enter your account number"
//                       value={bankDetails.bankaccount}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
                  
//                   <div className="d-flex justify-content-end gap-2">
//                     <button
//                       type="button"
//                       className="btn btn-outline-secondary"
//                       onClick={handleCancel}
//                       disabled={loading}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit" 
//                       className="btn btn-primary"
//                       disabled={loading}
//                     >
//                       {loading ? 'Saving...' : 'Save Details'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating Notification Button */}
//       <AnimatePresence>
//         {showFloatingButton && !(userProfile?.bankaccount && userProfile?.bankname) && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             className="position-fixed bottom-0 end-0 m-3"
//             style={{ zIndex: 9999 }}
//           >
//             <button
//               onClick={() => {
//                 setShowModal(true);
//                 setShowFloatingButton(false);
//               }}
//               className="btn btn-danger rounded-circle p-3 shadow"
//             >
//               <div className="position-relative">
//                 <FiCreditCard className="fs-4 text-white" />
//                 <motion.span
//                   className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
//                   animate={{ scale: [1, 1.2, 1] }}
//                   transition={{ duration: 1.5, repeat: Infinity }}
//                 />
//               </div>
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Success Notification */}
//       {userProfile?.bankaccount && userProfile?.bankname && (
//         <div className="toast show position-fixed bottom-0 end-0 m-3" style={{ zIndex: 9999 }}>
//           <div className="toast-header bg-success text-white">
//             <FiCheckCircle className="me-2" />
//             <strong className="me-auto">Success</strong>
//             <button 
//               type="button" 
//               className="btn-close btn-close-white" 
//               onClick={() => {}}
//             />
//           </div>
//           <div className="toast-body">
//             Bank details saved successfully! Payments will be deposited to {userProfile.bankname}.
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
