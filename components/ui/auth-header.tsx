import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();

  return (
    <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <style jsx>{`
        * {
          scroll-behavior: smooth;
        }
        body {
          background-color: black;
        }

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
          }
          to {
            opacity: 1;
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
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
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
          animation: scaleIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .testimonial-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
          content: "";
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

        .animate-smoothFadeIn {
          animation: smoothFadeIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }

        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      <header className="">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="logo-container cursor-pointer"
              onClick={() => router.push("/landing")}
            >
              <Image
                src="/logo.svg"
                alt="CIM Amplify Logo"
                width={150}
                height={50}
                className="h-auto"
              />
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <a href="/landing#benefits" className="navbar-link text-gray-600">
                Benefits
              </a>
              <a
                href="/landing#how-it-works"
                className="navbar-link text-gray-600"
              >
                How it Works
              </a>
              <a
                href="/landing#guidelines"
                className="navbar-link text-gray-600"
              >
                Guidelines
              </a>
              <a href="/landing#faqs" className="navbar-link text-gray-600">
                FAQs
              </a>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
