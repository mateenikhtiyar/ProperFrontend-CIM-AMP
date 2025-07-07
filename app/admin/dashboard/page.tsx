'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { Users, Building2, Clock, LogOut, Search, X } from 'lucide-react';

interface DocumentInfo {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

interface FinancialDetails {
  trailingRevenueCurrency?: string;
  trailingRevenueAmount?: number;
  trailingEBITDACurrency?: string;
  trailingEBITDAAmount?: number;
  t12FreeCashFlow?: number;
  t12NetIncome?: number;
  avgRevenueGrowth?: number;
  netIncome?: number;
  askingPrice?: number;
  finalSalePrice?: number;
}

interface Deal {
  _id: string;
  title: string;
  companyDescription: string;
  companyType?: string[];
  dealType: string;
  status: string;
  visibility?: string;
  industrySector: string;
  geographySelection: string;
  yearsInBusiness: number;
  employeeCount?: number;
  seller: string;
  financialDetails?: FinancialDetails;
  documents?: DocumentInfo[];
}

interface Buyer {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany?: string;
  companyType?: string;
  lastInteraction?: string;
  totalInteractions?: number;
  interactions?: Array<{
    type: string;
    timestamp: string;
    notes: string;
    metadata?: any;
  }>;
  status: string;
}

interface BuyersActivity {
  active: Buyer[];
  pending: Buyer[];
  rejected: Buyer[];
  summary: {
    totalTargeted: number;
    totalActive: number;
    totalPending: number;
    totalRejected: number;
  };
}

const BuyersActivityPopup = ({
  isOpen,
  onClose,
  buyersActivity,
  dealTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  buyersActivity: BuyersActivity;
  dealTitle: string;
}) => {
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);

  if (!isOpen) return null;

