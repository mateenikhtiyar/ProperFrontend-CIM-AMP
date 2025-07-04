"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  Eye,
  Clock,
  LogOut,
  Search,
  Users,
  Building2,
  Settings,
  Bell,
  Edit,
  Trash2
} from "lucide-react";

export default function BuyersManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const fetchBuyers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/buyers/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch buyers");
        const data = await res.json();
        setBuyers(Array.isArray(data) ? data : []);
      } catch (error) {
        setBuyers([]);
        console.error("Error fetching buyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleView = (buyerId) => {
    console.log(`Viewing buyer ${buyerId}`);
  };
const handleEdit = (buyer) => {
  // Debug: See what the buyer object looks like
  console.log("Edit buyer:", buyer);

  let companyProfileId = null;

  // Handle MongoDB ObjectId format
  if (buyer.companyProfileId) {
    if (typeof buyer.companyProfileId === "object" && buyer.companyProfileId.$oid) {
      companyProfileId = buyer.companyProfileId.$oid;
    } else if (typeof buyer.companyProfileId === "string") {
      companyProfileId = buyer.companyProfileId;
    }
  }

  // Fallbacks (if you ever change your backend)
  if (!companyProfileId && buyer.profileId) companyProfileId = buyer.profileId;
  if (!companyProfileId && buyer.companyProfile && (buyer.companyProfile._id || buyer.companyProfile.id)) {
    companyProfileId = buyer.companyProfile._id || buyer.companyProfile.id;
  }

  // Debug: See what ID we found
  console.log("Resolved companyProfileId:", companyProfileId);

  if (companyProfileId) {
    router.push(`/admin/acquireprofile?id=${companyProfileId}`);
  } else {
    alert("No company profile found for this buyer.");
  }
};
   const handleDelete = async (buyerId) => {
    if (!window.confirm("Are you sure you want to delete this Buyer?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/admin/buyers/${buyerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete seller");
      setBuyers(buyers.filter(s => (s._id || s.id) !== buyerId));
    } catch (error) {
      alert("Failed to delete seller");
    }
  };


  // Filter buyers based on search term
  const filteredBuyers = buyers.filter(buyer =>
    (buyer.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (buyer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (buyer.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const buyersPerPage = 10;
  const totalPages = Math.ceil(filteredBuyers.length / buyersPerPage);
  const startIndex = (currentPage - 1) * buyersPerPage;
  const endIndex = startIndex + buyersPerPage;
  const currentBuyers = filteredBuyers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            variant="ghost"
            className="w-full justify-start gap-3 font-normal"
            onClick={() => router.push("/admin/dashboard")}
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
            <Button
              variant="secondary"
              className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200"
            >
              <Users className="h-5 w-5" />
              <span>Buyers</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-normal"
            onClick={() => router.push("/admin/sellers")}
          >
            <Clock className="h-5 w-5" />
            <span>Sellers</span>
          </Button>

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
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">All Buyers</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-10 w-64 bg-white border border-gray-200"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {/* Buyers Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span>Loading buyers...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Full Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm hidden sm:table-cell">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm hidden md:table-cell">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentBuyers.map((buyer) => (
                      <tr key={buyer._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                            {buyer.companyName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-700 text-sm truncate max-w-[120px]">
                            {buyer.fullName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-600 text-sm truncate max-w-[180px]">
                            {buyer.email}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="text-gray-600 text-sm truncate">
                            {buyer.phone || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {buyer.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5 h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              onClick={() => handleView(buyer._id)}
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button> */}
                          <Button
  variant="ghost"
  size="sm"
  className="p-1.5 h-7 w-7 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
  onClick={() => handleEdit(buyer)}
  title="Edit"
  disabled={
    !(
      buyer.companyProfileId &&
      ((typeof buyer.companyProfileId === "object" && buyer.companyProfileId.$oid) ||
        typeof buyer.companyProfileId === "string")
    )
  }
>
  <Edit className="h-3.5 w-3.5" />
</Button>
                               <Button
                                                         variant="ghost"
                                                         size="sm"
                                                         className="p-1.5 h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                         onClick={() => handleDelete(buyer._id || buyer.id)}
                                                         title="Delete"
                                                       >
                                                         <Trash2 className="h-3.5 w-3.5" />
                                                       </Button>
                            
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredBuyers.length)} of {filteredBuyers.length} entries
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-sm h-8 min-w-[32px] border-gray-300 hover:bg-gray-100"
                  >
                    ‹
                  </Button>

                  {/* Show up to 5 page buttons, then ... and last page if needed */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 text-sm h-8 min-w-[32px] ${
                        currentPage === page
                          ? "bg-[#3aafa9] text-white hover:bg-[#359a94] border-[#3aafa9]"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}

                  {totalPages > 6 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2 text-sm text-gray-400">...</span>
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-2 py-1 text-sm h-8 min-w-[32px] ${
                          currentPage === totalPages
                            ? "bg-[#3aafa9] text-white hover:bg-[#359a94] border-[#3aafa9]"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {totalPages}

                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-sm h-8 min-w-[32px] border-gray-300 hover:bg-gray-100"
                  >
                    ›
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}