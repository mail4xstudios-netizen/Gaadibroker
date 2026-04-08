export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mt-1">Last Updated: April 8, 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 space-y-6 text-slate-600 text-sm leading-relaxed">

          <p>GaadiBroker (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website gaadibroker.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">1. Information We Collect</h2>
          <p><strong>Personal Information:</strong> When you use our services, we may collect your name, phone number, email address, city, and car preferences.</p>
          <p><strong>Usage Data:</strong> We automatically collect information about how you interact with our platform, including pages visited, time spent, device type, browser, and IP address.</p>
          <p><strong>Cookies:</strong> We use cookies and similar tracking technologies to improve your experience and analyse traffic.</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>To connect you with car sellers or buyers</li>
            <li>To process your car buying, selling, or test drive requests</li>
            <li>To send you relevant car recommendations and updates</li>
            <li>To improve our platform, services, and user experience</li>
            <li>To prevent fraud and ensure platform security</li>
            <li>To comply with legal obligations under Indian law</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">3. Data Security</h2>
          <p>We implement industry-standard security measures including encryption (SSL/TLS), secure server infrastructure, and access controls to protect your personal information. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">4. Sharing of Information</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your contact details with verified dealers or sellers only when you express interest in a specific vehicle, book a test drive, or submit an enquiry. We may also share data with service providers who assist us in operating the platform (hosting, analytics).</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">5. Third-Party Services</h2>
          <p>Our platform uses third-party services including Firebase (authentication), Cloudflare (content delivery and image storage), and analytics tools. These services have their own privacy policies governing how they handle your data.</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">6. Data Retention</h2>
          <p>We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. You may request deletion of your data at any time by contacting us.</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">7. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Access:</strong> You can request a copy of your personal data we hold</li>
            <li><strong>Correction:</strong> You can request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> You can request deletion of your personal data</li>
            <li><strong>Opt-out:</strong> You can unsubscribe from marketing communications at any time</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">8. Children&apos;s Privacy</h2>
          <p>Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. Your continued use of the platform after changes constitutes acceptance of the updated policy.</p>

          <h2 className="text-lg font-bold text-slate-900 !mt-8">10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or wish to exercise your rights, contact us at:</p>
          <div className="bg-slate-50 rounded-lg p-4 mt-2">
            <p className="font-semibold text-slate-900">GaadiBroker</p>
            <p>Email: hello@gaadibroker.com</p>
            <p>Phone: +91 8108797000</p>
            <p>Address: Shop 48, Shreeji Heights, Sector-46/A, Seawoods, Navi Mumbai 400706</p>
          </div>
        </div>
      </div>
    </div>
  );
}
