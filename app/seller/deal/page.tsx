"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, Clock, LogOut, ArrowLeft, User, Users, Clock3, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import SellerProtectedRoute from "@/components/seller/protected-route"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Updated interfaces to match API structure
interface SellerProfile {
  _id: string
  fullName: string
  email: string
  companyName: string
  role: string
  profilePicture: string | null
}

interface DealDocument {
  filename: string
  originalName: string
  path: string
  size: number
  mimetype: string
  uploadedAt: string
}

interface InvitationStatus {
  [buyerId: string]: {
    invitedAt: string
    respondedAt?: string
    response?: string
    notes?: string
    _id: string
  }
}

interface Deal {
  _id: string
  id?: string
  title: string
  companyDescription: string
  dealType: string
  status: string
  visibility?: string
  industrySector: string
  geographySelection: string

  employeeCount?: number
  financialDetails: {
    trailingRevenueCurrency?: string
    trailingRevenueAmount?: number
    trailingEBITDACurrency?: string
    trailingEBITDAAmount?: number
    avgRevenueGrowth?: number
    netIncome?: number
    askingPrice?: number
    finalSalePrice?: number
  }
  businessModel: {
    recurringRevenue?: boolean
    projectBased?: boolean
    assetLight?: boolean
    assetHeavy?: boolean
  }
  managementPreferences: {
    retiringDivesting?: boolean
    staffStay?: boolean
  }
  buyerFit: {
    capitalAvailability?: string
    minPriorAcquisitions?: number
    minTransactionSize?: number
  }
  targetedBuyers: string[]
  interestedBuyers: string[]
  tags: string[]
  isPublic: boolean
  isFeatured: boolean
  stakePercentage?: number
  documents: DealDocument[]
  timeline: {
    createdAt: string
    updatedAt: string
    publishedAt?: string
    completedAt?: string
  }
  invitationStatus?: InvitationStatus
}

interface Buyer {
  _id: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  companyName: string
  status: string
  invitedAt: string
  lastActivity?: string
}

interface StatusSummary {
  deal: Deal
  buyersByStatus: {
    active: Buyer[]
    pending: Buyer[]
    rejected: Buyer[]
  }
  summary: {
    totalTargeted: number
    totalActive: number
    totalPending: number
    totalRejected: number
  }
}

interface MatchedBuyer {
  _id: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  companyName: string
  description?: string
  preferences: {
    stopSendingDeals: boolean
    dontShowMyDeals: boolean
    dontSendDealsToMyCompetitors: boolean
    allowBuyerLikeDeals: boolean
  }
  targetCriteria: {
    countries: string[]
    industrySectors: string[]
    revenueMin?: number
    revenueMax?: number
    ebitdaMin?: number
    ebitdaMax?: number
    transactionSizeMin?: number
    transactionSizeMax?: number
    revenueGrowth?: number
    minStakePercent?: number
    minYearsInBusiness?: number
    preferredBusinessModels: string[]
    managementTeamPreference: string[]
    description?: string
  }
  totalMatchScore: number
  matchPercentage: number
  matchDetails: {
    industryMatch: boolean
    geographyMatch: boolean
    revenueMatch: boolean
    ebitdaMatch: boolean
    transactionSizeMatch: boolean
    businessModelMatch: boolean
    managementMatch: boolean
    yearsMatch: boolean
  }
}

