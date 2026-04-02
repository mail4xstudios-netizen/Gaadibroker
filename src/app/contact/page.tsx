"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          carId: "contact-inquiry",
          carName: `Contact: ${form.message.slice(0, 50)}`,
          source: "contact_page",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Contact Us</h1>
          <p className="text-slate-400 mt-3 text-base md:text-lg">We&apos;d love to hear from you. Get in touch with our team.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-6">Get In Touch</h2>
            <div className="space-y-5">
              {[
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>,
                  label: "Address",
                  value: "Shop 48, Shreeji Heights, Sector-46/A, Seawoods, Navi Mumbai 400706",
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>,
                  label: "Phone",
                  value: "+91 8108797000",
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>,
                  label: "Email",
                  value: "hello@gaadibroker.com",
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
                  label: "Working Hours",
                  value: "Mon - Sat: 9AM - 8PM",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                    <p className="text-slate-600 text-sm mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-slate-100 rounded-xl h-48 flex items-center justify-center border border-slate-200/80">
              <div className="text-center">
                <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                <p className="text-slate-400 text-xs font-medium">Map Integration</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Send us a Message</h3>
              <p className="text-sm text-slate-500 mb-6">Fill out the form and we&apos;ll get back to you within 24 hours.</p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Message Sent!</h4>
                  <p className="text-slate-500 mt-2 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-orange-600 font-semibold text-sm mt-4 hover:underline">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Your Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-premium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-premium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 8108797000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-premium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Your Message</label>
                    <textarea
                      placeholder="How can we help you?"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-premium resize-none"
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  <button type="submit" className="w-full btn-primary !py-3.5">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
