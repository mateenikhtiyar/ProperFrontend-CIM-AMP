"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { ShoppingCart, Eye, Tag, Handshake } from "lucide-react";
import {
  Clock,
  LogOut,
  Search,
  Users,
  Building2,
  Settings,
  Bell,
  Edit,
  Trash2,
  AlertTriangle,
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

// Seller interface
interface Seller {
  _id?: string;
  id?: string;
  companyName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  title?: string;
  role?: string;
  password?: string;
  activeDealsCount: number;
  offMarketDealsCount: number;
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

// Helper to get image src with cache busting only for real URLs
function getProfileImageSrc(src?: string | null) {
  if (!src) return undefined;
  if (src.startsWith('data:')) return src;
  return src + `?cb=${Date.now()}`;
}

export default function SellersManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSeller, setEditSeller] = useState<Seller | null>(null);
  const [editForm, setEditForm] = useState<(Seller & { password: string })>({
    fullName: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    website: "",
    title: "",
    password: "",
    activeDealsCount: 0,
    offMarketDealsCount: 0,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [dataWarning, setDataWarning] = useState<string | null>(null);

  // Add admin profile state
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [companySort, setCompanySort] = useState<"asc" | "desc" | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeals, setModalDeals] = useState<any[]>([]);
  const [modalStatus, setModalStatus] = useState<"active" | "completed" | null>(null);
  const [modalSeller, setModalSeller] = useState<Seller | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const res = await fetch("https://api.cimamplify.com/sellers", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch sellers");
        }
        const data = await res.json();
        console.log("Raw sellers response:", data);
        const sellersData = Array.isArray(data) ? data.map((seller: Seller) => ({
          ...seller,
          activeDealsCount: seller.activeDealsCount ?? 0,
          offMarketDealsCount: seller.offMarketDealsCount ?? 0,
        })) : [];
        setSellers(sellersData);

        // Fetch total deals from /deals endpoint for validation
        const dealsRes = await fetch("https://api.cimamplify.com/deals", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (dealsRes.ok) {
          const deals = await dealsRes.json();
          const totalActiveDeals = (deals as any[]).filter((deal: any) =>
            Object.values(deal.invitationStatus || {}).some((status: any) => status.response === "accepted")
          ).length;
          const totalOffMarketDeals = (deals as any[]).filter((deal: any) => deal.status === "completed").length;
          const sellersActiveDeals = sellersData.reduce((sum, s) => sum + s.activeDealsCount, 0);
          const sellersOffMarketDeals = sellersData.reduce((sum, s) => sum + s.offMarketDealsCount, 0);
          if (sellersActiveDeals !== totalActiveDeals || sellersOffMarketDeals !== totalOffMarketDeals) {
            setDataWarning(
              `Data mismatch: Sellers page shows ${sellersActiveDeals} active and ${sellersOffMarketDeals} off-market deals, ` +
              `but deals endpoint reports ${totalActiveDeals} active and ${totalOffMarketDeals} off-market deals.`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setSellers([]);
        alert(`Failed to load sellers: ${(error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://api.cimamplify.com/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminProfile(data);
      }
    };
    fetchAdminProfile();
  }, []);

  // Fetch true active and off-market deal counts for each seller from backend
  useEffect(() => {
    async function fetchDealCounts() {
      const token = localStorage.getItem("token");
      const sellersWithCounts = await Promise.all(
        sellers.map(async (seller) => {
          const sellerId = seller._id || seller.id;
          if (!sellerId) return seller;
          let activeDealsCount = 0;
          let offMarketDealsCount = 0;
          try {
            // Fetch true active deals
            const activeRes = await fetch(`https://api.cimamplify.com/deals/admin/seller/${sellerId}/deals?status=active`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (activeRes.ok) {
              const activeDeals = await activeRes.json();
              activeDealsCount = Array.isArray(activeDeals) ? activeDeals.length : 0;
            }
            // Fetch off-market deals
            const offMarketRes = await fetch(`https://api.cimamplify.com/deals/admin/seller/${sellerId}/deals?status=completed`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (offMarketRes.ok) {
              const offMarketDeals = await offMarketRes.json();
              offMarketDealsCount = Array.isArray(offMarketDeals) ? offMarketDeals.length : 0;
            }
          } catch {}
          return { ...seller, activeDealsCount, offMarketDealsCount };
        })
      );
      setSellers(sellersWithCounts);
    }
    if (sellers.length > 0) fetchDealCounts();
  }, [sellers.length]);

  const handleLogout = () => {
    logout();
    router.push("/seller/login");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleView = (sellerId: string) => {
    router.push(`/admin/sellers/${sellerId}`);
  };

  const handleViewActiveDeals = (sellerId: string) => {
    router.push(`/admin/dashboard?sellerId=${sellerId}&status=accepted`);
  };

  const handleViewOffMarketDeals = (sellerId: string) => {
    router.push(`/admin/dashboard?sellerId=${sellerId}&status=completed`);
  };

  const handleEdit = (sellerId: string) => {
    const seller = sellers.find(s => s._id === sellerId || s.id === sellerId);
    if (seller) {
      setEditSeller(seller);
      setEditForm({
        fullName: seller.fullName || "",
        email: seller.email || "",
        companyName: seller.companyName || "",
        phoneNumber: seller.phoneNumber || "",
        website: seller.website || "",
        title: seller.title || "",
        password: "",
        _id: seller._id,
        id: seller.id,
        role: seller.role,
        activeDealsCount: seller.activeDealsCount,
        offMarketDealsCount: seller.offMarketDealsCount,
      });
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    if (!editForm.title || editForm.title.trim() === "") {
      alert("Title is required.");
      setEditLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const body: Partial<Seller> & { password?: string } = { ...editForm };
      if (Object.prototype.hasOwnProperty.call(body, "password") && !body.password) delete (body as any).password;
      delete (body as any)._id;
      delete (body as any).id;
      delete (body as any).role;
      delete (body as any).activeDealsCount;
      delete (body as any).offMarketDealsCount;
      if (!editSeller) throw new Error("No seller selected");
      const res = await fetch(`https://api.cimamplify.com/sellers/${editSeller._id || editSeller.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update seller");
      }
      const updated = await res.json();
      setSellers(sellers.map(s => (s._id === updated._id || s.id === updated.id ? {
        ...updated,
        activeDealsCount: s.activeDealsCount,
        offMarketDealsCount: s.offMarketDealsCount,
      } : s)));
      setEditSeller(null);
    } catch (error) {
      const msg = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
      alert(`Failed to update seller: ${msg}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (sellerId: string) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const res = await fetch(`https://api.cimamplify.com/sellers/${sellerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to delete seller");
      }
      setSellers(sellers.filter(s => (s._id || s.id) !== sellerId));
    } catch (error) {
      const msg = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
      alert(`Failed to delete seller: ${msg}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredSellers = sellers.filter(seller =>
    (seller.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (seller.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (seller.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sellersPerPage = 10;
  const startIndex = (currentPage - 1) * sellersPerPage;
  const endIndex = startIndex + sellersPerPage;
  const totalPages = Math.ceil(filteredSellers.length / sellersPerPage);

  // Sorting logic for company name
  const sortedSellers = [...filteredSellers].sort((a, b) => {
    const nameA = (a.companyName || "").toLowerCase();
    const nameB = (b.companyName || "").toLowerCase();
    if (!companySort) return 0;
    if (companySort === "asc") return nameA.localeCompare(nameB);
    return nameB.localeCompare(nameA);
  });
  const currentSellers = sortedSellers.slice(startIndex, endIndex);

  // Update openDealModal to fetch the correct deals for the popup
  const openDealModal = async (seller: Seller, status: "active" | "completed") => {
    setModalSeller(seller);
    setModalStatus(status);
    setModalLoading(true);
    setModalOpen(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://api.cimamplify.com/deals/admin/seller/${seller._id || seller.id}/deals?status=${status}`, {
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
            <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
              <Tag className="h-5 w-5" />
              <span>Buyers</span>
            </Button>
          </Link>
          <Link href="/admin/sellers">
            <Button onClick={() => router.push("/admin/dashboard")} variant="ghost" className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200">
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
          <h1 className="text-2xl font-bold text-gray-800">All Sellers</h1>
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
          {/* Warning Message */}
          {dataWarning && (
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-700" />
              <span className="text-yellow-700">{dataWarning}</span>
            </div>
          )}

          {/* Page Title and Search */}
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

          {/* Sellers Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span>Loading sellers...</span>
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
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm hidden md:table-cell">Website</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm hidden lg:table-cell">Active Deals</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm hidden lg:table-cell">Off-Market Deals</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentSellers.map((seller) => (
                      <tr key={seller._id || seller.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                            {seller.companyName || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-700 text-sm truncate max-w-[120px]">
                            {seller.fullName || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-600 text-sm truncate max-w-[180px]">
                            {seller.email || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="text-gray-600 text-sm truncate">
                            {seller.phoneNumber || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="text-blue-600 text-sm truncate max-w-[140px] hover:underline cursor-pointer">
                            {seller.website ? (
                              <a href={seller.website} target="_blank" rel="noopener noreferrer">
                                {seller.website}
                              </a>
                            ) : "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <div
                            className="text-gray-600 text-sm cursor-pointer hover:text-blue-600 hover:underline"
                            onClick={() => openDealModal(seller, "active")}
                          >
                            {seller.activeDealsCount}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <div
                            className="text-gray-600 text-sm cursor-pointer hover:text-blue-600 hover:underline"
                            onClick={() => openDealModal(seller, "completed")}
                          >
                            {seller.offMarketDealsCount}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">

                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5 h-7 w-7 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              onClick={() => handleEdit((seller._id || seller.id || "") as string)}
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5 h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              onClick={() => handleDelete((seller._id || seller.id || "") as string)}
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
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredSellers.length)} of {filteredSellers.length} entries
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

          {/* Edit Modal */}
          {editSeller && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <form
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                onSubmit={handleEditSubmit}
              >
                <h3 className="text-lg font-semibold mb-4">Edit Seller</h3>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Full Name</label>
                  <Input name="fullName" value={editForm.fullName} onChange={handleEditFormChange} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Email</label>
                  <Input name="email" value={editForm.email} onChange={handleEditFormChange} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Company Name</label>
                  <Input name="companyName" value={editForm.companyName} onChange={handleEditFormChange} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Phone Number</label>
                  <Input name="phoneNumber" value={editForm.phoneNumber} onChange={handleEditFormChange} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Website</label>
                  <Input name="website" value={editForm.website} onChange={handleEditFormChange} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Title</label>
                  <Input name="title" value={editForm.title} onChange={handleEditFormChange} required />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Password (leave blank to keep unchanged)</label>
                  <Input name="password" type="password" value={editForm.password} onChange={handleEditFormChange} autoComplete="new-password" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={editLoading}>
                    {editLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditSeller(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Deal Info Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalStatus && modalSeller ? (
                <>
                  {modalStatus === "active" ? "Active" : "Off-Market"} Deals for {modalSeller.fullName}
                </>
              ) : "Deals"}
            </DialogTitle>
            <DialogDescription>
              {modalSeller?.companyName}
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
