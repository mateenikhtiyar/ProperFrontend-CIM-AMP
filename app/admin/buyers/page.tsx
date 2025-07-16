"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Tag, ShoppingCart, Handshake } from "lucide-react";
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
  Trash2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

// Add Buyer interface
interface CompanyProfile {
  companyName?: string;
  _id?: string;
  id?: string;
}

interface Buyer {
  _id?: string;
  id?: string;
  companyName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  companyProfileId?: string | { $oid: string };
  companyProfile?: CompanyProfile;
  profileId?: string;
}

// Add AdminProfile type
interface AdminProfile {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  title?: string;
  companyName?: string;
  website?: string;
  location?: string;
  profilePicture?: string | null;
  role?: string;
}

// Add type for deal status counts
interface BuyerDealStatusCounts {
  active: number;
  pending: number;
  rejected: number;
}

// Helper to get image src with cache busting only for real URLs
function getProfileImageSrc(src?: string | null) {
  if (!src) return undefined;
  if (src.startsWith('data:')) return src;
  return src + `?cb=${Date.now()}`;
}

export default function BuyersManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const { logout } = useAuth()
  const [buyerDealCounts, setBuyerDealCounts] = useState<Record<string, BuyerDealStatusCounts>>({});

  // Add admin profile state
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminProfile(data);
      }
    };
    fetchAdminProfile();
  }, []);

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

  // Fetch real deal status counts for each buyer from backend (using invitationStatus logic)
  useEffect(() => {
    async function fetchDealCounts() {
      const token = localStorage.getItem("token");
      const counts: Record<string, BuyerDealStatusCounts> = {};
      await Promise.all(
        buyers.map(async (buyer) => {
          const buyerId = buyer._id || buyer.id;
          if (!buyerId) return;
          try {
            // Fetch real deal status counts from backend (invitationStatus logic)
            const res = await fetch(`http://localhost:3001/deals/admin/buyer/${buyerId}/status-counts`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch deal status counts");
            const data = await res.json();
            counts[buyerId] = {
              active: data.active || 0,
              pending: data.pending || 0,
              rejected: data.rejected || 0,
            };
          } catch {
            counts[buyerId] = { active: 0, pending: 0, rejected: 0 };
          }
        })
      );
      setBuyerDealCounts(counts);
    }
    if (buyers.length > 0) fetchDealCounts();
  }, [buyers]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeals, setModalDeals] = useState<any[]>([]);
  const [modalStatus, setModalStatus] = useState<"active" | "pending" | "rejected" | null>(null);
  const [modalBuyer, setModalBuyer] = useState<Buyer | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch deals for modal (using invitationStatus logic)
  const openDealModal = async (buyer: Buyer, status: "active" | "pending" | "rejected") => {
    setModalBuyer(buyer);
    setModalStatus(status);
    setModalLoading(true);
    setModalOpen(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/deals/admin/buyer/${buyer._id || buyer.id}/deals?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch deals");
      const deals = await res.json();
      setModalDeals(deals);
    } catch {
      setModalDeals([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleView = (buyerId: string) => {
    if (!buyerId) return;
    console.log(`Viewing buyer ${buyerId}`);
  };

  const handleEdit = (buyer: Buyer) => {
    let companyProfileId = buyer.companyProfile?._id || buyer.companyProfile?.id || '';
    if (companyProfileId) {
      router.push(`/admin/acquireprofile?id=${companyProfileId}`);
    } else {
      alert("No company profile found for this buyer.");
    }
  };

  const handleDelete = async (buyerId: string) => {
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
  const filteredBuyers = buyers.filter((buyer: Buyer) =>
    (buyer.companyProfile?.companyName || buyer.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (buyer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (buyer.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buyersPerPage = 10;
  const startIndex = (currentPage - 1) * buyersPerPage;
  const endIndex = startIndex + buyersPerPage;
  const [companySort, setCompanySort] = useState<"asc" | "desc" | null>(null);
  // Sorting logic for company name
  const sortedBuyers = [...filteredBuyers].sort((a, b) => {
    const nameA = (a.companyProfile?.companyName || a.companyName || "").toLowerCase();
    const nameB = (b.companyProfile?.companyName || b.companyName || "").toLowerCase();
    if (!companySort) return 0;
    if (companySort === "asc") return nameA.localeCompare(nameB);
    return nameB.localeCompare(nameA);
  });
  const currentBuyers = sortedBuyers.slice(startIndex, endIndex);

  // Pagination
  const totalPages = Math.ceil(filteredBuyers.length / buyersPerPage);

  const handlePageChange = (page: number) => {
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
             <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
              <Handshake className="h-5 w-5" />
              <span>  Deals</span>
            </Button>
          </Link>
          <Link href="/admin/buyers">
            <Button variant="ghost" className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200">
              <Tag className="h-5 w-5" />
              <span>Buyers</span>
            </Button>
          </Link>
          <Link href="/admin/sellers">
            <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
              <ShoppingCart className="h-5 w-5" />
              <span>Sellers</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-normal"
            onClick={() => router.push('/admin/viewprofile')}
          >
            <Eye className="h-5 w-5" />
            <span>View Profile</span>
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
                <h1 className="text-2xl font-bold text-gray-800">All Buyers</h1>
      
                <div className="flex items-center justify-start gap-60">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="search"
                      placeholder="Search here..."
                      className="pl-10 w-80 bg-gray-100 border-0"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
      
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium flex items-center">{adminProfile?.fullName || "Admin"}</div>
                    </div>
                    <div className="relative h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium overflow-hidden">
                      {adminProfile?.profilePicture ? (
                        <img
                          src={getProfileImageSrc(adminProfile.profilePicture)}
                          alt={adminProfile.fullName || "User"}
                          className="h-full w-full object-cover"
                          key={adminProfile.profilePicture}
                        />
                      ) : (
                        <span>{adminProfile?.fullName ? adminProfile.fullName.charAt(0) : "A"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </header>
        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Page Title */}
          <div className="mb-6">
        
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
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        <span className="inline-flex items-center gap-1">
                          Company
                          <button
                            type="button"
                            className="ml-1 p-0.5 hover:bg-gray-200 rounded"
                            title="Sort ascending"
                            onClick={() => setCompanySort("asc")}
                            style={{ lineHeight: 0 }}
                          >
                            <ArrowUp className="h-3 w-3 text-gray-500" />
                          </button>
                          <button
                            type="button"
                            className="ml-0.5 p-0.5 hover:bg-gray-200 rounded"
                            title="Sort descending"
                            onClick={() => setCompanySort("desc")}
                            style={{ lineHeight: 0 }}
                          >
                            <ArrowDown className="h-3 w-3 text-gray-500" />
                          </button>
                        </span>
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Full Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm hidden sm:table-cell">Phone</th>
                      {/* New columns for deal status counts */}
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Active</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Pending</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Rejected</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentBuyers.map((buyer) => {
                      const buyerId = String(buyer._id || buyer.id || "");
                      const dealCounts = buyerId && buyerDealCounts && Object.prototype.hasOwnProperty.call(buyerDealCounts, buyerId)
                        ? buyerDealCounts[buyerId]
                        : { active: 0, pending: 0, rejected: 0 };
                      return (
                        <tr key={buyer._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                              {buyer.companyProfile?.companyName || buyer.companyName}
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
                          {/* New deal status columns with clickable numbers */}
                          <td className="py-3 px-4 text-green-700 font-semibold cursor-pointer underline" onClick={() => openDealModal(buyer, "active")}>{dealCounts.active}</td>
                          <td className="py-3 px-4 text-yellow-700 font-semibold cursor-pointer underline" onClick={() => openDealModal(buyer, "pending")}>{dealCounts.pending}</td>
                          <td className="py-3 px-4 text-red-700 font-semibold cursor-pointer underline" onClick={() => openDealModal(buyer, "rejected")}>{dealCounts.rejected}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5 h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                onClick={() => handleView((buyer._id || buyer.id) ?? "")}
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
    !(buyer.companyProfile && (buyer.companyProfile._id || buyer.companyProfile.id))
  }
>
  <Edit className="h-3.5 w-3.5" />
</Button>
                               <Button
                                                         variant="ghost"
                                                         size="sm"
                                                         className="p-1.5 h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                         onClick={() => handleDelete(buyer._id || buyer.id || '')}
                                                         title="Delete"
                                                       >
                                                         <Trash2 className="h-3.5 w-3.5" />
                                                       </Button>
                            
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

      {/* Deal Info Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalStatus && modalBuyer ? (
                <>
                  {modalStatus.charAt(0).toUpperCase() + modalStatus.slice(1)} Deals for {modalBuyer.fullName}
                </>
              ) : "Deals"}
            </DialogTitle>
            <DialogDescription>
              {modalBuyer?.companyProfile?.companyName || modalBuyer?.companyName}
            </DialogDescription>
          </DialogHeader>
          {modalLoading ? (
            <div className="py-6 text-center">Loading deals...</div>
          ) : modalDeals.length === 0 ? (
            <div className="py-6 text-center text-gray-500">No deals found.</div>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {modalDeals.map((deal) => (
                <li key={deal._id} className="py-2 px-1">
                  <div className="font-medium text-gray-900">{deal.title}</div>
                  <div className="text-xs text-gray-500">Status: {deal.status}</div>
                  <div className="text-xs text-gray-400">Industry: {deal.industrySector}</div>
                  <div className="text-xs text-gray-400">Last Updated: {deal.timeline?.updatedAt ? new Date(deal.timeline.updatedAt).toLocaleString() : "-"}</div>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}