import React, { useState } from "react";
import { BiEnvelope, BiHelpCircle, BiCheckCircle } from "react-icons/bi";
import { Api } from "../../APIs/Api";

export const SupportPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'account'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await Api.post('/api/support/', {
        subject: formData.subject,
        category: formData.category,
        message: formData.message
      });

      setSubmitSuccess(true);
      setFormData({
        subject: '',
        message: '',
        category: 'account'
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit support request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <main className="main-content-wrapper">
        <div className="container">
          <div className="row justify-content-center py-10">
            <div className="col-lg-6 col-md-8 col-12 text-center">
              <BiCheckCircle className="text-success mb-4" size={64} />
              <h2 className="mb-3">Support Request Submitted</h2>
              <p className="mb-5">Thank you for contacting us. Our support team will get back to you soon.</p>
              <a href="/" className="btn btn-primary">Return to Dashboard</a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-12">
            <div className="card">
              <div className="card-body p-6">
                <div className="mb-6 text-center">
                  <BiHelpCircle className="text-primary mb-3" size={48} />
                  <h3 className="mb-2">How can we help you?</h3>
                  <p className="mb-0">Fill out the form below and our team will get back to you as soon as possible.</p>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="account">Account Issues</option>
                      <option value="payment">Payment Problems</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          <BiEnvelope className="me-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <small className="text-muted">
                        Go Back Home {' '}
                        <a href="/" className="text-decoration-none fw-semibold"> Dashboard</a>
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};