'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { CheckCircle, Mail, Shield, ArrowRight, Users, Building, Star, Lock } from 'lucide-react';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
}

export default function VerifyEmailSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = searchParams.get('token');
  const role = searchParams.get('role');

  useEffect(() => {
    if (token && role) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.sub;
        
        setUserName(decoded.name || 'User');
        setUserRole(role);
        
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
        
        console.log('VerifyEmailSuccess - Stored token and userId:', token.substring(0, 10) + '...', userId);
        
        setTimeout(() => setIsLoading(false), 800);
      } catch (error) {
        console.error('VerifyEmailSuccess - Failed to decode token:', error);
        router.push('/verify-email-failure');
      }
    } else {
      console.warn('VerifyEmailSuccess - Missing token or role, redirecting to failure');
      router.push('/verify-email-failure');
    }
  }, [token, role, router]);

  const handleContinue = () => {
    if (userRole === 'buyer') {
      const userId = localStorage.getItem('userId');
      if (userId) {
        router.push(`/buyer/acquireprofile?token=${encodeURIComponent(token as string)}&userId=${encodeURIComponent(userId)}`);
      } else {
        router.push('/verify-email-failure');
      }
    } else if (userRole === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (!token || !role) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Email Verification Complete
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-white">{userName}</span>! Your email has been successfully verified.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Logo Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-center">
              <img 
                src="/illustration.png" 
                alt="CIM Amplify Logo" 
                className="h-16 w-auto filter drop-shadow-sm" 
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="px-8 py-8">
            <button
              onClick={handleContinue}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ease-out"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-lg">Continue to Your Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
            </button>
          </div>

          {/* Role-specific Content */}
          {userRole === 'buyer' && (
            <div className="px-8 pb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Next Steps for Buyers:</h2>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      Welcome to CIM Amplify! To get started, please complete your acquisition profile. This will help us match you with relevant deals.
                    </p>
                    <p className="text-gray-600 text-sm">
                      You will be redirected to your profile page shortly, or click the button above.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userRole === 'seller' && (
            <div className="px-8 pb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Next Steps for Sellers:</h2>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      Welcome to CIM Amplify! You can now log in to your dashboard to add and manage your deals.
                    </p>
                    <p className="text-gray-600 text-sm">
                      You will be redirected to your dashboard shortly, or click the button above.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Instructions */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-amber-600" />
                    Important: Ensure you receive our emails!
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Please check your spam/junk folder and mark emails from <strong className="text-gray-900">cimamplify.com</strong> as not junk. To ensure delivery, we strongly suggest adding our domain to your safe senders list.
                  </p>

                  {/* Gmail Instructions */}
                  <div className="mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                        <div className="w-6 h-6 bg-red-100 rounded mr-2 flex items-center justify-center">
                          <Mail className="w-3 h-3 text-red-600" />
                        </div>
                        Instructions for Gmail:
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Log in to your Gmail account.
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Click the gear icon, then select "See all settings".
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Go to the "Filters and Blocked Addresses" tab.
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Click "Create a new filter".
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          In the "From" field, enter <strong className="text-gray-900">@cimamplify.com</strong>.
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Click "Create filter".
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Check the box next to "Never send it to Spam" and click "Create filter" again.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Outlook Instructions */}
                  <div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                        <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                          <Mail className="w-3 h-3 text-blue-600" />
                        </div>
                        Instructions for Outlook:
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Log in to your Outlook account.
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Click the gear icon (Settings) and select "View all Outlook settings".
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Go to "Junk email" and then "Safe senders and domains".
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Click "+ Add" and enter <strong className="text-gray-900">cimamplify.com</strong>.
                        </li>
                        <li className="flex items-start">
                          <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          Press Enter and then click "Save".
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              © 2025 CIM Amplify. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </div>
  );
}
