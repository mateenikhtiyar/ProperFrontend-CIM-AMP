"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  Users,
  Building2,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Clock,
  LogOut,
  Plus,
  UserPlus,
  Shield,
  Database,
  Activity,
  X
} from "lucide-react";

// Buyer's Activity Popup Component
const BuyersActivityPopup = ({ isOpen, onClose, buyersActivity, dealTitle }) => {
  if (!isOpen) return null;

  // Combine all buyers into one array with status
  const allBuyers = [
    ...(buyersActivity.active || []).map(b => ({ ...b, status: "active" })),
    ...(buyersActivity.pending || []).map(b => ({ ...b, status: "pending" })),
    ...(buyersActivity.rejected || []).map(b => ({ ...b, status: "rejected" })),
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Buyer's Activity</h2>
            <p className="text-sm text-gray-600 mt-1">
              Deal: <span className="font-medium">{dealTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {allBuyers.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No buyers available.</p>
          ) : (
            <ul className="space-y-2">
              {allBuyers.map((buyer, idx) => (
                <li key={buyer._id || idx} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {buyer.name ? buyer.name.split(' ').map(n => n[0]).join('') : "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{buyer.name || "Unknown"}</h4>
                    <p className="text-sm text-gray-600">{buyer.email || ""}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(buyer.status)}`}>
                    {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DealManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyersActivity, setShowBuyersActivity] = useState(false);
  const [selectedDealForActivity, setSelectedDealForActivity] = useState(null);
  const [buyersActivity, setBuyersActivity] = useState({
  active: [],
  pending: [],
  rejected: [],
  summary: { totalTargeted: 0, totalActive: 0, totalPending: 0, totalRejected: 0 }
});
 const filteredDeals = deals.filter(deal =>
  (deal.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (deal.industrySector || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (deal.geographySelection || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (deal.companyDescription || "").toLowerCase().includes(searchTerm.toLowerCase())
);
  // Add after your useState hooks
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 5;
const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);
const startIndex = (currentPage - 1) * dealsPerPage;
const endIndex = startIndex + dealsPerPage;
const currentDeals = filteredDeals.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 

  const router = useRouter()
  const { logout } = useAuth()

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://api.cimamplify.com/deals/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch deals");
        
        const data = await response.json();
        console.log('Received deals data:', data);
        
        // Ensure data is an array
        const dealsArray = Array.isArray(data) ? data : [data];
        setDeals(dealsArray);
        setError(null);
      } catch (error) {
        setDeals([]);
        setError(error.message);
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

 const handleSearch = (e) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1); // Reset to first page when searching
};

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const handleViewDealDetails = (deal) => {
    setSelectedDeal(deal);
  };

  const handlePassDeal = (dealId) => {
    // Mock pass functionality
    console.log(`Passing deal ${dealId}`);
    // In real implementation, this would update the deal status
  };

  const handleGoToCIM = (dealId) => {
    // Mock CIM navigation
    console.log(`Going to CIM for deal ${dealId}`);
    // In real implementation, this would navigate to CIM page
  };

  const handleActivityClick = async (deal) => {
  setSelectedDealForActivity(deal);
  setShowBuyersActivity(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://api.cimamplify.com/deals/${deal._id || deal.id}/status-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch buyers activity");
    const data = await res.json();
    setBuyersActivity({
      active: data.buyersByStatus.active || [],
      pending: data.buyersByStatus.pending || [],
      rejected: data.buyersByStatus.rejected || [],
      summary: data.summary || { totalTargeted: 0, totalActive: 0, totalPending: 0, totalRejected: 0 }
    });
  } catch (error) {
    setBuyersActivity({
      active: [],
      pending: [],
      rejected: [],
      summary: { totalTargeted: 0, totalActive: 0, totalPending: 0, totalRejected: 0 }
    });
  }
};

  // Filter deals based on active tab and search term
  const getTabCount = (status) => {
    return deals.filter(deal => deal.status === status).length;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
          <div className="mb-8">
            <Link href="/seller/dashboard">
              <Image src="/logo.svg" alt="CIM Amplify Logo" width={150} height={50} className="h-auto" />
            </Link>
          </div>
          <nav className="flex-1 flex flex-col gap-4">
            <Button
              variant="secondary"
              className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.5 6L12 1.5L7.5 6M3.75 8.25H20.25M5.25 8.25V19.5C5.25 19.9142 5.58579 20.25 6 20.25H18C18.4142 20.25 18.75 19.9142 18.75 19.5V8.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>My Deals</span>
            </Button>
            <Link href="/admin/buyers">
              <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
                <Users className="h-5 w-5" />
                <span>Buyers</span>
              </Button>
            </Link>
            <Link href="/admin/sellers">
              <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
                <Clock className="h-5 w-5" />
                <span>Sellers</span>
              </Button>
            </Link>
            <Link href="/admin/viewprofile">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal"
              >
                <Clock className="h-5 w-5" />
                <span>viewprofile</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </nav>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
          <div className="mb-8">
            <Link href="/seller/dashboard">
              <Image src="/logo.svg" alt="CIM Amplify Logo" width={150} height={50} className="h-auto" />
            </Link>
          </div>
          <nav className="flex-1 flex flex-col gap-4">
            <Button
              variant="secondary"
              className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.5 6L12 1.5L7.5 6M3.75 8.25H20.25M5.25 8.25V19.5C5.25 19.9142 5.58579 20.25 6 20.25H18C18.4142 20.25 18.75 19.9142 18.75 19.5V8.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>My Deals</span>
            </Button>
            <Link href="/admin/buyers">
              <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
                <Users className="h-5 w-5" />
                <span>Buyers</span>
              </Button>
            </Link>
            <Link href="/admin/sellers">
              <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
                <Clock className="h-5 w-5" />
                <span>Sellers</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 font-normal"
              onClick={() => router.push("/admin/buyer-acquire-profile")}
            >
              <Clock className="h-5 w-5" />
              <span>ViewProfile</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </nav>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <h3 className="font-bold mb-2">Error Loading Deals</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <Link href="/seller/dashboard">
            <Image src="/logo.svg" alt="CIM Amplify Logo" width={150} height={50} className="h-auto" />
          </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-4">
          <Button
            variant="secondary"
            className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.5 6L12 1.5L7.5 6M3.75 8.25H20.25M5.25 8.25V19.5C5.25 19.9142 5.58579 20.25 6 20.25H18C18.4142 20.25 18.75 19.9142 18.75 19.5V8.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>My Deals</span>
          </Button>

          <Link href="/admin/buyers">
            <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
              <Users className="h-5 w-5" />
              <span>Buyers</span>
            </Button>
          </Link>

          <Link href="/admin/sellers">
            <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
              <Clock className="h-5 w-5" />
              <span>Sellers</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-normal"
            onClick={() => router.push("/admin/viewprofile")}
          >
            <Clock className="h-5 w-5" />
            <span>ViewProfile</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-3 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Active Deals</h1>

          <div className="flex items-center justify-start gap-60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search here..."
                className="pl-10 w-80 bg-gray-100 border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium flex items-center">
                  Admin
                </div>
              </div>
              <div className="relative h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium overflow-hidden">
                <img className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Deal Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {currentDeals.map((deal) => {
              return (
                <div
                   key={deal.id || deal._id}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewDealDetails(deal)}
                >
                  <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-teal-500">
                      {activeTab === "active" ? deal.title : "Hidden Until Active"}
                    </h3>
                  </div>

                  <div className="p-4">
                    {/* Overview */}
                    <h4 className="mb-2 font-medium text-gray-800">Overview</h4>
                    <div className="mb-4 space-y-1 text-sm text-gray-600">
                      <p>Industry: {deal.industrySector}</p>
                      <p>Geography: {deal.geographySelection}</p>
                      <p>Number of Years in Business: {deal.yearsInBusiness}</p>
                      <p>Business Model: {deal.companyType}</p>
                      <p>Company Description: {deal.companyDescription}</p>
                    </div>

                    {/* Financial */}
                    <h4 className="mb-2 font-medium text-gray-800">Financial</h4>
                    <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>
                        Trailing 12-Month Revenue:{" "}
                        {deal.financialDetails?.trailingRevenueCurrency?.replace('USD($)', '$') || '$'}{deal.financialDetails?.trailingRevenueAmount?.toLocaleString() || 'N/A'}
                      </p>
                      <p>
                        Trailing 12-Month EBITDA:{" "}
                        {deal.financialDetails?.trailingEBITDACurrency?.replace('USD($)', '$') || '$'}{deal.financialDetails?.trailingEBITDAAmount?.toLocaleString() || 'N/A'}
                      </p>
                      <p>
                        T12 Free Cash Flow:{" "}
                        ${deal.financialDetails?.t12FreeCashFlow?.toLocaleString() || 'N/A'}
                      </p>
                      <p>
                        T12 Net Income:{" "}
                        ${deal.financialDetails?.t12NetIncome?.toLocaleString() || 'N/A'}
                      </p>
                      <p>
                        Average 3-Year Revenue Growth:{" "}
                        {deal.financialDetails?.avgRevenueGrowth || 'N/A'}%
                      </p>
                      <p>
                        Net Income:{" "}
                        ${deal.financialDetails?.netIncome?.toLocaleString() || 'N/A'}
                      </p>
                      <p>
                        Asking Price:{" "}
                        ${deal.financialDetails?.askingPrice?.toLocaleString() || 'N/A'}
                      </p>
                    </div>

                 
                    {/* Documents Section */}
                   <h4 className="mb-2 font-medium text-gray-800">Documents</h4>
{activeTab === "active" ? (
  <div className="mb-4 text-sm text-gray-600">
    {deal.documents && deal.documents.length > 0 ? (
      <ul className="space-y-1">
        {deal.documents.map((doc, index) => (
          <li
            key={index}
            className="flex items-center justify-between border border-gray-200 p-2 rounded-md"
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {typeof doc === 'string' ? doc : doc.originalName || doc.filename || 'Document'}
              </span>
              {typeof doc === 'object' && doc.size && (
                <span className="text-xs text-gray-500">
                  {(doc.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
            <Button
              variant="link"
              className="text-teal-500 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                const docName = typeof doc === 'string' ? doc : doc.originalName || doc.filename;
                console.log(`Downloading: ${docName}`);
                // Add actual download logic here if needed
              }}
            >
              Download
            </Button>
          </li>
        ))}
        
      </ul>
      
    ) : (
      <p className="italic text-gray-500">No documents uploaded yet.</p>
    )}
     <div className="flex justify-end">
                 <Button 
  className="bg-teal-500 hover:bg-teal-600 px-8 py-2"
  onClick={(e) => {
    e.stopPropagation();
    handleActivityClick(deal);
  }}
>
  Activity
</Button>
                </div>
  </div>
  
) : (
  <p className="mb-4 italic text-gray-500">Hidden Until Active</p>
)}

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                      {/* Go to CIM button */}
                      {activeTab === "pending" && (
                        <Button
                          variant="outline"
                          className="border-blue-200 bg-[#3AAFA922] text-[#3AAFA9] hover:bg-[#3AAFA933]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGoToCIM(deal.id);
                          }}
                        >
                          Go to CIM
                        </Button>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {deals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-500 text-center">
                {searchTerm 
                  ? `No deals match your search "${searchTerm}"`
                  : `No ${activeTab} deals available`}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-6 gap-2">
  <Button
    variant="outline"
    size="sm"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Prev
  </Button>
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <Button
      key={page}
      variant={currentPage === page ? "default" : "outline"}
      size="sm"
      onClick={() => handlePageChange(page)}
      className={currentPage === page ? "bg-[#3aafa9] text-white" : ""}
    >
      {page}
    </Button>
  ))}
  <Button
    variant="outline"
    size="sm"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</div>
      </div>

      {/* Buyer's Activity Popup */}
      <BuyersActivityPopup
  isOpen={showBuyersActivity}
  onClose={() => setShowBuyersActivity(false)}
  buyersActivity={buyersActivity}
  dealTitle={selectedDealForActivity?.title}
/>
    </div>
  );
}