"use client";

import React, { useState } from "react";
import { GridPatternCard, GridPatternCardBody } from "../about/GridCard";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "b1638040-c697-4b5e-b007-b437e2acd5d5",
        subject: "Watchwing AI Contact Form Submission",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }),
    });

    const result = await response.json();
    if (result.success) {
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  return (
    <main className="min-h-screen mx-auto max-w-4xl text-gray-300 p-8 my-30">
      {/* Heading */}
      <h1 className="lg:text-5xl text-4xl font-bold text-start mb-2">
        Contact Watchwing AI
      </h1>
      <p className="text-gray-400 text-lg mb-8">
        Get in touch with our team for support, feedback, or inquiries.
      </p>

      {/* Contact Form Card */}
      <GridPatternCard>
        <GridPatternCardBody>
          {!submitted ? (
            <>
              <h3 className="text-lg font-bold mb-4 text-white">
                Send us a Message
              </h3>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 text-white"
              >
                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-100 p-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-100 p-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 p-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-gray-300 p-3 rounded-lg bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1a013a] text-white rounded-lg shadow-lg hover:bg-[#1a014b] cursor-pointer font-medium transition-all duration-300 "
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Thank you for contacting us!
              </h3>
              <p className="text-gray-400">We&apos;ll be in touch soon.</p>
            </div>
          )}
        </GridPatternCardBody>
      </GridPatternCard>
    </main>
  );
};

export default Contact;
