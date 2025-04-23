import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Api } from '../../APIs/Api';
import Swal from 'sweetalert2';

export const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await Api.post('api/password-reset/', { email });
      setMessage(response.data.message || 'Password reset link sent to your email');
      Swal.fire({
        title: 'Success!',
        text: 'Password reset link has been sent to your email',
        icon: 'success'
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending reset link');
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to send reset link',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              <img src="../assets/images/svg-graphics/signin-g.svg" alt="" className="img-fluid" />
            </div>
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">Reset Password</h1>
                <p>Enter your email to receive a password reset link</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="resetEmail" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="resetEmail"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      </div>
  );
};