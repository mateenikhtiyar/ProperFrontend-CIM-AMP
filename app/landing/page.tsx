
"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Building, Target, Briefcase, FileText, Handshake, Shield, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

import { useRouter } from 'next/navigation';

import { Linkedin } from "lucide-react"


export default function Component() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()

  const buyerBenefits = [
    "High-quality Vetted Targeted opportunity flow",
    "Leverage our network of M&A Advisors who target opportunities",
    "10% - 15% lower pricing than 'fly-in' and we reward all introductions",
    "We only send you deals that match your exact criteria",
    "Receive M&A Advisor Fees (Subject to deal closing and a referral agreement)",
    "Receive M&A",
    "Our management platform - see all your deals in one place",
  ]

  const advisorBenefits = [
    "Pre-deal buyers in need of strategic, qualified buyers",
    "Receive introductions to buyers looking for your exact deal type",
    "Buyers are pre-qualified and vetted and are engaged in our platform",
    "We track leads - the 'Advisor to Buyer' flow ensures your buyers are engaged",
    "Receive M&A Advisor Fees (Subject to deal closing and a referral agreement)",
    "Receive M&A",
    "Our management platform to see buyer candidates and track progress",
  ]

  const stats = [
    { value: "$300M", label: "Monthly Deal Volume" },
    { value: "$2M - $250M", label: "Typical Revenue Range" },
    { value: "85+", label: "Industry Sectors" },
    { value: "100%", label: "Represented Deals" },
  ]

  const platformGuidelines = [
    {
      icon: "💼",
      title: "M&A Deals must have a minimum of $1 Million in EBITDA or, failing that, $5 Million in revenue"
    },
    {
      icon: "📋",
      title: "Deals must be posted by an M&A Advisor."
    },
    {
      icon: "🤝",
      title: "A Confidential Information Memorandum, or similar data, must be available"
    },
    {
      icon: "✅",
      title: "Only M&A deals may be posted. No other deal type will be accepted"
    }
  ]

 const testimonials = [
  {
    name: "Stephen Brekke",
    role: "Legacy Integration Producer",
    rating: 5,
    text: "If you want real marketing that works and effective implementation – mobile app's got you covered.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces"
  },
  {
    name: "Ava Chen",
    role: "Product Manager",
    rating: 4,
    text: "The app completely transformed our workflows and improved our productivity.",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=faces"
  },
  {
    name: "Liam Patel",
    role: "UX Designer",
    rating: 5,
    text: "The user interface is sleek and intuitive. It exceeded all our expectations!",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces"
  },
  {
    name: "Isabella Rossi",
    role: "CTO at Novatech",
    rating: 5,
    text: "Exceptional performance and seamless integration. A must-have for modern teams.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces"
  },
 
  {
    name: "Sofia Nguyen",
    role: "Marketing Strategist",
    rating: 4,
    text: "An essential part of our workflow now. Beautiful, fast, and reliable.",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=faces"
  }
];



  const faqs = [
    {
      id: 0,
      question: "Explain the 0.5% Buyer Fee?",
      answer: "Over the past decade a lot of frustration has been built up over an age-old practice of referral fees. Ambiguity and unreasonable fees for represented deals have put a wrench into what should be a wonderful process - getting a deal done. High fees are often added to deal modeling and can change or eliminate offers which is against our mission. Dozens of interviews with all types of buyers resulted in an agreement that 0.5% is a more than fair fee that will not change deal structure at all.",
      
    },
   {
    id: 1,
    question: "What does \"Exclusive Deals\" mean?",
    answer: (
      <div className="space-y-6">
        <p>When an Advisor adds a deal to CIM Amplify they choose one of 3 reward levels:</p>
        
        {/* Image container */}
        <div className="flex justify-center my-6">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl">
            <Image 
              src="/cim1.png" 
              alt="CIM Amplify Deal Tiers - Seed, Bloom, and Fruit levels with different rewards" 
              width={800} 
              height={300} 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
        
        <p className="text-gray-700 leading-relaxed">
          Buyers can choose to never see deals from the Seed level which will save them from seeing a deal multiple times in multiple places.
        </p>
      </div>
    )
  },
    {
      id: 2,
      question: "What is the Universal NDA?",
      answer: "NDAs are a (very) last resort hammer for extremely bad behavior. In interviews with dozens of seasoned Advisors, not one has ever gone to court over an NDA. Our Universal NDA is strong enough for any action and it eliminates one of the biggest speedbumps in the deal process. Getting straight to the CIM saves so much valuable time for both sides."
    },
    {
      id: 3,
      question: "No Tire Kickers - Really?",
      answer: (
        <div className="space-y-4">
          <p>Over the past few years, mergers and acquisitions professionals have witnessed an unprecedented influx of search funds and entrepreneurship-through-acquisition (ETA) buyers entering the market. These are often first-time acquirers – MBA graduates, young professionals, or even social media-inspired entrepreneurs – seeking to buy and run a business. Many of these newcomers are underqualified "tire kickers" who struggle to close deals, especially those chasing the popularized idea of buying a business with "no money down." Deals get bogged down because of the need to qualify and quantify.</p>
          <p>We hear you and do not want to add to the problem. Our solutions include:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Larger deals of at least $500k EBITDA or, failing that, $5 Million in revenue</li>
            <li>"Ability to close" filters for every deal</li>
            <li>"Report buyer" button that allow Advisors to make us aware of potentially fake buyers</li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      question: "Aren't you just another Deal Platform?",
      answer: "The original CIM Amplify platform, launched in October 2024, quickly gained amazing traction with over $3 Billion in deals (none scraped), all with more than $1 Million in EBITDA. The original platform was a general posting site. We learned quickly that buyers don't have time to scroll deals and hate that a deal on our site may be on other sites. We also learned that most top Advisors have client requirements where they need to get buyers approved before approaching them - and open listings have the Tire-Kicker problem. We solved those issues and many more with this version launched in June 2025. TL:DR - No"
    },
    {
      id: 5,
      question: "What types of deals come through CIM Amplify?",
      answer: "Our average deal top line revenue per company is about $22 Million right now. Even though we have a fairly low minimum we strive to have deals of all sizes on the platform as we have buyers looking for deals from $5 Million in revenue to over $1 Billion. We are industry and geography agnostic."
    },
    {
      id: 6,
      question: "I added a deal but CIM Amplify did not find any matching buyers?",
      answer: "Sorry! We are registering new buyers every day but the nature of the platform is that buyers choose what they want to see based on their investment criteria. As long as you leave the deal \"On Market\" we will notify you if a buyer registers that fits the deal and you can decide to send it to them, or not. And you get to keep the gift card - no matter what."
    },
    {
      id: 7,
      question: "I registered as a buyer but have never received a deal.",
      answer: "Sorry! Our promise to you is to not fill your inbox with irrelevant deals. When you do receive an email from us - open it because it is a match. Or… check your spam filter."
    },
    {
      id: 8,
      question: "Do you publish my information?",
      answer: "No! Many of the places you give your information to use that data for SEO purposes and essentially post your profiles and deals to the wide internet. We happily sacrifice Google Ranking for your security."
    },
    {
      id: 9,
      question: "How do you handle Buy Side Mandates?",
      answer: "Fill out a buyer profile and deals that match your mandate will be sent to you."
    }
  ]

  // Enhanced Intersection Observer for smoother animations
// Replace the existing useEffect for Intersection Observer with this enhanced version:

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }))
        } else {
          // Re-trigger animation when scrolling back up
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: false
          }))
        }
      })
    },
    { 
      threshold: 0.1, 
      rootMargin: '50px',
    }
  )

  const elements = document.querySelectorAll('[data-animate]')
  elements.forEach(el => observer.observe(el))

  // Add smooth scrolling to the entire page
  document.documentElement.style.scrollBehavior = 'smooth'

  const initialTimer = setTimeout(() => {
    setIsInitialLoad(false)
  }, 100)

  return () => {
    observer.disconnect()
    clearTimeout(initialTimer)
  }
}, [])

  // Set first FAQ as expanded by default
  
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
   <style jsx>{`
  * {
    scroll-behavior: smooth;
  }
    body{
    background-color: #ffffff}
  
  html {
    scroll-behavior: smooth;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .animate-slideInLeft {
    animation: slideInLeft 0.8s ease-out forwards;
  }
  
  .animate-slideInRight {
    animation: slideInRight 0.8s ease-out forwards;
  }
  
  .animate-slideInFromBottom {
    animation: slideInFromBottom 0.8s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.7s ease-out forwards;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-delay-50 {
    animation-delay: 0.1s;
  }
  
  .animate-delay-100 {
    animation-delay: 0.2s;
  }
  
  .animate-delay-200 {
    animation-delay: 0.3s;
  }
  
  .animate-delay-300 {
    animation-delay: 0.4s;
  }
  
  .animate-delay-400 {
    animation-delay: 0.5s;
  }
  
  .animate-delay-500 {
    animation-delay: 0.6s;
  }
  
  .animate-delay-600 {
    animation-delay: 0.7s;
  }
  
  .animate-delay-700 {
    animation-delay: 0.8s;
  }
  
  [data-animate] {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  [data-animate].animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .gpu-accelerated {
    will-change: transform;
    transform: translateZ(0);
  }
  
  .stat-number {
    background: linear-gradient(135deg, #14b8a6, #0d9488);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: float 3s ease-in-out infinite;
  }
  
  .testimonial-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .testimonial-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #14b8a6;
  }
  
  .guideline-card {
    background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
    border: 1px solid #e6fffa;
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .guideline-card:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 25px 50px -12px rgba(20, 184, 166, 0.25);
    border-color: #14b8a6;
  }
  
  .icon-container {
    background: linear-gradient(135deg, #14b8a6, #0d9488);
    transition: all 0.3s ease;
  }
  
  .guideline-card:hover .icon-container {
    transform: rotate(360deg) scale(1.1);
    box-shadow: 0 10px 20px rgba(20, 184, 166, 0.3);
  }
  
  .icon-emoji {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  
  .faq-item {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .faq-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #14b8a6;
  }
  
  .faq-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .faq-content.expanded {
    max-height: 500px;
  }
  
  .nav-arrow {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 2px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .nav-arrow:hover {
    background: linear-gradient(135deg, #14b8a6, #0d9488);
    border-color: #14b8a6;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(20, 184, 166, 0.3);
  }
  
  .nav-arrow:hover .arrow-icon {
    color: white;
    transform: scale(1.2);
  }
  
  .arrow-icon {
    transition: all 0.3s ease;
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
    content: '';
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
  
  /* Enhanced navbar styles */
  .navbar-link {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 500;
  }
  
  .navbar-link:hover {
    color: #14b8a6;
    background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
    transform: translateY(-2px);
  }
  
  .navbar-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #14b8a6, #0d9488);
    transition: width 0.3s ease;
  }
  
  .navbar-link:hover::after {
    width: 100%;
  }
  
  .logo-container {
    transition: all 0.3s ease;
  }
  
  .logo-container:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 4px 8px rgba(20, 184, 166, 0.2));
  }
  
  /* Smooth scroll for the entire page */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #14b8a6, #0d9488);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #0d9488, #0f766e);
  }
`}</style>

      {/* Header */}
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="logo-container">
        <Image 
          src="/logo.svg" 
          alt="CIM Amplify Logo" 
          width={150} 
          height={50} 
          className="h-auto" 
        />
      </div>
      <nav className="hidden md:flex items-center gap-2">
        <a href="#benefits" className="navbar-link text-gray-600">
          Benefits
        </a>
        <a href="#how-it-works" className="navbar-link text-gray-600">
          How it Works
        </a>
        <a href="#marketplace" className="navbar-link text-gray-600">
          Guidelines
        </a>
        <a href="#faqs" className="navbar-link text-gray-600">
          FAQs
        </a>
        <Button 
          className="bg-gradient-to-r from-teal-500 to-primary hover:from-primary hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ml-4" 
          onClick={() => router.push("/select-role")}
        >
          Get Started
        </Button>
      </nav>
    </div>
  </div>
