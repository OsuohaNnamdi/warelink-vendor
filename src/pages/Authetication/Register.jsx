import React, { useState } from "react";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import { Api } from "../../APIs/Api";
import { useNavigate } from "react-router-dom";



export const Register = () => {
  const [step, setStep] = useState(1);
  
  // Form states
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    businessname: "",
    businessaddress: "",
    email: "",
    password: ""
  });
  
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const showAlert = (title, text, icon) => {
    Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call to register vendor
      const response = await Api.post('/api/user-vendor/register/', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        businessname: formData.businessname,
        businessaddress: formData.businessaddress,
        email: formData.email,
        password: formData.password
      });
  
      if (response.data.message === "Verification code sent to email") {
        showAlert("Verification Sent", "Verification code sent to your email", "success");
        setStep(2);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      let errorMessage = "There was an issue with your registration. Please try again.";
      if (error.response) {
        
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }
      showAlert("Registration Failed", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };
  
  // Verify email with code
  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await Api.post('/api/user/verify-email/', {
        email: formData.email,
        code: verificationCode
      });
  
      if (response.data.access) {

        showAlert("Registration Complete", "Your vendor account has been successfully created!", "success");
       
      sessionStorage.setItem("token", response.data.access);
      sessionStorage.setItem("isAuthenticated", true);
      navigate("/")
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      let errorMessage = "Invalid verification code. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      showAlert("Verification Failed", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-wrapper" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div className="registration-container" style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="row g-0 justify-content-center">
          {/* Left Column - Visuals (Desktop only) */}
          <div className="col-lg-5 d-none d-lg-flex align-items-center pe-lg-4">
            <div className="text-center w-100">
              <img 
                src="../assets/images/svg-graphics/signup-g.svg" 
                alt="Registration" 
                className="img-fluid mb-4"
                style={{ maxWidth: "320px" }}
              />
              <h2 className="fw-bold mb-3">Vendor Registration</h2>
              <p className="text-muted mb-4">
                Join our platform to expand your business reach and connect with more customers.
              </p>
              
              <div className="d-flex justify-content-center mb-3">
                {[1, 2].map((stepNumber) => (
                  <div key={stepNumber} className="d-flex align-items-center">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center 
                        ${step >= stepNumber ? 'bg-primary text-white' : 'bg-light text-muted'}`}
                      style={{ 
                        width: "36px", 
                        height: "36px",
                        fontSize: "0.9rem",
                        fontWeight: "500"
                      }}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 2 && (
                      <div 
                        className={`mx-1 ${step > stepNumber ? 'bg-primary' : 'bg-light'}`} 
                        style={{ width: "40px", height: "2px" }}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <small className={`d-block mb-2 ${step >= 1 ? 'text-primary fw-semibold' : 'text-muted'}`}>
                  1. Business Information
                </small>
                <small className={`d-block ${step >= 2 ? 'text-primary fw-semibold' : 'text-muted'}`}>
                  2. Email Verification
                </small>
              </div>
            </div>
          </div>
          
          {/* Right Column - Form */}
          <div className="col-lg-5 col-md-8 col-12">
            <div className="card shadow-sm border-0 rounded-lg overflow-hidden h-100">
              <div className="card-body p-4 p-md-5">
                {/* Step 1: Business Information */}
                {step === 1 && (
                  <div>
                    <div className="mb-4 text-center">
                      <h1 className="h3 fw-bold mb-3">Business Information</h1>
                      <p className="text-muted">Please provide your business details</p>
                    </div>
                    <form onSubmit={handleRegisterSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label htmlFor="firstname" className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="firstname"
                            name="firstname"
                            placeholder="Your first name"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="lastname" className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="lastname"
                            name="lastname"
                            placeholder="Your last name"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="businessname" className="form-label">Business Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="businessname"
                          name="businessname"
                          placeholder="Your company name"
                          value={formData.businessname}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="businessaddress" className="form-label">Business Address</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="businessaddress"
                          name="businessaddress"
                          placeholder="Street, City, State, ZIP"
                          value={formData.businessaddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={8}
                        />
                      </div>
                      
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg py-3" disabled={loading}>
                          {loading ? <CircularProgress size={24} color="inherit" /> : "Register & Verify Email"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Step 2: Email Verification */}
                {step === 2 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <h1 className="h3 fw-bold mb-3">Verify Your Email</h1>
                      <p className="text-muted">
                        Enter the 6-digit code sent to <br /><strong>{formData.email}</strong>
                      </p>
                      <small className="text-muted">(Use 123456 for testing)</small>
                    </div>
                    <form onSubmit={verifyEmail}>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control form-control-lg text-center"
                          placeholder="• • • • • • •"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          required
                          maxLength={6}
                          style={{ letterSpacing: "0.5em", fontSize: "1.5rem" }}
                        />
                      </div>
                      <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg py-3" disabled={loading}>
                          {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Email"}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setStep(1)}
                        >
                          Back to Registration
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Already have an account?{' '}
                    <a href="/login" className="text-decoration-none fw-semibold">Sign in</a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};