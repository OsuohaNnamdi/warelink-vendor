import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export const VendorTermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Vendor Terms and Conditions - LapiNaija</title>
        <meta name="description" content="LapiNaija vendor terms and conditions for selling on our platform" />
      </Helmet>

      <div className="container py-5 my-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm">
              {/* Back button */}
              <button 
                onClick={() => navigate(-1)} 
                className="btn btn-outline-primary d-inline-flex align-items-center mb-4"
                aria-label="Go back"
              >
                <FiArrowLeft className="me-2" />
                Back
              </button>

              <div className="text-center mb-5">
                <h1 className="mb-3 fw-bold display-5">LAPI NAIJA VENDOR TERMS AND CONDITIONS</h1>
                <div className="d-flex justify-content-center align-items-center">
                  <hr className="w-25 border-primary border-2 opacity-75" />
                  <span className="mx-3 text-primary fw-medium">Vendor Agreement</span>
                  <hr className="w-25 border-primary border-2 opacity-75" />
                </div>
                <p className="text-muted mt-3">Effective Date: 1/08/2025 | Last Updated: 1/08/2025</p>
                <p className="text-muted">Platform Owner: Synoloop Solutions Ltd</p>
                <p className="text-muted">Platform: Lapi Naija (www.lapinaija.com)</p>
              </div>

              <div className="mb-5">
                <div className="alert alert-primary bg-primary bg-opacity-10 border-0">
                  <p className="mb-0 lead">
                    These Vendor Terms and Conditions ("Agreement") constitute a legally binding contract between you 
                    ("Vendor" or "Seller") and Synoloop Solutions Ltd ("Lapi Naija", "we", "our", or "us"), governing 
                    your use of the Lapi Naija e-commerce platform and associated services.
                  </p>
                </div>
              </div>

              <div className="accordion mb-5" id="termsAccordion">
                {/* Section 1 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingOne">
                    <button 
                      className="accordion-button bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseOne"
                    >
                      1. Introduction
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne">
                    <div className="accordion-body pt-3">
                      <p>1.1. These Vendor Terms and Conditions ("Agreement") constitute a legally binding contract between you ("Vendor" or "Seller") and Synoloop Solutions Ltd ("Lapi Naija", "we", "our", or "us"), governing your use of the Lapi Naija e-commerce platform and associated services made available for the listing and sale of goods.</p>
                      <p>1.2. By registering as a Vendor on the Lapi Naija platform, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement, our Privacy Policy, and all other applicable Platform policies.</p>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingTwo">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseTwo"
                    >
                      2. Eligibility and Registration
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo">
                    <div className="accordion-body pt-3">
                      <p>2.1. To register as a Vendor, you must:</p>
                      <ul>
                        <li>Be at least 18 years old.</li>
                        <li>Operate a registered business (individual sellers may be allowed with proof of identity and address).</li>
                        <li>Provide valid business, identity, and contact details.</li>
                        <li>Pass our verification and vetting process.</li>
                      </ul>
                      <p>2.2. Vendors are required to submit the following for verification:</p>
                      <ul>
                        <li>Valid government-issued ID (e.g., NIN, driver's license, international passport)</li>
                        <li>Proof of address</li>
                        <li>Valid email address and phone number</li>
                        <li>Bank account information for payouts</li>
                        <li>Business registration documents (where applicable)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingThree">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseThree"
                    >
                      3. Vendor Obligations
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree">
                    <div className="accordion-body pt-3">
                      <p><strong>3.1. Product Listings:</strong></p>
                      <ul>
                        <li>Vendors may only list high-quality UK used phones and laptops.</li>
                        <li>Products must be clean, fully functional, and free from significant defects or scratches.</li>
                        <li>Each listing must include clear, high-resolution images, accurate descriptions, and true specifications.</li>
                      </ul>
                      
                      <p><strong>3.2. Prohibited Listings:</strong></p>
                      <ul>
                        <li>Non-UK used products</li>
                        <li>New items</li>
                        <li>Nigerian-used or substandard goods</li>
                        <li>Damaged, stolen, counterfeit, or illegal items</li>
                      </ul>
                      
                      <p><strong>3.3. Inventory & Fulfillment:</strong></p>
                      <ul>
                        <li>Vendors must maintain accurate stock availability.</li>
                        <li>All orders must be fulfilled within the committed timelines.</li>
                        <li>Late deliveries or non-fulfillment may result in penalties or suspension.</li>
                      </ul>
                      
                      <p><strong>3.4. Pricing & Promotions:</strong></p>
                      <ul>
                        <li>Vendors control their product pricing.</li>
                        <li>Lapi Naija reserves the right to run promotional discounts with Vendor consent.</li>
                      </ul>
                      
                      <p><strong>3.5. Compliance:</strong></p>
                      <p>Vendors must comply with all applicable laws, including:</p>
                      <ul>
                        <li>Consumer Protection Act</li>
                        <li>Nigeria Data Protection Regulation (NDPR)</li>
                        <li>Electronic Transactions Act</li>
                        <li>Intellectual Property laws</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingFour">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseFour"
                    >
                      4. Fees, Commissions, and Payouts
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour">
                    <div className="accordion-body pt-3">
                      <p>4.1. Vendors are charged a 5% commission per successfully completed transaction.</p>
                      <p>4.2. There are no product listing fees currently.</p>
                      <p>4.3. All commissions are deducted automatically before payouts.</p>
                      <p>4.4. Payouts are processed Weekly to the Vendor's provided account details, subject to:</p>
                      <ul>
                        <li>Order completion</li>
                        <li>Expiry of return/refund window</li>
                        <li>Absence of disputes</li>
                      </ul>
                      <p>4.5. Lapi Naija reserves the right to withhold or delay payouts in the event of suspected fraud, chargebacks, customer complaints, or violation of terms.</p>
                    </div>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingFive">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseFive"
                    >
                      5. Returns, Refunds, and Disputes
                    </button>
                  </h2>
                  <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive">
                    <div className="accordion-body pt-3">
                      <p>5.1. Vendors are required to accept returns or issue refunds in cases involving:</p>
                      <ul>
                        <li>Faulty or defective products</li>
                        <li>Items not matching their description</li>
                        <li>Delivery of wrong products</li>
                      </ul>
                      <p>5.2. Return shipping costs are borne by the Vendor if the issue is due to Vendor error.</p>
                      <p>5.3. Disputes between Buyers and Vendors are initially mediated by Lapi Naija. Our decision, after investigation, shall be final.</p>
                      <p>5.4. Repeated complaints or abuse of the return system by a Vendor may result in termination.</p>
                    </div>
                  </div>
                </div>

                {/* Section 6 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingSix">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseSix"
                    >
                      6. Intellectual Property and Content
                    </button>
                  </h2>
                  <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix">
                    <div className="accordion-body pt-3">
                      <p>6.1. Vendors retain ownership of their brand, product photos, and content they upload. However, by listing on the Platform, Vendors grant Lapi Naija a non-exclusive, royalty-free license to use, display, and promote such content.</p>
                      <p>6.2. Vendors must not infringe on third-party trademarks, copyrights, or intellectual property.</p>
                    </div>
                  </div>
                </div>

                {/* Section 7 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingSeven">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseSeven"
                    >
                      7. Platform Conduct and Integrity
                    </button>
                  </h2>
                  <div id="collapseSeven" className="accordion-collapse collapse" aria-labelledby="headingSeven">
                    <div className="accordion-body pt-3">
                      <p>7.1. Vendors agree to uphold the highest level of integrity and professional conduct.</p>
                      <p>7.2. Vendors must not:</p>
                      <ul>
                        <li>Engage in fraudulent activity</li>
                        <li>Manipulate reviews or ratings</li>
                        <li>Misrepresent products</li>
                        <li>Attempt to transact with Buyers outside the Platform ("off-platform transactions")</li>
                      </ul>
                      <p>7.3. Violations of these obligations may result in:</p>
                      <ul>
                        <li>Product takedown</li>
                        <li>Account suspension or termination</li>
                        <li>Legal action</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 8 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingEight">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseEight"
                    >
                      8. Data Protection and Confidentiality
                    </button>
                  </h2>
                  <div id="collapseEight" className="accordion-collapse collapse" aria-labelledby="headingEight">
                    <div className="accordion-body pt-3">
                      <p>8.1. Vendors must comply with the Nigeria Data Protection Regulation (NDPR) in all customer-related data processing.</p>
                      <p>8.2. Vendors may only use customer information (e.g., delivery details) for order fulfillment and may not retain, resell, or misuse such data.</p>
                      <p>8.3. Vendors must not disclose, share, or use Lapi Naija's business data, platform infrastructure, or other confidential information without written authorization.</p>
                    </div>
                  </div>
                </div>

                {/* Section 9 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingNine">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseNine"
                    >
                      9. Liability and Indemnity
                    </button>
                  </h2>
                  <div id="collapseNine" className="accordion-collapse collapse" aria-labelledby="headingNine">
                    <div className="accordion-body pt-3">
                      <p>9.1. Vendors agree to indemnify and hold harmless Synoloop Solutions Ltd, its directors, officers, staff, and affiliates from and against any liabilities, claims, damages, losses, and expenses arising from:</p>
                      <ul>
                        <li>Breach of these Terms</li>
                        <li>Violation of applicable laws</li>
                        <li>Infringement of third-party rights</li>
                        <li>Faulty or misrepresented products</li>
                      </ul>
                      <p>9.2. Synoloop Solutions Ltd shall not be liable for any indirect, consequential, or incidental damages.</p>
                    </div>
                  </div>
                </div>

                {/* Section 10 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingTen">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseTen"
                    >
                      10. Account Suspension and Termination
                    </button>
                  </h2>
                  <div id="collapseTen" className="accordion-collapse collapse" aria-labelledby="headingTen">
                    <div className="accordion-body pt-3">
                      <p>10.1. Lapi Naija reserves the right to suspend or terminate a Vendor account without prior notice in the event of:</p>
                      <ul>
                        <li>Fraudulent activity</li>
                        <li>Breach of terms</li>
                        <li>Repeated customer complaints</li>
                        <li>Failure to fulfill orders</li>
                      </ul>
                      <p>10.2. Upon termination, all pending payouts may be withheld until investigations are concluded.</p>
                      <p>10.3. Vendors may request voluntary account closure with 14 days' notice.</p>
                    </div>
                  </div>
                </div>

                {/* Section 11 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingEleven">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseEleven"
                    >
                      11. Modification of Terms
                    </button>
                  </h2>
                  <div id="collapseEleven" className="accordion-collapse collapse" aria-labelledby="headingEleven">
                    <div className="accordion-body pt-3">
                      <p>11.1. Lapi Naija reserves the right to amend these Terms at any time. Notice of material changes will be provided via email or platform notifications.</p>
                      <p>11.2. Continued use of the Platform following changes constitutes acceptance of the updated terms.</p>
                    </div>
                  </div>
                </div>

                {/* Section 12 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingTwelve">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseTwelve"
                    >
                      12. Governing Law and Dispute Resolution
                    </button>
                  </h2>
                  <div id="collapseTwelve" className="accordion-collapse collapse" aria-labelledby="headingTwelve">
                    <div className="accordion-body pt-3">
                      <p>12.1. These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
                      <p>12.2. Disputes shall be submitted to arbitration under the Arbitration and Conciliation Act at the Lagos Court of Arbitration (LCA).</p>
                      <p>12.3. Arbitration proceedings shall be conducted in English, and the decision of the arbitrator shall be binding.</p>
                    </div>
                  </div>
                </div>

                {/* Section 13 */}
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header" id="headingThirteen">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseThirteen"
                    >
                      13. Miscellaneous
                    </button>
                  </h2>
                  <div id="collapseThirteen" className="accordion-collapse collapse" aria-labelledby="headingThirteen">
                    <div className="accordion-body pt-3">
                      <p><strong>Entire Agreement:</strong> This Agreement constitutes the full agreement between the Vendor and Lapi Naija.</p>
                      <p><strong>No Partnership:</strong> This Agreement does not create any agency, partnership, or employment relationship.</p>
                      <p><strong>Severability:</strong> If any provision is held unenforceable, the remainder shall remain valid.</p>
                      <p><strong>Waiver:</strong> Failure to enforce any part of this Agreement shall not constitute a waiver.</p>
                    </div>
                  </div>
                </div>

                {/* Section 14 */}
                <div className="accordion-item border-0">
                  <h2 className="accordion-header" id="headingFourteen">
                    <button 
                      className="accordion-button collapsed bg-light fs-4 fw-bold text-dark shadow-none rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseFourteen"
                    >
                      14. Contact Information
                    </button>
                  </h2>
                  <div id="collapseFourteen" className="accordion-collapse collapse" aria-labelledby="headingFourteen">
                    <div className="accordion-body pt-3">
                      <p>If you have any questions or concerns about these Terms, please contact:</p>
                      <address className="mb-4">
                        <strong>Email:</strong> <a href="mailto:vendorsupport@lapinaija.com" className="text-decoration-none">vendorsupport@lapinaija.com</a><br />
                        <strong>Business Address:</strong> Lasu Road, Ojo, Lagos, Nigeria<br />
                        <strong>Phone:</strong> +234 XXX XXX XXXX
                      </address>
                      <div className="alert alert-light border">
                        <p className="mb-0">
                          <strong>ACKNOWLEDGEMENT:</strong><br />
                          By signing up and listing products as a Vendor on Lapi Naija, you confirm that you have read,
                          understood, and agreed to these Vendor Terms and Conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-5">
                <button 
                  onClick={() => navigate(-1)} 
                  className="btn btn-primary px-4 py-2"
                >
                  I Understand - Return to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};