"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, Globe, MessageSquare, Clock, Star, CheckCircle, Calendar, Users, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import Image from "next/image";
import Header from "@/components/ui/auth-header";
import Footer from "@/components/ui/auth-footer";

export default function WorldClassContact() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get a response within 24 hours",
      value: "deals@amp-ven.com",
      action: "mailto:deals@amp-ven.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm PST",
      value: "+1 (555) 000-0000",
      action: "tel:+15550000000"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team instantly",
      value: "Start conversation",
      action: "#"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Meet us in person",
      value: "San Francisco, CA",
      action: "https://maps.google.com"
    }
  ];

  const features = [
    { icon: Clock, text: "24-hour response time", color: "text-teal-600" },
    { icon: Globe, text: "Global support coverage", color: "text-blue-600" },
    { icon: Star, text: "Premium customer experience", color: "text-yellow-600" },
    { icon: CheckCircle, text: "Dedicated account manager", color: "text-green-600" }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "VP of Client Relations",
      image: "/api/placeholder/200/200",
      contact: "sarah@cim-amplify.com"
    },
    {
      name: "Michael Chen",
      role: "Senior Deal Advisor",
      image: "/api/placeholder/200/200", 
      contact: "michael@cim-amplify.com"
    },
    {
      name: "Emily Rodriguez",
      role: "Client Success Manager",
      image: "/api/placeholder/200/200",
      contact: "emily@cim-amplify.com"
    }
  ];

  const stats = [
    { number: "500+", label: "Successful Deals", icon: Award },
    { number: "24/7", label: "Support Available", icon: Clock },
    { number: "98%", label: "Client Satisfaction", icon: Star },
    { number: "50+", label: "Countries Served", icon: Globe }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM PST" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM PST" },
    { day: "Sunday", hours: "Closed" },
    { day: "Holidays", hours: "Emergency support only" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
            <style jsx>{`
              /* Simplified navbar styles - removed animations */
              .navbar-link {
                padding: 10px 16px;
                border-radius: 8px;
                font-weight: 500;
                color: #4b5563;
                transition: color 0.3s ease;
              }
      
              .navbar-link:hover {
                color: #14b8a6;
              }
      
              .logo-container {
                /* Removed hover animations */
              }
      
              /* Smooth scroll for the entire page */
              html {
                scroll-behavior: smooth;
              }
      
              /* Enhanced animations */
              .section-reveal {
                opacity: 0;
                transform: translateY(50px);
                transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
              }
      
              .section-reveal.visible {
                opacity: 1;
                transform: translateY(0);
              }
      
              .image-scale {
                transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
              }
      
              .image-scale:hover {
                transform: scale(1.03);
              }
      
              .card-reveal {
                opacity: 0;
                transform: translateY(30px);
                transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
              }
      
              .card-reveal.visible {
                opacity: 1;
                transform: translateY(0);
              }
      
              /* Enhanced button styles */
              .hero-button {
                position: relative;
                overflow: hidden;
                background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
                border: none;
                border-radius: 12px;
                padding: 16px 32px;
                font-size: 18px;
                font-weight: 600;
                color: white;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              }
      
              .hero-button::before {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.2),
                  transparent
                );
                transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              }
      
              .hero-button:hover::before {
                left: 100%;
              }
      
              .hero-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 30px rgba(20, 184, 166, 0.4);
              }
      
              .hero-button:active {
                transform: translateY(0);
              }
              .footer-background {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              }
      
              .footer-section {
                transition: all 0.3s ease;
              }
      
              .footer-link {
                position: relative;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                padding: 8px 0;
                border-radius: 6px;
              }
      
              .footer-link:hover {
                color: #14b8a6;
                transform: translateX(5px);
                padding-left: 10px;
              }
      
              .footer-link::before {
                content: "";
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #14b8a6, #0d9488);
                transition: width 0.3s ease;
              }
      
              .footer-link:hover::before {
                width: 20px;
              }
      
              .footer-divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                margin: 3rem 0 2rem 0;
              }
      
              .linkedin-icon {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }
      
              .linkedin-icon:hover {
                transform: translateY(-3px) scale(1.1);
                background: linear-gradient(135deg, #0077b5, #005885);
                color: white;
                box-shadow: 0 10px 20px rgba(0, 119, 181, 0.3);
              }
      
              .focus-visible\\:focus:focus-visible {
                outline: 2px solid #14b8a6;
                outline-offset: 2px;
              }
            `}</style>
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        .contact-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .contact-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .team-card {
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }

        .team-card:hover .team-image {
          transform: scale(1.1);
        }

        .team-image {
          transition: transform 0.3s ease;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -10px rgba(20, 184, 166, 0.2);
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }

        .floating-element:nth-child(2) {
          animation-delay: 2s;
        }

        .floating-element:nth-child(3) {
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Dynamic background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(20, 184, 166, 0.15) 0%, transparent 50%)`
        }}
      />

      {/* Header */}
         <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50" />
        
        {/* Floating background elements */}
        <div className="absolute inset-0">
          <div className="floating-element absolute top-20 left-20 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl" />
          <div className="floating-element absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl" />
          <div className="floating-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight">
              Let's Connect &
              <span className="block text-teal-600">Create Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Your success is our priority. Choose how you'd like to connect with our expert team 
              and let's start building something extraordinary together.
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card rounded-2xl p-6 text-center border border-white/50">
                  <stat.icon className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to connect. We're here to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                className="contact-card block p-8 bg-white rounded-3xl border border-gray-200/50 hover:border-teal-300 shadow-lg group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{method.description}</p>
                  <p className="text-teal-600 font-semibold text-lg">{method.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Office Hours & Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            
            {/* Office Hours */}
            <div>
              <div className="flex items-center mb-8">
                <Clock className="w-8 h-8 text-teal-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Office Hours</h2>
              </div>
              
              <div className="space-y-4">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-900">{schedule.day}</span>
                    <span className="text-teal-600 font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-teal-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Emergency Support</h3>
                </div>
                <p className="text-sm text-gray-700">
                  For urgent matters outside business hours, please email us at{" "}
                  <a href="mailto:emergency@cim-amplify.com" className="text-teal-600 font-medium hover:underline">
                    emergency@cim-amplify.com
                  </a>
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <div className="flex items-center mb-8">
                <Users className="w-8 h-8 text-teal-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
              </div>
              
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="team-card bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden">
                        <div className="team-image w-full h-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                        <a 
                          href={`mailto:${member.contact}`}
                          className="text-teal-600 text-sm font-medium hover:underline"
                        >
                          {member.contact}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
    

      {/* Footer */}
  <Footer />
    </div>
  );
}