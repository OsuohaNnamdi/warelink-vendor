import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Api } from "../../APIs/Api";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

export const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: ""
  });
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(true);


  const showAlert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed && icon === "success") {
        navigate("/login");
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.re_new_password) {
      showAlert("Error", "Passwords do not match.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await Api.post(
        `api/password-reset-confirm/${uid}/${token}/`,
        {
          new_password: formData.new_password
        }
      );

      showAlert(
        "Success!", 
        "Your password has been reset successfully. You can now login with your new password.", 
        "success"
      );
    } catch (error) {
      let errorMessage = "Failed to reset password. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.new_password?.join(" ") || 
                      error.response.data?.re_new_password?.join(" ") || 
                      errorMessage;
      }
      showAlert("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <main>
        <section className="my-lg-14 my-8">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 text-center">
                <div className="card shadow-sm p-4">
                  <h2 className="text-danger mb-4">Invalid Password Reset Link</h2>
                  <p className="mb-4">
                    The password reset link is invalid or has expired. 
                    Please request a new password reset link.
                  </p>
                  <a href="/forgot-password" className="btn btn-primary">
                    Request New Reset Link
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              <img src="../assets/images/svg-graphics/signin-g.svg" alt className="img-fluid" />
            </div>
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">Set New Password</h1>
                <p>Create a new password for your account.</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="new_password" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="new_password"
                    name="new_password"
                    placeholder="Enter new password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <div className="form-text">Password must be at least 8 characters long.</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="re_new_password" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="re_new_password"
                    name="re_new_password"
                    placeholder="Confirm new password"
                    value={formData.re_new_password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary py-3" 
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Reset Password"
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
    </main>
  );
};