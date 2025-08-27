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
    <footer className="footer-background py-8" style={{ backgroundColor: '#17252A' }}>
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl justify-items-center">
          {/* Company Info */}
          <div className="footer-section col-span-1 md:col-span-2">
            <div className="mb-3">
              <p className="text-gray-300 leading-relaxed max-w-md">
                CIM Amplify's mission is to help Entrepreneurs and Investors get
                the{" "}
                <span className="font-semibold" style={{ color: '#3AAFA9' }}>
                  "Brass Ring"
                </span>{" "}
                of selling their company. Our owner group have all sold
                significant companies which changed our lives forever.
              </p>
            </div>
            <div>
             
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#3AAFA9' }}>
              QUICK LINKS
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://cimamplify.com/#Benefits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#229273] transition-colors duration-300 block py-1"
                >
                  Benefits
                </a>
              </li>
              <li>
                <a
                  href="https://cimamplify.com/#How%20it%20Works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#229273] transition-colors duration-300 block py-1"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="https://cimamplify.com/#Guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#229273] transition-colors duration-300 block py-1"
                >
                  Guidelines
                </a>
              </li>
              <li>
                <a
                  href="https://cimamplify.com/#FAQs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#229273] transition-colors duration-300 block py-1"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="https://cimamplify.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#229273] cursor-pointer transition-colors duration-300 block py-1"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://cimamplify.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#229273] cursor-pointer transition-colors duration-300 block py-1"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#3AAFA9' }}>
              ACTIONS
            </h3>
            <div className="space-y-1">
              <div
                onClick={() => router.push("/buyer/register")}
                className="text-gray-300 hover:text-[#229273] block py-1 cursor-pointer transition-colors duration-300"
              >
                Buyer registration
              </div>
              <a
                href="https://cimamplify.com/Advisor%20Registration"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#229273] block py-1 cursor-pointer transition-colors duration-300"
              >
                Add a Deal
              </a>
              <div
                onClick={() => router.push("/buyer/login")}
                className="text-gray-300 hover:text-[#229273] block py-1 cursor-pointer transition-colors duration-300"
              >
                Buyer Login
              </div>
              <a
                href="https://cimamplify.com/Advisor%20Registration"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#229273] block py-1 cursor-pointer transition-colors duration-300"
              >
                Seller Login
              </a>
            </div>
            <div className="mt-6">
              <a
                href="https://www.linkedin.com/company/cimamplify/"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full text-gray-300 border-2 border-gray-300 hover:border-[#229273] hover:text-[#229273] transition-all duration-300"
                style={{ backgroundColor: 'transparent' }}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2025 CIM Amplify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}