export default function DealDetailsPage() {
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusSummary, setStatusSummary] = useState<StatusSummary | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
  const [matchedBuyers, setMatchedBuyers] = useState<MatchedBuyer[]>([])
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([])
  const [loadingBuyers, setLoadingBuyers] = useState(false)
  const [sending, setSending] = useState(false)
  const [showBuyersForNewDeal, setShowBuyersForNewDeal] = useState(false)
  const [selectAllDropdownOpen, setSelectAllDropdownOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout } = useAuth()
  const dealId = searchParams.get("id")

  // Fetch seller profile
  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001"

        const response = await fetch(`${apiUrl}/sellers/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setSellerProfile(data)
          setUserProfile({
            fullName: data.fullName,
            location: data.companyName,
            phone: data.email,
            profilePicture: data.profilePicture,
          })
        }
      } catch (error) {
        console.error("Error fetching seller profile:", error)
      }
    }
    fetchSellerProfile()
  }, [])

  // Fetch deal details
  useEffect(() => {
    if (!dealId) {
      router.push("/seller/dashboard")
      return
    }

    const fetchDealDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001"

        if (!token) {
          router.push("/seller/login?error=no_token")
          return
        }

        const response = await fetch(`${apiUrl}/deals/${dealId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setDeal(data)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching deal details:", err)
        setError(err.message || "Failed to load deal details")

        if (err.message.includes("Authentication") || err.message.includes("Forbidden")) {
          router.push("/seller/login?error=auth_failed")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDealDetails()
  }, [dealId, router])

  // Fetch status summary
  const fetchStatusSummary = async () => {
    try {
      setLoadingBuyers(true)
      const token = localStorage.getItem("token")
      const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001"

      const response = await fetch(`${apiUrl}/deals/${dealId}/status-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()

        // Process invitation status to create buyer list
        const processedBuyers: Buyer[] = []

        if (data.deal?.invitationStatus) {
          // Get all buyer IDs
          const buyerIds = Object.keys(data.deal.invitationStatus)

          // Fetch buyer details for each buyer ID
          const buyerDetailsPromises = buyerIds.map(async (buyerId) => {
            try {
              const buyerResponse = await fetch(`${apiUrl}/buyers/${buyerId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })

              if (buyerResponse.ok) {
                return await buyerResponse.json()
              } else {
                console.error(`Failed to fetch buyer ${buyerId}:`, buyerResponse.status)
                return null
              }
            } catch (error) {
              console.error(`Error fetching buyer ${buyerId}:`, error)
              return null
            }
          })

          // Wait for all buyer details to be fetched
          const buyerDetails = await Promise.all(buyerDetailsPromises)

          // Combine invitation status with buyer details
          for (let i = 0; i < buyerIds.length; i++) {
            const buyerId = buyerIds[i]
            const invitation = data.deal.invitationStatus[buyerId]
            const buyerInfo = buyerDetails[i]

            processedBuyers.push({
              _id: buyerId,
              buyerId: buyerId,
              buyerName: buyerInfo?.fullName || buyerInfo?.name || `Buyer ${buyerId.slice(-4)}`,
              buyerEmail: buyerInfo?.email || "Email not available",
              companyName: buyerInfo?.companyName || buyerInfo?.company || "Company not available",
              status: invitation.response || "pending",
              invitedAt: invitation.invitedAt,
              lastActivity: invitation.respondedAt,
            })
          }
        }

        // Categorize buyers by status
        const categorizedBuyers = {
          active: processedBuyers.filter((buyer) => buyer.status === "accepted" || buyer.status === "interested"),
          pending: processedBuyers.filter((buyer) => buyer.status === "pending" || !buyer.status),
          rejected: processedBuyers.filter((buyer) => buyer.status === "rejected" || buyer.status === "declined"),
        }

        // Update the data structure with processed buyers
        const updatedData = {
          ...data,
          buyersByStatus: categorizedBuyers,
          summary: {
            totalTargeted: processedBuyers.length,
            totalActive: categorizedBuyers.active.length,
            totalPending: categorizedBuyers.pending.length,
            totalRejected: categorizedBuyers.rejected.length,
          },
        }

        setStatusSummary(updatedData)
      } else {
        console.error("Failed to fetch status summary:", response.status)
      }
    } catch (error) {
      console.error("Error fetching status summary:", error)
    } finally {
      setLoadingBuyers(false)
    }
  }

  useEffect(() => {
    if (!dealId) return

    fetchStatusSummary()
  }, [dealId])

  // Check for newly created deal and fetch matching buyers
  useEffect(() => {
    const isNewDeal = searchParams.get("newDeal")

    if (isNewDeal === "true" && deal) {
      setShowBuyersForNewDeal(true)

      const fetchMatchingBuyers = async () => {
        try {
          setLoadingBuyers(true)
          const token = localStorage.getItem("token")
          const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001"

          const response = await fetch(`${apiUrl}/deals/${dealId}/matching-buyers`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            const buyers = await response.json()
            setMatchedBuyers(buyers)
          } else {
            setMatchedBuyers([])
          }
        } catch (error) {
          console.error("Error fetching matching buyers:", error)
          setMatchedBuyers([])
        } finally {
          setLoadingBuyers(false)
        }
      }

      fetchMatchingBuyers()
    }
  }, [deal, dealId, searchParams])

  const handleLogout = () => {
    logout()
    router.push("/seller/login")
  }

  // Helper functions
  const getBusinessModel = (model: Deal["businessModel"]): string => {
    const models = []
    if (model.recurringRevenue) models.push("Recurring Revenue")
    if (model.projectBased) models.push("Project-Based")
    if (model.assetLight) models.push("Asset Light")
    if (model.assetHeavy) models.push("Asset Heavy")
    return models.length > 0 ? models[0] : "Not specified"
  }

  const getManagementPreferences = (prefs: Deal["managementPreferences"]): string => {
    if (prefs.retiringDivesting && prefs.staffStay) return "Retiring to diversity"
    if (prefs.retiringDivesting) return "Owner(s) Departing"
    if (prefs.staffStay) return "Management Team Staying"
    return "Not specified"
  }

  const formatCurrency = (amount = 0, currency = "USD($)"): string => {
    const currencySymbol = currency.includes("USD")
      ? "$"
      : currency.includes("EUR")
        ? "€"
        : currency.includes("GBP")
          ? "£"
          : "$"
    return `${currencySymbol}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string): string => {
    if (!status) {
      return "bg-gray-100 text-gray-700"
    }

    switch (status.toLowerCase()) {
      case "active":
      case "accepted":
      case "interested":
        return "bg-green-100 text-green-700"
      case "pending":
      case "invited":
      case "viewed":
        return "bg-blue-100 text-blue-700"
      case "rejected":
      case "passed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const downloadDocument = (doc: DealDocument) => {
    const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001"
    const link = document.createElement("a")
    link.href = `${apiUrl}/uploads/deal-documents/${doc.filename}`
    link.download = doc.originalName
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleBuyerSelection = (buyerId: string) => {
    setSelectedBuyers((prev) => {
      const newSelection = prev.includes(buyerId) ? prev.filter((id) => id !== buyerId) : [...prev, buyerId]
      return newSelection
    })
  }

  const selectAllBuyers = () => {
    const allBuyerIds = matchedBuyers.map((buyer) => buyer._id)
    setSelectedBuyers(allBuyerIds)
    setSelectAllDropdownOpen(false)
  }

  const deselectAllBuyers = () => {
    setSelectedBuyers([])
    setSelectAllDropdownOpen(false)
  }

  const handleSendInvite = async (buyerIds?: string[]) => {
    const targetBuyers = buyerIds || selectedBuyers

    if (targetBuyers.length === 0) {
      toast({
        title: "No buyers selected",
        description: "Please select at least one buyer to send an invite",
        variant: "destructive",
      })
      return
    }

    if (!dealId) {
      toast({
        title: "No deal available",
        description: "No deal ID found to send invites for.",
        variant: "destructive",
      })
      return
    }

    try {
      setSending(true)
      const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001"
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in again",
          variant: "destructive",
        })
        router.push("/seller/login")
        return
      }

      // Extract the correct buyer IDs from the matched buyers data
      const actualBuyerIds = targetBuyers
        .map((selectedProfileId) => {
          const buyerProfile = matchedBuyers.find((b) => b._id === selectedProfileId)

          if (!buyerProfile || !buyerProfile.buyerId) {
            return null
          }

          return buyerProfile.buyerId
        })
        .filter(Boolean)

      if (actualBuyerIds.length === 0) {
        toast({
          title: "Error",
          description: "No valid buyer IDs found. Please try again.",
          variant: "destructive",
        })
        return
      }

      const requestBody = { buyerIds: actualBuyerIds }

      const response = await fetch(`${apiUrl}/deals/${dealId}/target-buyers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      toast({
        title: "Invites sent successfully",
        description: `Sent invites to ${actualBuyerIds.length} buyer(s)`,
      })

      // Hide buyers section after sending invites
      setShowBuyersForNewDeal(false)

      // Clear selected buyers
      setSelectedBuyers([])

      // Refresh the status summary
      fetchStatusSummary()
    } catch (error: any) {
      console.error("Error sending invites:", error)
      toast({
        title: "Error sending invites",
        description: error.message || "Failed to send invites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleSingleInvite = async (buyerId: string) => {
    await handleSendInvite([buyerId])
  }

  return (
    <SellerProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
          <div className="mb-8">
            <Link href="/seller/dashboard">
              <Image src="/logo.svg" alt="CIM Amplify Logo" width={150} height={50} className="h-auto" />
            </Link>
          </div>

          <nav className="flex-1 space-y-6">
            <Button
              variant="secondary"
              className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200"
              onClick={() => router.push("/seller/dashboard")}
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

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 font-normal"
              onClick={() => router.push("/seller/view-profile")}
            >
              <Eye className="h-5 w-5" />
              <span>View Profile</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 font-normal"
              onClick={() => router.push("/seller/history")}
            >
              <Clock className="h-5 w-5" />
              <span>Off Market</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 font-normal text-red-600 hover:text-red-700 hover:bg-red-50 mt-auto"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.push("/seller/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                {showBuyersForNewDeal ? "Choose Buyers" : "Buyer Status Summary"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium">{userProfile?.fullName || sellerProfile?.fullName || "User"}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium overflow-hidden">
                {userProfile?.profilePicture || sellerProfile?.profilePicture ? (
                  <img
                    src={userProfile?.profilePicture || sellerProfile?.profilePicture || "/placeholder.svg"}
                    alt={userProfile?.fullName || sellerProfile?.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (sellerProfile?.fullName || "U").charAt(0)
                )}
              </div>
            </div>
          </header>

          {/* Matched Buyers Section - Show only for new deals */}
          {showBuyersForNewDeal && (
            <div className="p-6">
              {loadingBuyers ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3aafa9] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading matching buyers...</p>
                  </div>
                </div>
              ) : matchedBuyers.length > 0 ? (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex justify-between items-center mb-6 space-x-4">
                    <h2 className="text-lg font-medium">
                      Your deal has been matched to the following buyers. Please pick the buyers you wish to engage
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="space-x-4 flex">
                        <Button
                          variant="default"
                          className="bg-teal-500 hover:bg-teal-600"
                          onClick={() => handleSendInvite()}
                          disabled={selectedBuyers.length === 0 || sending}
                        >
                          {sending ? "Sending..." : `Send Invite${selectedBuyers.length > 1 ? "s" : ""}`}
                          {selectedBuyers.length > 0 && ` (${selectedBuyers.length})`}
                        </Button>
                        <div className="relative">
                          <Button
                            variant="outline"
                            className="flex items-center"
                            onClick={() => setSelectAllDropdownOpen(!selectAllDropdownOpen)}
                          >
                            Select All{" "}
                            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </Button>
                          {selectAllDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={selectAllBuyers}
                                >
                                  Select All
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={deselectAllBuyers}
                                >
                                  Deselect All
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchedBuyers.map((buyer) => (
                      <div key={buyer._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 flex items-start">
                          <Checkbox
                            id={`buyer-${buyer._id}`}
                            checked={selectedBuyers.includes(buyer._id)}
                            onCheckedChange={() => toggleBuyerSelection(buyer._id)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-medium text-teal-500">{buyer.companyName || "Anonymous"}</h3>
                            </div>

                            <div className="mb-6">
                              <h4 className="font-medium mb-2">Overview</h4>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="text-gray-500">Name: </span>
                                  {buyer.buyerName || "Unknown"}
                                </div>
                                <div>
                                  <span className="text-gray-500">Email: </span>
                                  {buyer.buyerEmail || "Not provided"}
                                </div>
                              </div>
                            </div>

                            <div className="mb-6">
                              <h4 className="font-medium mb-2">Target Criteria</h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div>
                                  <span className="text-gray-500">Revenue Range: </span>$
                                  {buyer.targetCriteria?.revenueMin?.toLocaleString() || 0} - $
                                  {buyer.targetCriteria?.revenueMax?.toLocaleString() || "∞"}
                                </div>
                                <div>
                                  <span className="text-gray-500">EBITDA Range: </span>$
                                  {buyer.targetCriteria?.ebitdaMin?.toLocaleString() || 0} - $
                                  {buyer.targetCriteria?.ebitdaMax?.toLocaleString() || "∞"}
                                </div>
                                <div>
                                  <span className="text-gray-500">Transaction Size: </span>$
                                  {buyer.targetCriteria?.transactionSizeMin?.toLocaleString() || 0} - $
                                  {buyer.targetCriteria?.transactionSizeMax?.toLocaleString() || "∞"}
                                </div>
                                <div>
                                  <span className="text-gray-500">Revenue Growth: </span>
                                  {buyer.targetCriteria?.revenueGrowth || "Any"}%
                                </div>
                                <div>
                                  <span className="text-gray-500">Min Years in Business: </span>
                                  {buyer.targetCriteria?.minYearsInBusiness || "Any"}
                                </div>
                                <div className="col-span-2">
                                  <span className="text-gray-500">Description of ideal targets: </span>
                                  {buyer.description || "Not provided"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 text-right">
                          <Button
                            variant="default"
                            className="bg-teal-500 hover:bg-teal-600"
                            onClick={() => handleSingleInvite(buyer._id)}
                            disabled={sending}
                          >
                            {sending ? "Sending..." : "Send Invite"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600 mb-6">
                  No buyers are matched for this deal
                </div>
              )}
            </div>
          )}

          {/* Deal Details Content */}
          <div className="p-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-6">
                <Skeleton className="h-8 w-1/3 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-red-500 text-lg mb-2">Error loading deal details</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => router.push("/seller/dashboard")}>Back to Dashboard</Button>
              </div>
            ) : deal ? (
              <>
                {/* Buyer Status Summary */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg text-[#0D9488] font-medium">{deal.title}</h3>
                  </div>

                  <div className="p-6">
                    {loadingBuyers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3aafa9] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading buyer status...</p>
                      </div>
                    ) : statusSummary ? (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-500 text-sm">Total Targeted</span>
                              <Users className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="text-2xl font-semibold">{statusSummary.summary.totalTargeted}</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-green-600 text-sm">Active</span>
                              <Users className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="text-2xl font-semibold">{statusSummary.summary.totalActive}</div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-blue-600 text-sm">Pending</span>
                              <Clock3 className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="text-2xl font-semibold">{statusSummary.summary.totalPending}</div>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-red-600 text-sm">Rejected</span>
                              <XCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="text-2xl font-semibold">{statusSummary.summary.totalRejected}</div>
                          </div>
                        </div>

                        {/* Active Buyers */}
                        {statusSummary.buyersByStatus.active.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-md font-medium mb-3 text-green-700">Active Buyers</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 font-medium text-gray-600">Buyer</th>
                                    <th className="pb-3 font-medium text-gray-600">Company</th>
                                    <th className="pb-3 font-medium text-gray-600">Status</th>
                                    <th className="pb-3 font-medium text-gray-600">Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {statusSummary.buyersByStatus.active.map((buyer) => (
                                    <tr key={buyer._id} className="border-b border-gray-100">
                                      <td className="py-4">
                                        <div className="flex items-center">
                                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                                            {buyer.buyerName &&
                                            buyer.buyerName !== `Buyer ${buyer.buyerId.slice(-4)}` ? (
                                              buyer.buyerName.charAt(0).toUpperCase()
                                            ) : (
                                              <User className="h-5 w-5" />
                                            )}
                                          </div>
                                          <div>
                                            <p className="font-medium">{buyer.buyerName}</p>
                                            <p className="text-sm text-gray-500">{buyer.buyerEmail}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-4">
                                        <span
                                          className={
                                            buyer.companyName === "Company not available" ? "text-gray-500 text-sm" : ""
                                          }
                                        >
                                          {buyer.companyName}
                                        </span>
                                      </td>
                                      <td className="py-4">
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(
                                            buyer.status,
                                          )}`}
                                        >
                                          {buyer.status}
                                        </span>
                                      </td>
                                      <td className="py-4">{formatDate(buyer.invitedAt)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Pending Buyers */}
                        {statusSummary.buyersByStatus.pending.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-md font-medium mb-3 text-blue-700">Pending Buyers</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 font-medium text-gray-600">Buyer</th>
                                    <th className="pb-3 font-medium text-gray-600">Company</th>
                                    <th className="pb-3 font-medium text-gray-600">Status</th>
                                    <th className="pb-3 font-medium text-gray-600">Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {statusSummary.buyersByStatus.pending.map((buyer) => (
                                    <tr key={buyer._id} className="border-b border-gray-100">
                                      <td className="py-4">
                                        <div className="flex items-center">
                                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                                            {buyer.buyerName &&
                                            buyer.buyerName !== `Buyer ${buyer.buyerId.slice(-4)}` ? (
                                              buyer.buyerName.charAt(0).toUpperCase()
                                            ) : (
                                              <User className="h-5 w-5" />
                                            )}
                                          </div>
                                          <div>
                                            <p className="font-medium">{buyer.buyerName}</p>
                                            <p className="text-sm text-gray-500">{buyer.buyerEmail}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-4">
                                        <span
                                          className={
                                            buyer.companyName === "Company not available" ? "text-gray-500 text-sm" : ""
                                          }
                                        >
                                          {buyer.companyName}
                                        </span>
                                      </td>
                                      <td className="py-4">
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(
                                            buyer.status,
                                          )}`}
                                        >
                                          {buyer.status}
                                        </span>
                                      </td>
                                      <td className="py-4">{formatDate(buyer.invitedAt)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Rejected Buyers */}
                        {statusSummary.buyersByStatus.rejected.length > 0 && (
                          <div>
                            <h4 className="text-md font-medium mb-3 text-red-700">Rejected Buyers</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 font-medium text-gray-600">Buyer</th>
                                    <th className="pb-3 font-medium text-gray-600">Company</th>
                                    <th className="pb-3 font-medium text-gray-600">Status</th>
                                    <th className="pb-3 font-medium text-gray-600">Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {statusSummary.buyersByStatus.rejected.map((buyer) => (
                                    <tr key={buyer._id} className="border-b border-gray-100">
                                      <td className="py-4">
                                        <div className="flex items-center">
                                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                                            {buyer.buyerName &&
                                            buyer.buyerName !== `Buyer ${buyer.buyerId.slice(-4)}` ? (
                                              buyer.buyerName.charAt(0).toUpperCase()
                                            ) : (
                                              <User className="h-5 w-5" />
                                            )}
                                          </div>
                                          <div>
                                            <p className="font-medium">{buyer.buyerName}</p>
                                            <p className="text-sm text-gray-500">{buyer.buyerEmail}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-4">
                                        <span
                                          className={
                                            buyer.companyName === "Company not available" ? "text-gray-500 text-sm" : ""
                                          }
                                        >
                                          {buyer.companyName}
                                        </span>
                                      </td>
                                      <td className="py-4">
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(
                                            buyer.status,
                                          )}`}
                                        >
                                          {buyer.status}
                                        </span>
                                      </td>
                                      <td className="py-4">{formatDate(buyer.invitedAt)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* No buyers case */}
                        {statusSummary.summary.totalTargeted === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No buyers have been invited yet</p>
                            <Button
                              className="bg-teal-500 hover:bg-teal-600"
                              onClick={() => router.push(`/seller/dashboard?newDeal=${dealId}&success=true`)}
                            >
                              Invite Buyers
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Failed to load buyer status information</p>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/seller/dashboard?newDeal=${dealId}&success=true`)}
                        >
                          Back to Dashboard
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-gray-500 text-lg mb-2">Deal not found</div>
                <Button onClick={() => router.push("/seller/dashboard")}>Back to Dashboard</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </SellerProtectedRoute>
  )
}
