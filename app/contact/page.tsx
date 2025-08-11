"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import Header from "@/components/ui/auth-header";
import Footer from "@/components/ui/auth-footer";

export default function SimpleContact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Enhanced validation
    if (!formData.fullName.trim()) {
      setSubmitStatus('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setSubmitStatus('Please enter your email address.');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setSubmitStatus('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.message.trim()) {
      setSubmitStatus('Please enter your message.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create more professional email content
      const emailSubject = `New Contact Form Inquiry from ${formData.fullName}`;
      
      const emailBody = [
        `Hello,`,
        ``,
        `You have received a new contact form submission with the following details:`,
        ``,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `CONTACT DETAILS`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Name: ${formData.fullName}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone || 'Not provided'}`,
        `Company: ${formData.company || 'Not provided'}`,
        ``,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `MESSAGE`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `${formData.message}`,
        ``,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `Please respond to this inquiry at your earliest convenience.`,
        ``,
        `Best regards,`,
        `Contact Form System`
      ].join('\n');

      // Create mailto link with better encoding
      const recipientEmail = 'abdulahadaa88345@gmail.com';
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Check if mailto link is too long (some email clients have limits)
      if (mailtoLink.length > 2000) {
        // Fallback for very long messages
        const shortEmailBody = [
          `New contact form submission from ${formData.fullName}`,
          ``,
          `Contact: ${formData.email}`,
          `Phone: ${formData.phone || 'N/A'}`,
          `Company: ${formData.company || 'N/A'}`,
          ``,
          `Message: ${formData.message.substring(0, 500)}${formData.message.length > 500 ? '...' : ''}`,
          ``,
          `(Message may be truncated due to length limits)`
        ].join('\n');
        
        const shortMailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(shortEmailBody)}`;
        window.open(shortMailtoLink, '_blank');
      } else {
        // Open mailto link in a new window/tab for better user experience
        window.open(mailtoLink, '_blank');
      }
      
      // Show success message
      setSubmitStatus('success');
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        setSubmitStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Mailto error:', error);
      setSubmitStatus('Something went wrong opening your email client. Please try again or contact us directly at abdulahadaa88345@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle direct email contact
  const handleDirectEmail = () => {
    const mailtoLink = 'mailto:abdulahadaa88345@gmail.com?subject=General Inquiry';
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        .contact-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .form-input {
          transition: all 0.2s ease;
          border: 1px solid #d1d5db;
          background-color: #ffffff;
          color: #1f2937;
        }

        .form-input:focus {
          border-color: #3aafa9;
          outline: none;
          box-shadow: 0 0 0 3px rgba(58, 175, 169, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .submit-button {
          background: linear-gradient(135deg, #3aafa9 0%, #2d8f89 100%);
          transition: all 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(58, 175, 169, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success-message {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Reach Out To Us <span className="text-primary">Today</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <div className="contact-card text-center p-4 bg-white rounded-lg shadow-sm border" onClick={handleDirectEmail}>
              <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1 text-sm">Email</h3>
              <p className="text-xs text-gray-600 truncate">Click to email us</p>
            </div>
            
            <div className="contact-card text-center p-4 bg-white rounded-lg shadow-sm border" onClick={() => window.open('tel:+15550000000', '_blank')}>
              <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1 text-sm">Phone</h3>
              <p className="text-xs text-gray-600">+1 (555) 000-0000</p>
            </div>
            
            <div className="contact-card text-center p-4 bg-white rounded-lg shadow-sm border">
              <MessageSquare className="w-6 h-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1 text-sm">Live Chat</h3>
              <p className="text-xs text-gray-600">Available 24/7</p>
            </div>
            
            <div className="contact-card text-center p-4 bg-white rounded-lg shadow-sm border">
              <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1 text-sm">Location</h3>
              <p className="text-xs text-gray-600">San Francisco</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-6 md:p-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex. John Doe"
                    className="form-input w-full px-3 py-2 rounded-md text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    className="form-input w-full px-3 py-2 rounded-md text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 890"
                    className="form-input w-full px-3 py-2 rounded-md text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Ex. Company Co"
                    className="form-input w-full px-3 py-2 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  rows={4}
                  className="form-input w-full px-3 py-2 rounded-md resize-none text-sm"
                  required
                />
              </div>

              {/* Enhanced Status Messages */}
              {submitStatus === 'success' && (
                <div className="success-message p-4 rounded-md text-sm text-white">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    <div>
                      <div className="font-medium">Email client opened successfully!</div>
                      <div className="text-green-100 text-xs mt-1">Please send the pre-filled email from your email application.</div>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus && submitStatus !== 'success' && (
                <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">
                  {submitStatus}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="submit-button w-full py-3 px-6 text-white font-medium rounded-md text-sm flex items-center justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Opening Email Client...' : 'Send Inquiry'}
              </button>

              {/* Alternative contact method */}
              <div className="text-center text-sm text-gray-600">
                Email client not working? Contact us directly at{' '}
                <button 
                  onClick={handleDirectEmail}
                  className="text-primary hover:underline font-medium"
                >
                  abdulahadaa88345@gmail.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}