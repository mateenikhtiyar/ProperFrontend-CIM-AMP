import { Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to handle quick link navigation
  const handleQuickLink = (hash: string) => {
    if (pathname === "/landing") {
      // If already on landing, scroll smoothly
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // fallback: set hash, browser will jump
        window.location.hash = hash;
      }
    } else {
      // If not on landing, navigate to landing with hash
      router.push(`/landing${hash}`);
    }
  };

  return (
    <footer className="footer-background bg-gray-50 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl justify-items-center">
          {/* Company Info */}
          <div className="footer-section col-span-1 md:col-span-2">
            <div className="mb-3">
              <p className="text-gray-600 leading-relaxed max-w-md">
                CIM Amplify's mission is to help Entrepreneurs and Investors get
                the{" "}
                <span className="text-primary font-semibold">"Brass Ring"</span>{" "}
                of selling their company. Our owner group have all sold
                significant companies which changed our lives forever.
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#benefits"
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuickLink("#benefits");
                  }}
                  className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1"
                >
                  Benefits
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuickLink("#how-it-works");
                  }}
                  className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#guidelines"
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuickLink("#guidelines");
                  }}
                  className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1"
                >
                  Guidelines
                </a>
              </li>
              <li
                onClick={() => {
                  router.push("/about");
                }}
              >
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer">
                Actions
              </h3>
              <div className="space-y-1">
                <div
                  onClick={() => router.push("/buyer/register")}
                  className="text-primary hover:text-primary hover:bg-teal-50 block py-2 rounded-lg teal-600 cursor-pointer  transition-all duration-300"
                >
                  Buyer registration
                </div>
                <div
                  onClick={() => router.push("/seller/register")}
                  className="text-primary hover:text-primary hover:bg-teal-50 block py-2  rounded-lg teal-600 cursor-pointer  transition-all duration-300"
                >
                  Add a Deal
                </div>
                <div
                  onClick={() => router.push("/buyer/login")}
                  className="text-primary hover:text-primary hover:bg-teal-50 block py-2 rounded-lg teal-600 cursor-pointer  transition-all duration-300"
                >
                  Buyer Login
                </div>
                <div
                  onClick={() => router.push("/seller/login")}
                  className="text-primary hover:text-primary hover:bg-teal-50 block py-2  rounded-lg primary cursor-pointer  transition-all duration-300"
                >
                  Seller Login
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Support
              </h3>
              <ul className="space-y-1">
                <li>
                 <a
                     onClick={() => router.push("/contact")}
                      className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1 cursor-pointer"
                    >
                      Contact Us
                    </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
  <div className="footer-divider mt-4 mb-2" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2025 CIM Amplify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}