</header>

      {/* Hero Section */}
     <section className="py-16 bg-gray-50">
  <div className="container mx-auto px-6 text-center">
    <h1 
      data-animate
      id="hero-title"
      className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 ${
        isVisible['hero-title'] ? 'animate-fadeInUp animate-in' : ''
      }`}
    >
      Exclusive M&A Advisor deal flow meets intelligent buyer targeting
    </h1>
    <p 
      data-animate
      id="hero-subtitle"
      className={`text-xl text-gray-600 mb-8 max-w-4xl mx-auto ${
        isVisible['hero-subtitle'] ? 'animate-fadeInUp animate-delay-200 animate-in' : ''
      }`}
    >
      CIM Amplify elevates the dealmaking experience by offering buyers exclusive access to vetted opportunities and giving M&A advisors a strategic platform to engage qualified buyers
    </p>
  </div>
</section>


      {/* Benefits Section */}
   <section id="benefits" className="py-16">
  <div className="container mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-12">

      {/* Buyer Benefits */}
      <div 
        data-animate
        id="buyer-benefits"
        className={`${isVisible['buyer-benefits'] ? 'animate-slideInLeft animate-in' : ''}`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Buyer Benefits</h2>
        <p className="text-gray-600 mb-6">
          Forget sifting through irrelevant opportunities — we send you what fits.
        </p>
        <ul className="space-y-4">
          {[
            "Exclusive deals — we reward Advisors who post exclusively with us",
            "0.5% (50 basis points) fee. By far the lowest in the industry",
            "We only send you deals that match your criteria",
            "Straight to CIM – The most hated step is eliminated with a Master NDA",
            "We get out of the way – no requirement to communicate through the platform",
            "Deal management platform – see all your deals in one place"
          ].map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => { router.push("/buyer/register") }}
          className="mt-6 bg-teal-500 hover:bg-primary transition-colors"
        >
          Create a Free Buyer Profile
        </Button>
      </div>

      {/* Advisor Benefits */}
      <div 
        data-animate
        id="advisor-benefits"
        className={`${isVisible['advisor-benefits'] ? 'animate-slideInRight animate-in' : ''}`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Advisor Benefits</h2>
        <p className="text-gray-600 mb-6">
          Put your deals in front of serious, qualified buyers
        </p>
        <ul className="space-y-4">
          {[
            "Seller Rewards – You are our oxygen and we appreciate you. Every deal is worth at least an Amazon gift card. Much more if your buyer comes from CIM Amplify and you use us exclusively",
            "No tire kickers! Set \"Ability to Close\" filters for every deal",
            "Straight to CIM – The most hated step is eliminated with a Master NDA",
            "We get out of the way – no requirement to communicate through the platform",
            "Deal management platform to see buyer matches and activity in one place"
          ].map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => router.push("/seller/register")}
          className="mt-6 bg-teal-500 hover:bg-primary transition-colors"
        >
          Add A Deal
        </Button>
      </div>

    </div>
  </div>
</section>


      {/* Marketplace Stats */}
      <section id="marketplace" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 
            data-animate
            id="marketplace-title"
            className={`text-3xl font-bold text-gray-900 mb-12 ${
              isVisible['marketplace-title'] ? 'animate-fadeInUp animate-in' : ''
            }`}
          >
            CIM Amplify at a Glance
          </h2>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {stats.map((stat, index) => (
    <div 
      key={index} 
      data-animate
      id={`stat-${index}`}
      className={`text-center gpu-accelerated ${
        isVisible[`stat-${index}`] ? `animate-scaleIn animate-delay-${index * 100} animate-in` : ''
      }`}
    >
      <div className="stat-number text-3xl md:text-4xl font-bold mb-2 animate-pulse">
        {stat.value}
      </div>
      <div className="text-gray-600 font-medium">{stat.label}</div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* How It Works */}
  {/* How It Works */}
      {/* How It Works */}
    {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 
            data-animate
            id="how-it-works-title"
            className={`text-3xl font-bold text-center text-gray-900 mb-16 ${
              isVisible['how-it-works-title'] ? 'animate-fadeInUp animate-in' : ''
            }`}
          >
            How It Works
          </h2>

          <div className="space-y-20">
            {/* Step 1 */}
            <div className="relative">
              <div 
                data-animate
                id="step-1-text"
                className={`mb-12 ${isVisible['step-1-text'] ? 'animate-slideInLeft animate-in' : ''}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-primary text-white font-bold text-lg mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Add A Deal</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  M&A Advisors choose a reward level based on exclusivity with CIM Amplify and add deal metrics.
                </p>
                <Button className="bg-teal-500 hover:bg-primary transition-colors" onClick={() => router.push("/seller/login")}>Add a Deal</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div 
                  data-animate
                  id="step-1-image"
                  className={`rounded-lg p-8 flex items-center justify-center h-64 ${
                    isVisible['step-1-image'] ? 'animate-slideInLeft animate-delay-200 animate-in' : ''
                  }`}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <Image src="/whisk1.png" alt="CIM Amplify Add Deal" width={350} height={250} className="h-auto relative z-10 transform group-hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
                <div 
                  data-animate
                  id="step-1-image-2"
                  className={`rounded-lg p-8 flex items-center justify-center h-94 ${
                    isVisible['step-1-image-2'] ? 'animate-slideInRight animate-delay-300 animate-in' : ''
                  }`}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <Image src="/cim1.png" alt="CIM Amplify Deal Tiers" width={550} height={450} className="h-auto relative z-10 transform group-hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Flow Line 1 */}
             <div className="flex items-center justify-center py-8">
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent"></div>
        <div className="mx-6">
          <Image 
            src="/line.png" 
            alt="Process Flow" 
            width={150} 
            height={150} 
            className="opacity-80 filter drop-shadow-sm"
          />
        </div>
        <div className="w-32 h-0.5 bg-gradient-to-l from-transparent"></div>
      </div>

            {/* Step 2 */}
            <div className="relative">
              <div 
                data-animate
                id="step-2-text"
                className={`mb-12 ${isVisible['step-2-text'] ? 'animate-slideInRight animate-in' : ''}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-primary text-white font-bold text-lg mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Buyer Matching</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  CIM Amplify provides a list of buyers. Advisors select which buyers to engage.
                </p>
                <Button className="bg-teal-500 hover:bg-primary transition-colors" onClick={() => router.push("/buyer/register")}>View Marketplace</Button>
              </div>
                
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div 
                  data-animate
                  id="step-2-image"
                  className={`rounded-lg p-8 flex items-center justify-center h-94 ${
                    isVisible['step-2-image'] ? 'animate-slideInLeft animate-delay-200 animate-in' : ''
                  }`}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <Image src="/cimcim.png" alt="CIM Amplify Buyer Matching" width={550} height={450} className="h-auto relative z-10 transform group-hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
                <div 
                  data-animate
                  id="step-2-image-2"
                  className={`rounded-lg p-8 flex items-center justify-center h-64 ${
                    isVisible['step-2-image-2'] ? 'animate-slideInRight animate-delay-300 animate-in' : ''
                  }`}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <Image src="/whisk2.png" alt="CIM Amplify Matching Process" width={350} height={250} className="h-auto relative z-10 transform group-hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Flow Line 2 */}
            <div className="flex items-center justify-center py-8">
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent 0"></div>
        <div className="mx-6">
          <Image 
            src="/line.png" 
            alt="Process Flow" 
            width={150} 
            height={150} 
            className="opacity-80 filter drop-shadow-sm"
          />
        </div>
        <div className="w-32 h-0.5 bg-gradient-to-l from-transparent"></div>
      </div>

            {/* Step 3 */}
            <div className="relative">
              <div 
                data-animate
                id="step-3-text"
                className={`mb-12 ${isVisible['step-3-text'] ? 'animate-slideInLeft animate-in' : ''}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-primary text-white font-bold text-lg mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Deal Management</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Buyers and Advisors monitor deals via an intuitive platform.
                </p>
                <div className="flex gap-4 text-center justify-center">
                  <Button className="bg-teal-500 hover:bg-primary transition-colors" onClick={() => router.push("/seller/login")}>Add Listing</Button>
                  <Button variant="outline" className="bg-teal-500 hover:bg-primary transition-colors text-white" onClick={() => router.push("/buyer/register")}>Deal Management</Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div 
                  data-animate
                  id="step-3-image"
                  className={`rounded-lg p-8 flex items-center justify-center h-64 ${
                    isVisible['step-3-image'] ? 'animate-slideInLeft animate-delay-200 animate-in' : ''
                  }`}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <Image src="/whisk3.png" alt="CIM Amplify Deal Management" width={350} height={250} className="h-auto relative z-10 transform group-hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
                <div 
                  data-animate
                  id="step-3-image-2"
                  className={`rounded-lg p-8 flex items-center justify-center h-64 ${
                    isVisible['step-3-image-2'] ? 'animate-slideInRight animate-delay-300 animate-in' : ''
                  }`}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <Image src="/cim2.png" alt="CIM Amplify Management Dashboard" width={550} height={450} className="h-auto relative z-10 transform group-hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Guidelines */}
      <section className="py-16 bg-white" id="guidelines">
        <div className="container mx-auto px-6">
          <h2 
            data-animate
            id="guidelines-title"
            className={`text-3xl font-bold text-center text-gray-900 mb-16 ${
              isVisible['guidelines-title'] ? 'animate-fadeInUp animate-in' : ''
            }`}
          >
            CIM Amplify Guidelines
          </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {platformGuidelines.map((guideline, index) => (
    <div 
      key={index}
      data-animate
      id={`guideline-${index}`}
      className={`guideline-card gpu-accelerated p-8 text-center ${
        isVisible[`guideline-${index}`] ? `animate-slideInFromBottom animate-delay-${index * 100} animate-in` : ''
      }`}
    >
      <div className="flex justify-center mb-6">
        <div className="icon-container w-20 h-20 rounded-full flex items-center justify-center">
          <span className="icon-emoji text-3xl">{guideline.icon}</span>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed font-medium">
        {guideline.title}
      </p>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* What Our Members Are Saying */}
       <section className="py-16 bg-white">
  <div className="container mx-auto px-6">
    <h2 
      data-animate
      id="testimonials-title"
      className={`text-3xl font-bold text-center text-gray-900 mb-16 ${
        isVisible['testimonials-title'] ? 'animate-fadeInUp animate-in' : ''
      }`}
    >
      What Our Members Are Saying
    </h2>
    
    <div className="relative max-w-6xl mx-auto">
      {/* Navigation Arrows */}
      <button 
        onClick={prevTestimonial}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-teal-500 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" />
      </button>
      
      <button 
        onClick={nextTestimonial}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-teal-500 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <ChevronRight className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" />
      </button>
      
      {/* Testimonials Grid - Show 3 at a time */}
      <div className="px-16 overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentTestimonial * 33.333}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="w-1/3 flex-shrink-0 px-4"
            >
              <div 
                data-animate
                id={`testimonial-${index}`}
                className={`testimonial-card gpu-accelerated p-6 h-full ${
                  isVisible[`testimonial-${index}`] ? 'animate-scaleIn animate-in' : ''
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-teal-100">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span 
                          key={i} 
                          className="text-teal-500 text-sm animate-pulse" 
                          style={{animationDelay: `${i * 0.1}s`}}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  {testimonial.text}
                </p>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: testimonials.length - 2 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentTestimonial === index 
                ? 'bg-teal-500 w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

      {/* FAQ Section */}
      <section id="faqs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 
            data-animate
            id="faq-title"
            className={`text-3xl font-bold text-center text-gray-900 mb-16 ${
              isVisible['faq-title'] ? 'animate-fadeInUp animate-in' : ''
            }`}
          >
            Frequently Asked Questions
          </h2>
        <div className="max-w-4xl mx-auto space-y-4">
  {faqs.map((faq, index) => (
    <div 
      key={faq.id}
      data-animate
      id={`faq-${index}`}
      className={`faq-item gpu-accelerated ${
        isVisible[`faq-${index}`] ? `animate-slideInFromBottom animate-delay-${index * 50} animate-in` : ''
      }`}
    >
      <button
        onClick={() => toggleFAQ(faq.id)}
        className="w-full py-6 px-6 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-teal-50 hover:to-transparent transition-all duration-300 rounded-lg focus-visible:focus"
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-8">
          {faq.question}
        </h3>
        <div className="flex-shrink-0 p-1 rounded-full bg-teal-50 transition-all duration-300">
          {expandedFAQ === faq.id ? (
            <Minus className="w-5 h-5 text-primary" />
          ) : (
            <Plus className="w-5 h-5 text-teal-500" />
          )}
        </div>
      </button>
      <div 
        className={`faq-content ${
          expandedFAQ === faq.id ? 'expanded' : ''
        }`}
      >
        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  ))}
</div>


        </div>
      </section>
      {/* Footer CTA */}
 {/* Footer CTA */}
 {/* Footer CTA */}
      <footer className="footer-background bg-gray-50 py-16 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="footer-section col-span-1 md:col-span-2">
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed max-w-md">
                  CIM Amplify's mission is to help Entrepreneurs and Investors get the{' '}
                  <span className="text-primary font-semibold">"Brass Ring"</span> of selling their company. 
                  Our owner group have all sold significant companies which changed our lives forever.
                </p>
              </div>
              <div>
                <a 
                  href="https://www.linkedin.com/company/cimamplify/" 
                  className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-gray-600 border border-gray-200 hover:bg-teal-50 hover:text-primary hover:border-teal-300 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#benefits" className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1">
                    Benefits
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#guidelines" className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1">
                    Guidelines
                  </a>
                </li>
                <li onClick={()=>{router.push("/about")}}>
                  <a className="text-gray-600 hover:text-primary cursor-pointer transition-colors duration-300 block py-1">
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Actions & Support */}
            <div className="space-y-8">
              {/* Actions */}
              <div className="footer-section">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 cursor-pointer">Actions</h3>
                <div className="space-y-2">
                  <div 
                    onClick={() => router.push("/buyer/register")}
                    className="text-primary hover:text-primary hover:bg-teal-50 block py-2 px-3 rounded-lg teal-600 cursor-pointer  transition-all duration-300"
                  >
                    Buyer registration
                  </div>
                  <div 
                    onClick={() => router.push("/seller/login")}
                    className="text-primary hover:text-primary hover:bg-teal-50 block py-2 px-3 rounded-lg teal-600 cursor-pointer  transition-all duration-300"
                  >
                    Add a Deal
                  </div>
                     <div 
                    onClick={() => router.push("/buyer/login")}
                    className="text-primary hover:text-primary hover:bg-teal-50 block py-2 px-3 rounded-lg teal-600 cursor-pointer  transition-all duration-300"
                  >
                    Buyer Login
                  </div>
                     <div 
                    onClick={() => router.push("/seller/login")}
                    className="text-primary hover:text-primary hover:bg-teal-50 block py-2 px-3 rounded-lg primary cursor-pointer  transition-all duration-300"
                  >
                    Seller Login
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="footer-section">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Support</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="#contact" className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 CIM Amplify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}