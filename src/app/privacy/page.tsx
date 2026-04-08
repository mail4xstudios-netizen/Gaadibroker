"use client";

import { useState, useEffect } from "react";

const defaultContent = `GaadiBroker ("we", "us", "our") operates the website gaadibroker.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.

1. Information We Collect

Personal Information: When you use our services, we may collect your name, phone number, email address, city, and car preferences.

Usage Data: We automatically collect information about how you interact with our platform, including pages visited, time spent, device type, browser, and IP address.

Cookies: We use cookies and similar tracking technologies to improve your experience and analyse traffic.

2. How We Use Your Information

- To connect you with car sellers or buyers
- To process your car buying, selling, or test drive requests
- To send you relevant car recommendations and updates
- To improve our platform, services, and user experience
- To prevent fraud and ensure platform security
- To comply with legal obligations under Indian law

3. Data Security

We implement industry-standard security measures including encryption (SSL/TLS), secure server infrastructure, and access controls to protect your personal information. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.

4. Sharing of Information

We do not sell, trade, or rent your personal information to third parties. We may share your contact details with verified dealers or sellers only when you express interest in a specific vehicle, book a test drive, or submit an enquiry.

5. Third-Party Services

Our platform uses third-party services including Firebase (authentication), Cloudflare (content delivery and image storage), and analytics tools. These services have their own privacy policies governing how they handle your data.

6. Data Retention

We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. You may request deletion of your data at any time by contacting us.

7. Your Rights

- Access: You can request a copy of your personal data we hold
- Correction: You can request correction of inaccurate data
- Deletion: You can request deletion of your personal data
- Opt-out: You can unsubscribe from marketing communications at any time

8. Children's Privacy

Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.

9. Changes to This Policy

We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.

10. Contact Us

If you have any questions about this Privacy Policy, contact us at:
Email: hello@gaadibroker.com
Phone: +91 8108797000
Address: Shop 48, Shreeji Heights, Sector-46/A, Seawoods, Navi Mumbai 400706`;

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
