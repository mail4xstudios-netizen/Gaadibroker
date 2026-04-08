"use client";

import { useState, useEffect } from "react";

const defaultContent = `Welcome to GaadiBroker. By accessing or using our website (gaadibroker.com) and services, you agree to be bound by these Terms & Conditions. Please read them carefully before using our platform.

1. Acceptance of Terms

By accessing, browsing, or using GaadiBroker, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.

2. About Our Services

GaadiBroker provides an online platform for buying and selling pre-owned vehicles. We act as an intermediary connecting buyers and sellers. We do not own the vehicles listed on our platform unless explicitly stated. Our services include vehicle listings, test drive bookings, loan assistance, and car valuations.

3. Eligibility

You must be at least 18 years of age and legally competent to enter into contracts under the Indian Contract Act, 1872, to use our services.

4. User Account & Responsibilities

- You must provide accurate, current, and complete information during registration
- You are responsible for maintaining the confidentiality of your account credentials
- You must not use the platform for any unlawful or fraudulent purpose
- You agree not to impersonate any person or entity
- You are solely responsible for all activities that occur under your account

5. Vehicle Listings

Sellers must provide accurate and truthful information about their vehicles. GaadiBroker reserves the right to remove any listing that is found to be inaccurate, misleading, or fraudulent. While we strive to verify listings, buyers are advised to conduct their own independent inspection.

6. Test Drive Bookings

Test drive bookings are subject to vehicle availability and seller confirmation. You must carry a valid driving licence, drive responsibly, and be liable for any damage caused during the test drive.

7. Payments & Transactions

All financial transactions related to vehicle purchases are between the buyer and seller directly. GaadiBroker is not responsible for any disputes arising from vehicle transactions.

8. Inspection & Warranty

Vehicles listed as "Certified" or "Inspected" have undergone our quality inspection process. However, this does not constitute a warranty or guarantee.

9. Limitation of Liability

GaadiBroker shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our platform.

10. Intellectual Property

All content on GaadiBroker is our intellectual property and protected under the Copyright Act, 1957 and the Trade Marks Act, 1999.

11. Prohibited Activities

- Posting fake, misleading, or fraudulent listings
- Scraping or automated data collection from the platform
- Attempting to gain unauthorised access to our systems
- Harassing or abusing other users

12. Termination

We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, for violation of these terms.

13. Governing Law & Jurisdiction

These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.

14. Contact Us

If you have any questions about these Terms & Conditions, contact us at:
Email: hello@gaadibroker.com
Phone: +91 8108797000
Address: Shop 48, Shreeji Heights, Sector-46/A, Seawoods, Navi Mumbai 400706`;

export default function TermsPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data.termsOfService) setContent(data.termsOfService);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Terms &amp; Conditions</h1>
          <p className="text-sm text-slate-500 mt-1">Last Updated: April 8, 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
}