  const buyerMap = new Map<string, Buyer>();
  [
    ...(buyersActivity.active || []).map((b) => ({ ...b, status: 'active' })),
    ...(buyersActivity.pending || []).map((b) => ({ ...b, status: 'pending' })),
    ...(buyersActivity.rejected || []).map((b) => ({ ...b, status: 'rejected' })),
  ].forEach((buyer) => {
    if (!buyerMap.has(buyer.buyerId)) {
      buyerMap.set(buyer.buyerId, buyer);
    } else {
      const existing = buyerMap.get(buyer.buyerId)!;
      existing.interactions = [
        ...(existing.interactions || []),
        ...(buyer.interactions || []),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      existing.lastInteraction = existing.interactions?.[0]?.timestamp || existing.lastInteraction;
      existing.totalInteractions = existing.interactions?.length || existing.totalInteractions;
    }
  });
  const allBuyers = Array.from(buyerMap.values());

  const getStatusColor = (status: string) => {
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
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Buyer's Activity</h2>
            <p className="text-sm text-gray-600 mt-1">
              Deal: <span className="font-medium">{dealTitle}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {allBuyers.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No buyers available.</p>
          ) : (
            <ul className="space-y-2">
              {allBuyers.map((buyer) => (
                <li
                  key={buyer.buyerId}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedBuyer(buyer)}
                >
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {buyer.buyerName ? buyer.buyerName.split(' ').map((n) => n[0]).join('') : '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{buyer.buyerName || 'Unknown'}</h4>
                    <p className="text-sm text-gray-600">{buyer.buyerEmail || ''}</p>
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
      {selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Buyer Details</h3>
              <button onClick={() => setSelectedBuyer(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedBuyer.buyerName || 'Unknown'}</p>
              <p><strong>Email:</strong> {selectedBuyer.buyerEmail || 'N/A'}</p>
              <p><strong>Company:</strong> {selectedBuyer.buyerCompany || 'N/A'}</p>
              {selectedBuyer.companyType && (
                <p><strong>Company Type:</strong> {selectedBuyer.companyType}</p>
              )}
              {selectedBuyer.lastInteraction && (
                <p><strong>Last Interaction:</strong> {new Date(selectedBuyer.lastInteraction).toLocaleString()}</p>
              )}
              {selectedBuyer.interactions && selectedBuyer.interactions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mt-4">Interactions</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {selectedBuyer.interactions.map((interaction, index) => (
                      <li key={index}>
                        {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)} -{' '}
                        {new Date(interaction.timestamp).toLocaleString()} - {interaction.notes}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedBuyer(null)} className="bg-teal-500 hover:bg-teal-600">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function DealManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [offMarketDeals, setOffMarketDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [showBuyersActivity, setShowBuyersActivity] = useState(false);
  const [selectedDealForActivity, setSelectedDealForActivity] = useState<Deal | null>(null);
  const [buyersActivity, setBuyersActivity] = useState<BuyersActivity>({
    active: [],
    pending: [],
    rejected: [],
    summary: { totalTargeted: 0, totalActive: 0, totalPending: 0, totalRejected: 0 },
  });
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  const [offMarketCurrentPage, setOffMarketCurrentPage] = useState(1);
  const dealsPerPage = 5;

  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching active deals with token:', token);

        const activeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals/active-accepted`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!activeResponse.ok) {
          const errorData = await activeResponse.json();
          console.error('Active deals fetch error:', activeResponse.status, errorData);
          throw new Error(`Failed to fetch active deals: ${errorData.message || activeResponse.statusText}`);
        }

        const activeData = await activeResponse.json();
        const activeDealsArray = Array.isArray(activeData) ? activeData : [activeData];
        console.log('Active deals:', activeDealsArray);
        setActiveDeals(activeDealsArray);

        const offMarketResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals/admin/completed/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!offMarketResponse.ok) throw new Error('Failed to fetch off-market deals');
        const offMarketData = await offMarketResponse.json();
        const offMarketDealsArray = Array.isArray(offMarketData) ? offMarketData : [offMarketData];
        setOffMarketDeals(offMarketDealsArray);

        setError(null);
      } catch (error: any) {
        setActiveDeals([]);
        setOffMarketDeals([]);
        setError(error.message);
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    if (activeTab === 'active') {
      setActiveCurrentPage(1);
    } else if (activeTab === 'offMarket') {
      setOffMarketCurrentPage(1);
    }
  }, [activeTab, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setActiveCurrentPage(1);
    setOffMarketCurrentPage(1);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleViewDealDetails = (deal: Deal) => {
    setSelectedDeal(deal);
    router.push(`/admin/deals/${deal._id}`);
  };

  const handleActivityClick = async (deal: Deal) => {
    setSelectedDealForActivity(deal);
    setBuyersActivity({
      active: [],
      pending: [],
      rejected: [],
      summary: { totalTargeted: 0, totalActive: 0, totalPending: 0, totalRejected: 0 },
    });
    setActivityError(null);
    setShowBuyersActivity(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals/${deal._id}/status-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch buyers activity');
      }
      const data = await res.json();
      setBuyersActivity({
        active: data.buyersByStatus.active || [],
        pending: data.buyersByStatus.pending || [],
        rejected: data.buyersByStatus.rejected || [],
        summary: data.summary || { totalTargeted: 0, totalActive: 0, totalPending: 0, totalRejected: 0 },
      });
    } catch (error: any) {
      setActivityError(error.message);
      setBuyersActivity({
        active: [],
        pending: [],
        rejected: [],
        summary: { totalTargeted: 0, totalActive: 0, totalPending: 0, totalRejected: 0 },
      });
    }
  };

  const handleDownloadDocument = async (dealId: string, filename: string, originalName: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals/${dealId}/document/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download document');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading document:', error);
      alert(`Failed to download document: ${error.message}`);
    }
  };

  // Filter out completed deals from activeDeals before using in Active tab
  const filteredActiveDeals = activeDeals.filter(deal => deal.status !== 'completed');

  const getTabCount = (tab: string) => {
    if (tab === 'active') {
      return filteredActiveDeals.length;
    } else if (tab === 'offMarket') {
      return offMarketDeals.length;
    }
    return 0;
  };

  // Filtered deals for each tab
  const filteredActive = filteredActiveDeals.filter(
    (deal) =>
      (deal.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.industrySector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.geographySelection || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.companyDescription || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOffMarket = offMarketDeals.filter(
    (deal) =>
      (deal.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.industrySector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.geographySelection || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.companyDescription || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for each tab
  const activeTotalPages = Math.ceil(filteredActive.length / dealsPerPage);
  const offMarketTotalPages = Math.ceil(filteredOffMarket.length / dealsPerPage);
  const activeStartIndex = (activeCurrentPage - 1) * dealsPerPage;
  const activeEndIndex = activeStartIndex + dealsPerPage;
  const offMarketStartIndex = (offMarketCurrentPage - 1) * dealsPerPage;
  const offMarketEndIndex = offMarketStartIndex + dealsPerPage;
  const currentActiveDeals = filteredActive.slice(activeStartIndex, activeEndIndex);
  const currentOffMarketDeals = filteredOffMarket.slice(offMarketStartIndex, offMarketEndIndex);

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
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 font-normal"
              onClick={() => router.push('/admin/viewprofile')}
            >
              <Clock className="h-5 w-5" />
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={() => router.push('/admin/viewprofile')}
            >
              <Clock className="h-5 w-5" />
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
            onClick={() => router.push('/admin/viewprofile')}
          >
            <Clock className="h-5 w-5" />
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

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-3 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Deal Management</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search deals..."
                className="pl-10 w-80 bg-gray-100 border-0"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium flex items-center">Admin</div>
              </div>
              <div className="relative h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium overflow-hidden">
                <span>AD</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active">
                Active Deals <Badge className="ml-2">{getTabCount('active')}</Badge>
              </TabsTrigger>
              <TabsTrigger value="offMarket">
                Off Market Deals <Badge className="ml-2">{getTabCount('offMarket')}</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {currentActiveDeals.map((deal) => (
                  <div
                    key={deal._id}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                      <h3 className="text-lg font-medium text-teal-500">{deal.title}</h3>
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2 font-medium text-gray-800">Overview</h4>
                      <div className="mb-4 space-y-1 text-sm text-gray-600">
                        <p>Industry: {deal.industrySector}</p>
                        <p>Geography: {deal.geographySelection}</p>
                        <p>Number of Years in Business: {deal.yearsInBusiness}</p>
                        <p>Business Model: {Array.isArray(deal.companyType) ? deal.companyType.join(', ') : deal.companyType || 'N/A'}</p>
                        <p>Company Description: {deal.companyDescription}</p>
                      </div>
                      <h4 className="mb-2 font-medium text-gray-800">Financial</h4>
                      <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          Trailing 12-Month Revenue:{' '}
                          {deal.financialDetails?.trailingRevenueCurrency?.replace('USD($)', '$') || '$'}
                          {deal.financialDetails?.trailingRevenueAmount?.toLocaleString() || 'N/A'}
                        </p>
                        <p>
                          Trailing 12-Month EBITDA:{' '}
                          {deal.financialDetails?.trailingEBITDACurrency?.replace('USD($)', '$') || '$'}
                          {deal.financialDetails?.trailingEBITDAAmount?.toLocaleString() || 'N/A'}
                        </p>
                        <p>T12 Free Cash Flow: ${deal.financialDetails?.t12FreeCashFlow?.toLocaleString() || 'N/A'}</p>
                        <p>T12 Net Income: ${deal.financialDetails?.t12NetIncome?.toLocaleString() || 'N/A'}</p>
                        <p>
                          Average 3-Year Revenue Growth: {deal.financialDetails?.avgRevenueGrowth || 'N/A'}%
                        </p>
                        <p>Net Income: ${deal.financialDetails?.netIncome?.toLocaleString() || 'N/A'}</p>
                        <p>Asking Price: ${deal.financialDetails?.askingPrice?.toLocaleString() || 'N/A'}</p>
                        {deal.financialDetails?.finalSalePrice && (
                          <p>Final Sale Price: ${deal.financialDetails?.finalSalePrice?.toLocaleString()}</p>
                        )}
                      </div>
                      <h4 className="mb-2 font-medium text-gray-800">Documents</h4>
                      <div className="mb-4 text-sm text-gray-600">
                        {deal.documents && deal.documents.length > 0 ? (
                          <ul className="space-y-1">
                            {deal.documents.map((doc, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between border border-gray-200 p-2 rounded-md"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{doc.originalName || doc.filename || 'Document'}</span>
                                  <span className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <Button
                                  variant="link"
                                  className="text-teal-500 hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument(deal._id, doc.filename, doc.originalName);
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
                      </div>
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
                  </div>
                ))}
              </div>
              {filteredActive.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
                  <p className="text-gray-500 text-center">
                    {searchTerm ? `No deals match your search "${searchTerm}"` : `No active deals available`}
                  </p>
                </div>
              )}
              {/* Pagination for Active Deals */}
              {activeTotalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveCurrentPage(activeCurrentPage - 1)}
                    disabled={activeCurrentPage === 1}
                  >
                    Prev
                  </Button>
                  {Array.from({ length: activeTotalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={activeCurrentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveCurrentPage(page)}
                      className={activeCurrentPage === page ? 'bg-[#3aafa9] text-white' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveCurrentPage(activeCurrentPage + 1)}
                    disabled={activeCurrentPage === activeTotalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="offMarket">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {currentOffMarketDeals.map((deal) => (
                  <div
                    key={deal._id}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                      <h3 className="text-lg font-medium text-teal-500">{deal.title}</h3>
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2 font-medium text-gray-800">Overview</h4>
                      <div className="mb-4 space-y-1 text-sm text-gray-600">
                        <p>Industry: {deal.industrySector}</p>
                        <p>Geography: {deal.geographySelection}</p>
                        <p>Number of Years in Business: {deal.yearsInBusiness}</p>
                        <p>Business Model: {Array.isArray(deal.companyType) ? deal.companyType.join(', ') : deal.companyType || 'N/A'}</p>
                        <p>Company Description: {deal.companyDescription}</p>
                      </div>
                      <h4 className="mb-2 font-medium text-gray-800">Financial</h4>
                      <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          Trailing 12-Month Revenue:{' '}
                          {deal.financialDetails?.trailingRevenueCurrency?.replace('USD($)', '$') || '$'}
                          {deal.financialDetails?.trailingRevenueAmount?.toLocaleString() || 'N/A'}
                        </p>
                        <p>
                          Trailing 12-Month EBITDA:{' '}
                          {deal.financialDetails?.trailingEBITDACurrency?.replace('USD($)', '$') || '$'}
                          {deal.financialDetails?.trailingEBITDAAmount?.toLocaleString() || 'N/A'}
                        </p>
                        <p>T12 Free Cash Flow: ${deal.financialDetails?.t12FreeCashFlow?.toLocaleString() || 'N/A'}</p>
                        <p>T12 Net Income: ${deal.financialDetails?.t12NetIncome?.toLocaleString() || 'N/A'}</p>
                        <p>
                          Average 3-Year Revenue Growth: {deal.financialDetails?.avgRevenueGrowth || 'N/A'}%
                        </p>
                        <p>Net Income: ${deal.financialDetails?.netIncome?.toLocaleString() || 'N/A'}</p>
                        <p>Asking Price: ${deal.financialDetails?.askingPrice?.toLocaleString() || 'N/A'}</p>
                        {deal.financialDetails?.finalSalePrice && (
                          <p>Final Sale Price: ${deal.financialDetails?.finalSalePrice?.toLocaleString()}</p>
                        )}
                      </div>
                      <h4 className="mb-2 font-medium text-gray-800">Documents</h4>
                      <div className="mb-4 text-sm text-gray-600">
                        {deal.documents && deal.documents.length > 0 ? (
                          <ul className="space-y-1">
                            {deal.documents.map((doc, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between border border-gray-200 p-2 rounded-md"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{doc.originalName || doc.filename || 'Document'}</span>
                                  <span className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <Button
                                  variant="link"
                                  className="text-teal-500 hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument(deal._id, doc.filename, doc.originalName);
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
                      </div>
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
                  </div>
                ))}
              </div>
              {filteredOffMarket.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
                  <p className="text-gray-500 text-center">
                    {searchTerm ? `No deals match your search "${searchTerm}"` : `No off market deals available`}
                  </p>
                </div>
              )}
              {/* Pagination for Off Market Deals */}
              {offMarketTotalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffMarketCurrentPage(offMarketCurrentPage - 1)}
                    disabled={offMarketCurrentPage === 1}
                  >
                    Prev
                  </Button>
                  {Array.from({ length: offMarketTotalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={offMarketCurrentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOffMarketCurrentPage(page)}
                      className={offMarketCurrentPage === page ? 'bg-[#3aafa9] text-white' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffMarketCurrentPage(offMarketCurrentPage + 1)}
                    disabled={offMarketCurrentPage === offMarketTotalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <BuyersActivityPopup
          isOpen={showBuyersActivity}
          onClose={() => setShowBuyersActivity(false)}
          buyersActivity={buyersActivity}
          dealTitle={selectedDealForActivity?.title || ''}
        />
      </div>
    </div>
  );
}