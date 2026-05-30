"use client";

import { useState, useEffect } from "react";

const defaultContent = `Effective Date: May 30, 2026

Welcome to GaadiBroker ("we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, share, and protect your information when you use our website and services.

By accessing or using GaadiBroker, you agree to the terms of this Privacy Policy.

1. Information We Collect

We may collect the following types of information:

a. Personal Information
- Full Name
- Phone Number
- Email Address
- Location (City/Area)

b. Vehicle & Preference Data
- Car interest or inquiry details
- Budget and preferences
- Buying/selling intent

c. Technical Information
- IP address
- Browser type
- Device information
- Website usage data

d. Cookies & Tracking
We use cookies and similar technologies to enhance user experience and analyze website traffic.

2. How We Use Your Information

We use your information to:
- Connect buyers with verified dealers/sellers
- Respond to your inquiries
- Provide customer support
- Send updates, offers, and promotional messages
- Improve our services and user experience
- Run marketing and advertising campaigns

3. Consent for Communication

By submitting your details on GaadiBroker, you expressly consent to be contacted by:
- GaadiBroker team
- Verified dealer partners
- Associated service providers

via:
- Phone calls
- SMS
- WhatsApp
- Email

regarding your inquiry, offers, and related services.

4. Sharing of Information

We may share your information with:
- Verified car dealers and channel partners
- Loan providers and financial institutions (if applicable)
- RTO agents and service partners

We do not sell your personal data to unauthorized third parties.

5. Data Security

We implement reasonable security measures to protect your data, including:
- Secure servers
- Restricted data access
- Regular monitoring

However, no method of transmission over the internet is 100% secure.

6. Your Rights

You have the right to:
- Request access to your data
- Request correction of incorrect data
- Request deletion of your data
- Opt out of marketing communications

To exercise these rights, contact us using the details below.

7. Third-Party Links

Our website may contain links to third-party websites or services. We are not responsible for their privacy practices or content.

8. Retention of Data

We retain your information only for as long as necessary to:
- Fulfill the purposes outlined in this policy
- Comply with legal obligations
- Resolve disputes

9. Policy Updates

We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.

10. Legal Compliance

This Privacy Policy complies with applicable Indian laws, including:
- Information Technology Act, 2000
- Digital Personal Data Protection Act, 2023

11. Contact Us

For any questions, concerns, or requests regarding this Privacy Policy, please contact:

GaadiBroker
Email: hello@gaadibroker.com
Phone: +91 8108797000
Address: Shop 48, Shreeji Heights, Sector-46/A, Seawoods, Navi Mumbai 400706

—

GaadiBroker is a platform that facilitates connections between buyers and sellers and does not take ownership of listed vehicles.`;

export default function PrivacyPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data.privacyPolicy) setContent(data.privacyPolicy);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mt-1">Last Updated: May 30, 2026</p>
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
