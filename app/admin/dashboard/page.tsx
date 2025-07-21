"use client";

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download } from "lucide-react";
import Image from "next/image";
import {Tag , ShoppingCart, Eye, Handshake} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Users, Building2, Clock, LogOut, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface DocumentInfo {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}
interface SellerProfile {
  _id: string;
  fullName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  website: string;
  role: string;
  profilePicture: string | null;
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
  sellerProfile?: SellerProfile;
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
  rewardLevel?: string;
  closedWithBuyer?: string; // New field for buyer ID
  closedWithBuyerCompany?: string; // New field for buyer company
  closedWithBuyerEmail?: string; // New field for buyer email
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
    ...(buyersActivity.active || []).map((b) => ({ ...b, status: "active" })),
    ...(buyersActivity.pending || []).map((b) => ({ ...b, status: "pending" })),
    ...(buyersActivity.rejected || []).map((b) => ({
      ...b,
      status: "rejected",
    })),
  ].forEach((buyer) => {
    if (!buyerMap.has(buyer.buyerId)) {
      buyerMap.set(buyer.buyerId, buyer);
    } else {
      const existing = buyerMap.get(buyer.buyerId)!;
      existing.interactions = [
        ...(existing.interactions || []),
        ...(buyer.interactions || []),
      ].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      existing.lastInteraction =
        existing.interactions?.[0]?.timestamp || existing.lastInteraction;
      existing.totalInteractions =
        existing.interactions?.length || existing.totalInteractions;
    }
  });
  const allBuyers = Array.from(buyerMap.values());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Buyer's Activity
            </h2>
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
                      {buyer.buyerName
                        ? buyer.buyerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {buyer.buyerName || "Unknown"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {buyer.buyerEmail || ""}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      buyer.status
                    )}`}
                  >
                    {buyer.status.charAt(0).toUpperCase() +
                      buyer.status.slice(1)}
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
              <h3 className="text-lg font-semibold text-gray-800">
                Buyer Details
              </h3>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedBuyer.buyerName || "Unknown"}
              </p>
              <p>
                <strong>Email:</strong> {selectedBuyer.buyerEmail || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {selectedBuyer.buyerCompany || "N/A"}
              </p>
              {selectedBuyer.companyType && (
                <p>
                  <strong>Company Type:</strong> {selectedBuyer.companyType}
                </p>
              )}
              {selectedBuyer.lastInteraction && (
                <p>
                  <strong>Last Interaction:</strong>{" "}
                  {new Date(selectedBuyer.lastInteraction).toLocaleString()}
                </p>
              )}
              {selectedBuyer.interactions &&
                selectedBuyer.interactions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mt-4">
                      Interactions
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {selectedBuyer.interactions.map((interaction, index) => (
                        <li key={index}>
                          {interaction.type.charAt(0).toUpperCase() +
                            interaction.type.slice(1)}{" "}
                          - {new Date(interaction.timestamp).toLocaleString()} -{" "}
                          {interaction.notes}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setSelectedBuyer(null)}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- AdminEditDealForm component (adapted from seller/edit-deal/page.tsx) ---

function formatNumberWithCommas(num) {
  if (num === undefined || num === null) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const COMPANY_TYPE_OPTIONS = [
  "Buy Side Mandate",
  "Entrepreneurship through Acquisition",
  "Family Office",
  "Holding Company",
  "Independent Sponsor",
  "Private Equity",
  "Single Acquisition Search",
  "Strategic Operating Company",
];

function AdminEditDealForm({ deal, onClose, onSaved }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!deal) return;
    setForm({
      title: deal.title || "",
      companyDescription: deal.companyDescription || "",
      industrySector: deal.industrySector || "",
      geographySelection: deal.geographySelection || "",
      yearsInBusiness: deal.yearsInBusiness || 0,
      companyType: Array.isArray(deal.companyType) ? deal.companyType : (deal.companyType ? [deal.companyType] : []),
      financialDetails: {
        trailingRevenueCurrency: deal.financialDetails?.trailingRevenueCurrency || "USD($)",
        trailingRevenueAmount: deal.financialDetails?.trailingRevenueAmount || 0,
        trailingEBITDACurrency: deal.financialDetails?.trailingEBITDACurrency || "USD($)",
        trailingEBITDAAmount: deal.financialDetails?.trailingEBITDAAmount || 0,
        avgRevenueGrowth: deal.financialDetails?.avgRevenueGrowth || 0,
        netIncome: deal.financialDetails?.netIncome || 0,
        askingPrice: deal.financialDetails?.askingPrice || 0,
        t12FreeCashFlow: deal.financialDetails?.t12FreeCashFlow || 0,
        t12NetIncome: deal.financialDetails?.t12NetIncome || 0,
      },
      businessModel: {
        recurringRevenue: deal.businessModel?.recurringRevenue || false,
        projectBased: deal.businessModel?.projectBased || false,
        assetLight: deal.businessModel?.assetLight || false,
        assetHeavy: deal.businessModel?.assetHeavy || false,
      },
      managementPreferences: deal.managementPreferences || "",
      buyerFit: {
        capitalAvailability: deal.buyerFit?.capitalAvailability || [],
        minPriorAcquisitions: deal.buyerFit?.minPriorAcquisitions || 0,
        minTransactionSize: deal.buyerFit?.minTransactionSize || 0,
      },
      documents: [],
      visibility: deal.visibility || "seed",
      status: deal.status || "active",
    });
    setExistingDocuments(deal.documents || []);
  }, [deal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleNumberChange = (e, field, nested) => {
    const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value);
    if (nested) {
      setForm((prev) => ({ ...prev, [nested]: { ...prev[nested], [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };
  const handleCheckboxChange = (checked, field, nested) => {
    if (nested) {
      setForm((prev) => ({ ...prev, [nested]: { ...prev[nested], [field]: checked } }));
    } else {
      setForm((prev) => ({ ...prev, [field]: checked }));
    }
  };
  const handleMultiSelectChange = (option) => {
    setForm((prev) => {
      const currentValues = Array.isArray(prev.companyType) ? prev.companyType : [];
      const isChecked = currentValues.includes(option);
      const newValues = isChecked ? currentValues.filter((v) => v !== option) : [...currentValues, option];
      return { ...prev, companyType: newValues };
    });
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [];
      let hasError = false;
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.size > 10 * 1024 * 1024) {
          setFileError(`File ${file.name} exceeds 10MB limit`);
          hasError = true;
          break;
        }
        newFiles.push(file);
      }
      if (!hasError) {
        setSelectedFile(e.target.files[0]);
        setFileError(null);
        setForm((prev) => ({ ...prev, documents: [...(prev.documents || []), ...newFiles] }));
      }
    }
  };
  const handleDocumentDelete = async (doc) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const docIndex = existingDocuments.findIndex((d) => d.filename === doc.filename);
      const response = await fetch(`${apiUrl}/deals/${deal._id}/documents/${docIndex}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete document");
      setExistingDocuments(existingDocuments.filter((d) => d.filename !== doc.filename));
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDocumentDownload = (doc) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const link = document.createElement("a");
    link.href = `${apiUrl}/uploads/deal-documents/${doc.filename}`;
    link.download = doc.originalName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleNewDocumentDelete = (indexToRemove) => {
    setForm((prev) => ({ ...prev, documents: prev.documents.filter((_, index) => index !== indexToRemove) }));
    if (form.documents.length === 1) setSelectedFile(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // Prepare payload
      const payload = {
        ...form,
        companyType: Array.isArray(form.companyType) ? form.companyType : [],
        financialDetails: { ...form.financialDetails },
        businessModel: { ...form.businessModel },
        buyerFit: { ...form.buyerFit },
      };
      const res = await fetch(`${apiUrl}/deals/${deal._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update deal");
      }
      // Upload new documents if any
      if (form.documents && form.documents.length > 0) {
        const uploadFormData = new FormData();
        Array.from(form.documents).forEach((file) => {
          uploadFormData.append("files", file);
        });
        const uploadResponse = await fetch(`${apiUrl}/deals/${deal._id}/upload-documents`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadFormData,
        });
        if (!uploadResponse.ok) throw new Error("Failed to upload documents");
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (!form) return <div>Loading...</div>;
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Title</Label>
          <Input name="title" value={form.title} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Company Description</Label>
          <Textarea name="companyDescription" value={form.companyDescription} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Industry Sector</Label>
          <Input name="industrySector" value={form.industrySector} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Geography</Label>
          <Input name="geographySelection" value={form.geographySelection} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Years in Business</Label>
          <Input type="number" name="yearsInBusiness" value={form.yearsInBusiness} onChange={(e) => handleNumberChange(e, "yearsInBusiness")} required />
        </div>
        <div>
          <Label>Company Type</Label>
          <div className="flex flex-wrap gap-2">
            {COMPANY_TYPE_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.companyType.includes(option)}
                  onChange={() => handleMultiSelectChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Trailing 12-Month Revenue</Label>
          <Input
            type="text"
            value={form.financialDetails.trailingRevenueAmount ? formatNumberWithCommas(form.financialDetails.trailingRevenueAmount) : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              handleNumberChange({ target: { value: rawValue } }, "trailingRevenueAmount", "financialDetails");
            }}
          />
        </div>
        <div>
          <Label>Trailing 12-Month EBITDA</Label>
          <Input
            type="text"
            value={form.financialDetails.trailingEBITDAAmount ? formatNumberWithCommas(form.financialDetails.trailingEBITDAAmount) : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              handleNumberChange({ target: { value: rawValue } }, "trailingEBITDAAmount", "financialDetails");
            }}
          />
        </div>
        <div>
          <Label>Average 3-Year Revenue Growth (%)</Label>
          <Input
            type="text"
            value={form.financialDetails.avgRevenueGrowth ? formatNumberWithCommas(form.financialDetails.avgRevenueGrowth) : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              handleNumberChange({ target: { value: rawValue } }, "avgRevenueGrowth", "financialDetails");
            }}
          />
        </div>
        <div>
          <Label>Net Income</Label>
          <Input
            type="text"
            value={form.financialDetails.netIncome ? formatNumberWithCommas(form.financialDetails.netIncome) : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              handleNumberChange({ target: { value: rawValue } }, "netIncome", "financialDetails");
            }}
          />
        </div>
        <div>
          <Label>Asking Price</Label>
          <Input
            type="text"
            value={form.financialDetails.askingPrice ? formatNumberWithCommas(form.financialDetails.askingPrice) : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              handleNumberChange({ target: { value: rawValue } }, "askingPrice", "financialDetails");
            }}
          />
        </div>
        <div>
          <Label>T12 Free Cash Flow</Label>
          <Input
            type="text"
            value={form.financialDetails.t12FreeCashFlow ? formatNumberWithCommas(form.financialDetails.t12FreeCashFlow) : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              handleNumberChange({ target: { value: rawValue } }, "t12FreeCashFlow", "financialDetails");
            }}
          />
        </div>
        <div>
          <Label>T12 Net Income</Label>
          <Input
            type="text"
            value={form.financialDetails.t12NetIncome ? formatNumberWithCommas(form.financialDetails.t12NetIncome) : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              handleNumberChange({ target: { value: rawValue } }, "t12NetIncome", "financialDetails");
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Business Models</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "recurringRevenue", label: "Recurring Revenue" },
              { key: "projectBased", label: "Project Based" },
              { key: "assetLight", label: "Asset Light" },
              { key: "assetHeavy", label: "Asset Heavy" },
            ].map((bm) => (
              <label key={bm.key} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.businessModel[bm.key]}
                  onChange={(e) => handleCheckboxChange(e.target.checked, bm.key, "businessModel")}
                />
                {bm.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label>Management Preferences</Label>
          <Textarea name="managementPreferences" value={form.managementPreferences} onChange={handleInputChange} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Capital Availability</Label>
          <div className="flex flex-wrap gap-2">
            {[
              "Ready to deploy immediately",
              "Need to raise",
            ].map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.buyerFit.capitalAvailability.includes(option)}
                  onChange={() => {
                    setForm((prev) => {
                      const current = prev.buyerFit.capitalAvailability || [];
                      const isChecked = current.includes(option);
                      const newValues = isChecked ? current.filter((v) => v !== option) : [...current, option];
                      return { ...prev, buyerFit: { ...prev.buyerFit, capitalAvailability: newValues } };
                    });
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label>Min Prior Acquisitions</Label>
          <Input
            type="number"
            value={form.buyerFit.minPriorAcquisitions}
            onChange={(e) => handleNumberChange(e, "minPriorAcquisitions", "buyerFit")}
          />
        </div>
        <div>
          <Label>Min Transaction Size</Label>
          <Input
            type="number"
            value={form.buyerFit.minTransactionSize}
            onChange={(e) => handleNumberChange(e, "minTransactionSize", "buyerFit")}
          />
        </div>
      </div>
      {/* Documents Section */}
      <div>
        <Label>Documents</Label>
        {(existingDocuments.length > 0 || (form.documents && form.documents.length > 0)) && (
          <ul className="space-y-2 mb-2">
            {existingDocuments.map((doc, idx) => (
              <li key={doc.filename} className="flex items-center justify-between border rounded-md p-3 bg-blue-50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm text-gray-700">{doc.originalName}</span>
                  <span className="text-xs text-blue-600 ml-2">(Existing)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => handleDocumentDownload(doc)}>
                    <Download className="h-4 w-4 mr-1" />Download
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDocumentDelete(doc)}>
                    <X className="h-4 w-4 mr-1" />Delete
                  </Button>
                </div>
              </li>
            ))}
            {form.documents && form.documents.map((file, idx) => (
              <li key={"new-" + idx} className="flex items-center justify-between border rounded-md p-3 bg-green-50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-green-600 ml-2">(New)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <Button variant="destructive" size="sm" onClick={() => handleNewDocumentDelete(idx)}>
                    <X className="h-4 w-4 mr-1" />Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
        {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
        <p className="text-sm text-gray-500 mt-1">You can upload multiple files. Max size: 10MB per file.</p>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button type="submit" className="bg-teal-500 text-white" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}

export default function DealManagementDashboard() {
  const [editDeal, setEditDeal] = useState<Deal | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [offMarketDeals, setOffMarketDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [showBuyersActivity, setShowBuyersActivity] = useState(false);
  const [selectedDealForActivity, setSelectedDealForActivity] =
    useState<Deal | null>(null);
  const [buyersActivity, setBuyersActivity] = useState<BuyersActivity>({
    active: [],
    pending: [],
    rejected: [],
    summary: {
      totalTargeted: 0,
      totalActive: 0,
      totalPending: 0,
      totalRejected: 0,
    },
  });
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  const [offMarketCurrentPage, setOffMarketCurrentPage] = useState(1);
  const dealsPerPage = 5;
  const [deleteDealId, setDeleteDealId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Add state for Off Market dialog
  const [offMarketDeal, setOffMarketDeal] = useState<Deal | null>(null);
  const [offMarketLoading, setOffMarketLoading] = useState(false);
  const [offMarketError, setOffMarketError] = useState<string | null>(null);

  // --- Off Market Multi-Step Dialog State (copied from seller dashboard) ---
  const [offMarketDialogOpen, setOffMarketDialogOpen] = useState(false);
  const [currentDialogStep, setCurrentDialogStep] = useState(1);
  const [selectedDealForOffMarketDialog, setSelectedDealForOffMarketDialog] = useState<Deal | null>(null);
  const [offMarketData, setOffMarketData] = useState({
    dealSold: null as boolean | null,
    transactionValue: "",
    buyerFromCIM: null as boolean | null,
  });
  const [buyerActivity, setBuyerActivity] = useState<any[]>([]);
  const [selectedWinningBuyer, setSelectedWinningBuyer] = useState<string>("");
  const [buyerActivityLoading, setBuyerActivityLoading] = useState(false);

  // --- Utility copied from seller dashboard ---
  const formatWithCommas = (value: string | number) => {
    const num = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
    if (isNaN(num)) return "";
    return num.toLocaleString();
  };

  // --- Fetch buyer activity for CIM Amplify step ---
  const fetchDealStatusSummary = async (dealId: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/deals/${dealId}/status-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const allBuyerIds = [...data.deal.targetedBuyers, ...data.deal.interestedBuyers];
        const uniqueBuyerIds = [...new Set(allBuyerIds)];
        const buyerDetailsPromises = uniqueBuyerIds.map(async (buyerId) => {
          try {
            const buyerResponse = await fetch(`${apiUrl}/buyers/${buyerId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (buyerResponse.ok) {
              const buyerData = await buyerResponse.json();
              let status = "pending";
              const invitationStatus = data.deal.invitationStatus[buyerId];
              if (invitationStatus) {
                if (invitationStatus.response === "accepted") status = "active";
                else if (invitationStatus.response === "rejected") status = "rejected";
              }
              return {
                buyerId: buyerId,
                buyerName: buyerData.fullName || buyerData.name || "Unknown Buyer",
                companyName: buyerData.companyName || "Unknown Company",
                buyerEmail: buyerData.email || "",
                status: status,
                invitationStatus: invitationStatus,
              };
            }
          } catch (error) {
            return null;
          }
        });
        const buyerDetails = await Promise.all(buyerDetailsPromises);
        const validBuyerDetails = buyerDetails.filter((buyer) => buyer !== null);
        setBuyerActivity(validBuyerDetails);
        const activeBuyer = validBuyerDetails.find((buyer) => buyer && buyer.status === "active");
        if (activeBuyer) setSelectedWinningBuyer(activeBuyer.buyerId);
        return validBuyerDetails;
      }
    } catch (error) {}
    return [];
  };

  // --- Off Market Dialog Handlers ---
  const handleAdminOffMarketClick = (deal: Deal) => {
    setSelectedDealForOffMarketDialog(deal);
    setCurrentDialogStep(1);
    setOffMarketDialogOpen(true);
    setOffMarketData({ dealSold: null, transactionValue: "", buyerFromCIM: null });
    setBuyerActivity([]);
    setSelectedWinningBuyer("");
  };

  const handleAdminDialogResponse = async (key: string, value: boolean) => {
    setOffMarketData((prev) => ({ ...prev, [key]: value }));
    if (key === "dealSold") {
      if (value === false) {
        // Mark deal as off-market (same as seller dashboard)
        if (selectedDealForOffMarketDialog) {
          try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/deals/${selectedDealForOffMarketDialog._id}/close-deal`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            });
            if (!response.ok) {
              // Optionally show error
            }
            setActiveDeals((prev) => prev.filter((d) => d._id !== selectedDealForOffMarketDialog._id));
            setOffMarketDeals((prev) => [selectedDealForOffMarketDialog, ...prev]);
            setOffMarketDialogOpen(false);
          } catch (error) {
            setOffMarketDialogOpen(false);
          }
        } else {
          setOffMarketDialogOpen(false);
        }
      } else {
        setCurrentDialogStep(2);
      }
    }
  };

  const handleAdminOffMarketSubmit = async () => {
    if (!selectedDealForOffMarketDialog || !offMarketData.transactionValue) {
      // Optionally show error
      return;
    }
    // If buyerFromCIM is true, require a selected buyer
    if (offMarketData.buyerFromCIM === true && !selectedWinningBuyer) {
      // Optionally show error
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // Use POST /deals/:id/close for admin (now allowed)
      const body = {
        finalSalePrice: Number.parseFloat(offMarketData.transactionValue),
        ...(offMarketData.buyerFromCIM === true && selectedWinningBuyer ? { winningBuyerId: selectedWinningBuyer } : {}),
      };
      const closeResponse = await fetch(`${apiUrl}/deals/${selectedDealForOffMarketDialog._id}/close`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!closeResponse.ok) {
        setOffMarketDialogOpen(false);
        return;
      }
      setActiveDeals((prev) => prev.filter((d) => d._id !== selectedDealForOffMarketDialog._id));
      setOffMarketDeals((prev) => [selectedDealForOffMarketDialog, ...prev]);
      setOffMarketDialogOpen(false);
      setCurrentDialogStep(1);
      setSelectedDealForOffMarketDialog(null);
      setOffMarketData({ dealSold: null, transactionValue: "", buyerFromCIM: null });
      setBuyerActivity([]);
      setSelectedWinningBuyer("");
    } catch (error) {
      setOffMarketDialogOpen(false);
    }
  };

  // --- Buyer activity fetch for CIM step ---
  useEffect(() => {
    if (offMarketDialogOpen && selectedDealForOffMarketDialog && offMarketData.buyerFromCIM === true) {
      setBuyerActivity([]);
      setBuyerActivityLoading(true);
      fetchDealStatusSummary(selectedDealForOffMarketDialog._id).finally(() => setBuyerActivityLoading(false));
    }
  }, [offMarketDialogOpen, selectedDealForOffMarketDialog, offMarketData.buyerFromCIM]);

  const router = useRouter();
  const { logout } = useAuth();

  // Add admin profile state
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
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

  // Replace your setActiveDeals and setOffMarketDeals with this logic:
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch active deals
        const activeResponse = await fetch(`${apiUrl}/deals/active-accepted`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!activeResponse.ok) throw new Error("Failed to fetch active deals");
        const activeData = await activeResponse.json();
        const activeDealsArray = Array.isArray(activeData)
          ? activeData
          : [activeData];

        // Fetch seller profiles for active deals
        const activeDealsWithSellers = await Promise.all(
          activeDealsArray.map(async (deal) => {
            try {
              const sellerRes = await fetch(
                `${apiUrl}/sellers/public/${deal.seller}`
              );
              if (sellerRes.ok) {
                const sellerProfile = await sellerRes.json();
                console.log("Seller profile for deal", deal._id, sellerProfile); // <-- Add this
                return { ...deal, sellerProfile };
              }
              return deal;
            } catch {
              return deal;
            }
          })
        );
        setActiveDeals(activeDealsWithSellers);

        // Fetch off-market deals
        const offMarketResponse = await fetch(
          `${apiUrl}/deals/admin/completed/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!offMarketResponse.ok)
          throw new Error("Failed to fetch off-market deals");
        const offMarketData = await offMarketResponse.json();
        const offMarketDealsArray = Array.isArray(offMarketData)
          ? offMarketData
          : [offMarketData];

        // Fetch seller profiles for off-market deals
        const offMarketDealsWithSellers = await Promise.all(
          offMarketDealsArray.map(async (deal) => {
            try {
              const sellerRes = await fetch(
                `${apiUrl}/sellers/public/${deal.seller}`
              );
              if (sellerRes.ok) {
                const sellerProfile = await sellerRes.json();
                return { ...deal, sellerProfile };
              }
              return deal;
            } catch {
              return deal;
            }
          })
        );
        setOffMarketDeals(offMarketDealsWithSellers);

        setError(null);
      } catch (error: any) {
        setActiveDeals([]);
        setOffMarketDeals([]);
        setError(error.message);
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    if (activeTab === "active") {
      setActiveCurrentPage(1);
    } else if (activeTab === "offMarket") {
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
    router.push("/admin/login");
  };
  const handleEditDeal = (deal: Deal) => {
    setEditDeal(deal);
    setEditForm({
      ...deal,
      ...(deal.financialDetails || {}),
    });
    setEditError(null);
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
      summary: {
        totalTargeted: 0,
        totalActive: 0,
        totalPending: 0,
        totalRejected: 0,
      },
    });
    setActivityError(null);
    setShowBuyersActivity(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deals/${deal._id}/status-summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch buyers activity");
      }
      const data = await res.json();
      setBuyersActivity({
        active: data.buyersByStatus.active || [],
        pending: data.buyersByStatus.pending || [],
        rejected: data.buyersByStatus.rejected || [],
        summary: data.summary || {
          totalTargeted: 0,
          totalActive: 0,
          totalPending: 0,
          totalRejected: 0,
        },
      });
    } catch (error: any) {
      setActivityError(error.message);
      setBuyersActivity({
        active: [],
        pending: [],
        rejected: [],
        summary: {
          totalTargeted: 0,
          totalActive: 0,
          totalPending: 0,
          totalRejected: 0,
        },
      });
    }
  };

  const handleDownloadDocument = async (
    dealId: string,
    filename: string,
    originalName: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deals/${dealId}/document/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download document");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading document:", error);
      alert(`Failed to download document: ${error.message}`);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    console.log("handleDeleteDeal called for deal:", dealId);
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // Try DELETE first
      let response = await fetch(`${apiUrl}/deals/${dealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Delete API response:", response.status);
      // If forbidden, try with dummy userId in body (for admin)
      if (response.status === 403 || response.status === 400) {
        // Try POST or PATCH if your backend expects it, or pass userId in body
        const userId = localStorage.getItem("userId") || "admin";
        response = await fetch(`${apiUrl}/deals/${dealId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        console.log("Delete API retry response:", response.status);
      }
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        console.error("Delete API error:", errorData);
        throw new Error(errorData.message || "Failed to delete deal");
      }
      // Remove from UI
      setActiveDeals((prev) => prev.filter((d) => d._id !== dealId));
      setOffMarketDeals((prev) => prev.filter((d) => d._id !== dealId));
      setDeleteDealId(null);
    } catch (error: any) {
      setDeleteError(error.message);
      console.error("handleDeleteDeal error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handler to open Off Market dialog
  const handleOffMarketClick = (deal: Deal) => {
    setOffMarketDeal(deal);
    setOffMarketError(null);
  };

  // Handler to confirm Off Market
  const handleConfirmOffMarket = async () => {
    if (!offMarketDeal) return;
    setOffMarketLoading(true);
    setOffMarketError(null);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/deals/${offMarketDeal._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) {
        let errorData;
        try { errorData = await res.json(); } catch { errorData = {}; }
        throw new Error(errorData.message || "Failed to mark deal as off market");
      }
      // Move deal to Off Market tab
      setActiveDeals((prev) => prev.filter((d) => d._id !== offMarketDeal._id));
      setOffMarketDeals((prev) => [offMarketDeal, ...prev]);
      setOffMarketDeal(null);
    } catch (error: any) {
      setOffMarketError(error.message);
    } finally {
      setOffMarketLoading(false);
    }
  };

  // Filter out completed deals from activeDeals before using in Active tab
  const filteredActiveDeals = activeDeals.filter(
    (deal) => deal.status !== "completed"
  );

  const getTabCount = (tab: string) => {
    if (tab === "active") {
      return filteredActiveDeals.length;
    } else if (tab === "offMarket") {
      return offMarketDeals.length;
    }
    return 0;
  };

  // Filtered deals for each tab
  const filteredActive = filteredActiveDeals.filter(
    (deal) =>
      (deal.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.industrySector || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (deal.geographySelection || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (deal.companyDescription || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  const filteredOffMarket = offMarketDeals.filter(
    (deal) =>
      (deal.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.industrySector || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (deal.geographySelection || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (deal.companyDescription || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Pagination logic for each tab
  const activeTotalPages = Math.ceil(filteredActive.length / dealsPerPage);
  const offMarketTotalPages = Math.ceil(
    filteredOffMarket.length / dealsPerPage
  );
  const activeStartIndex = (activeCurrentPage - 1) * dealsPerPage;
  const activeEndIndex = activeStartIndex + dealsPerPage;
  const offMarketStartIndex = (offMarketCurrentPage - 1) * dealsPerPage;
  const offMarketEndIndex = offMarketStartIndex + dealsPerPage;
  const currentActiveDeals = filteredActive.slice(
    activeStartIndex,
    activeEndIndex
  );
  const currentOffMarketDeals = filteredOffMarket.slice(
    offMarketStartIndex,
    offMarketEndIndex
  );

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
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3aafa9] mb-4"></div>
            <span className="text-gray-600 text-lg">Loading deals...</span>
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
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3aafa9] mb-4"></div>
            <span className="text-gray-600 text-lg">Loading deals...</span>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get image src with cache busting only for real URLs
  function getProfileImageSrc(src?: string | null) {
    if (!src) return undefined;
    if (src.startsWith('data:')) return src;
    return src + `?cb=${Date.now()}`;
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
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 font-normal bg-teal-100 text-teal-700 hover:bg-teal-200">
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

        <div className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active">
                Active Deals{" "}
                <Badge className="ml-2">{getTabCount("active")}</Badge>
              </TabsTrigger>
              <TabsTrigger value="offMarket">
                Off Market Deals{" "}
                <Badge className="ml-2">{getTabCount("offMarket")}</Badge>
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
                      <h3 className="text-lg font-medium text-teal-500">
                        {deal.title}
                      </h3>
                      {deal.rewardLevel && (
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#e0f7fa] text-[#00796b]`}
                        >
                          {deal.rewardLevel}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4>Seller Information</h4>
                      {deal.sellerProfile ? (
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <div className="text-gray-500 text-xs mr-1">
                              <span className="">Seller Name:</span> &nbsp;
                              {deal.sellerProfile.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Seller Email:</span>
                              {deal.sellerProfile.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Company Name:</span>
                              {deal.sellerProfile.companyName}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Phone Number:</span>
                              {deal.sellerProfile.phoneNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Website:</span>
                              {deal.sellerProfile.website}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-2 text-sm text-gray-500 italic">
                          Seller information is not available.
                        </div>
                      )}
                      <h4 className="mb-2 font-medium text-gray-800">
                        Overview
                      </h4>
                      <div className="mb-4 space-y-1 text-sm text-gray-600">
                        <p>Industry: {deal.industrySector}</p>
                        <p>Location: {deal.geographySelection}</p>
                        {/* <p>Number of Years in Business: {deal.yearsInBusiness}</p> */}
                        {/* <p>Business Model: {Array.isArray(deal.companyType) ? deal.companyType.join(', ') : deal.companyType || 'N/A'}</p> */}
                        <p>Company Description: {deal.companyDescription}</p>
                      </div>

                      <h4 className="mb-2 font-medium text-gray-800">
                        Financial
                      </h4>
                      <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          Currency:{" "}
                          {deal.financialDetails?.trailingRevenueCurrency}
                        </p>
                        <p>
                          Trailing 12-Month Revenue:{" "}
                          {deal.financialDetails?.trailingRevenueCurrency?.replace(
                            "USD($)",
                            "$"
                          ) || "$"}
                          {deal.financialDetails?.trailingRevenueAmount?.toLocaleString() ||
                            "N/A"}
                        </p>
                        <p>
                          Trailing 12-Month EBITDA:{" "}
                          {deal.financialDetails?.trailingEBITDACurrency?.replace(
                            "USD($)",
                            "$"
                          ) || "$"}
                          {deal.financialDetails?.trailingEBITDAAmount?.toLocaleString() ||
                            "N/A"}
                        </p>
                        {/* <p>T12 Free Cash Flow: ${deal.financialDetails?.t12FreeCashFlow?.toLocaleString() || 'N/A'}</p> */}
                        <p>
                          T12 Net Income: $
                          {deal.financialDetails?.t12NetIncome?.toLocaleString() ||
                            "N/A"}
                        </p>
                        {/* <p>
                          Average 3-Year Revenue Growth: {deal.financialDetails?.avgRevenueGrowth || 'N/A'}%
                        </p> */}
                        {/* <p>Net Income: ${deal.financialDetails?.netIncome?.toLocaleString() || 'N/A'}</p> */}
                        {/* <p>Asking Price: ${deal.financialDetails?.askingPrice?.toLocaleString() || 'N/A'}</p> */}
                        {deal.financialDetails?.finalSalePrice && (
                          <p>
                            Final Sale Price: $
                            {deal.financialDetails?.finalSalePrice?.toLocaleString()}
                          </p>
                        )}
                      </div>

                      <h4 className="mb-2 font-medium text-gray-800">
                        Documents
                      </h4>
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
                                    {doc.originalName ||
                                      doc.filename ||
                                      "Document"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {(doc.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                                <Button
                                  variant="link"
                                  className="text-teal-500 hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument(
                                      deal._id,
                                      doc.filename,
                                      doc.originalName
                                    );
                                  }}
                                >
                                  Download
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="italic text-gray-500">
                            No documents uploaded yet.
                          </p>
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
                        <Button
                          className="bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 hover:text-black px-4 py-2 ml-3"
                          style={{ minWidth: 110 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdminOffMarketClick(deal);
                          }}
                          disabled={offMarketLoading && offMarketDeal?._id === deal._id}
                        >
                          Off Market
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 py-2 mr-2 ml-3"
                          onClick={() => handleEditDeal(deal)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 px-4 py-2 ml-2 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(
                              "Delete button clicked for deal:",
                              deal._id
                            );
                            setDeleteDealId(deal._id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredActive.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No deals found
                  </h3>
                  <p className="text-gray-500 text-center">
                    {searchTerm
                      ? `No deals match your search "${searchTerm}"`
                      : `No active deals available`}
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
                  {Array.from(
                    { length: activeTotalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={
                        activeCurrentPage === page ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveCurrentPage(page)}
                      className={
                        activeCurrentPage === page
                          ? "bg-[#3aafa9] text-white"
                          : ""
                      }
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
                      <h3 className="text-lg font-medium text-teal-500">
                        {deal.title}
                      </h3>
                      {deal.rewardLevel && (
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#e0f7fa] text-[#00796b]`}
                        >
                          {deal.rewardLevel}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4>Seller Information</h4>
                      {deal.sellerProfile ? (
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <div className="text-gray-500 text-xs mr-1">
                              <span className="">Seller Name:</span> &nbsp;
                              {deal.sellerProfile.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Seller Email:</span>
                              {deal.sellerProfile.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Company Name:</span>
                              {deal.sellerProfile.companyName}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Phone Number:</span>
                              {deal.sellerProfile.phoneNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-1">Website:</span>
                              {deal.sellerProfile.website}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-2 text-sm text-gray-500 italic">
                          Seller information is not available.
                        </div>
                      )}

                      <h4 className="mb-2 font-medium text-gray-800">
                        Overview
                      </h4>
                      <div className="mb-4 space-y-1 text-sm text-gray-600">
                        <p>Industry: {deal.industrySector}</p>
                        <p>Location: {deal.geographySelection}</p>

                        <p>Company Description: {deal.companyDescription}</p>
                      </div>
                      <h4 className="mb-2 font-medium text-gray-800">
                        Financial
                      </h4>
                      <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          Currency: {deal.financialDetails?.trailingRevenueCurrency}
                        </p>
                        <p>
                          Trailing 12-Month Revenue: {deal.financialDetails?.trailingRevenueCurrency?.replace("USD($)", "$") || "$"}
                          {deal.financialDetails?.trailingRevenueAmount?.toLocaleString() || "N/A"}
                        </p>
                        <p>
                          Trailing 12-Month EBITDA: {deal.financialDetails?.trailingEBITDACurrency?.replace("USD($)", "$") || "$"}
                          {deal.financialDetails?.trailingEBITDAAmount?.toLocaleString() || "N/A"}
                        </p>
                        <p>
                          T12 Net Income: $
                          {deal.financialDetails?.t12NetIncome?.toLocaleString() || "N/A"}
                        </p>
                        {/* Transaction Value (Final Sale Price) */}
                        {deal.financialDetails?.finalSalePrice && (
                          <p className="col-span-2">
                            <span className="font-semibold">Transaction Value:</span> $
                            {deal.financialDetails.finalSalePrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {/* Closed Buyer Info */}
                      {(deal.closedWithBuyer || deal.closedWithBuyerCompany || deal.closedWithBuyerEmail) && (
                        <div className="mb-4 text-sm text-gray-700 border border-gray-100 rounded p-2 bg-gray-50">
                          <div className="font-semibold mb-1">Closed Buyer</div>
                          {deal.closedWithBuyerCompany && (
                            <div>Company: {deal.closedWithBuyerCompany}</div>
                          )}
                          {deal.closedWithBuyerEmail && (
                            <div>Email: {deal.closedWithBuyerEmail}</div>
                          )}
                          {deal.closedWithBuyer && !deal.closedWithBuyerCompany && !deal.closedWithBuyerEmail && (
                            <div>Buyer ID: {deal.closedWithBuyer}</div>
                          )}
                        </div>
                      )}
                      <h4 className="mb-2 font-medium text-gray-800">
                        Documents
                      </h4>
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
                                    {doc.originalName ||
                                      doc.filename ||
                                      "Document"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {(doc.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                                <Button
                                  variant="link"
                                  className="text-teal-500 hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument(
                                      deal._id,
                                      doc.filename,
                                      doc.originalName
                                    );
                                  }}
                                >
                                  Download
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="italic text-gray-500">
                            No documents uploaded yet.
                          </p>
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
                        <Button
                          className="bg-red-500 hover:bg-red-600 px-4 py-2 ml-2 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(
                              "Delete button clicked for deal:",
                              deal._id
                            );
                            setDeleteDealId(deal._id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredOffMarket.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No deals found
                  </h3>
                  <p className="text-gray-500 text-center">
                    {searchTerm
                      ? `No deals match your search "${searchTerm}"`
                      : `No off market deals available`}
                  </p>
                </div>
              )}
              {/* Pagination for Off Market Deals */}
              {offMarketTotalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOffMarketCurrentPage(offMarketCurrentPage - 1)
                    }
                    disabled={offMarketCurrentPage === 1}
                  >
                    Prev
                  </Button>
                  {Array.from(
                    { length: offMarketTotalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={
                        offMarketCurrentPage === page ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setOffMarketCurrentPage(page)}
                      className={
                        offMarketCurrentPage === page
                          ? "bg-[#3aafa9] text-white"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOffMarketCurrentPage(offMarketCurrentPage + 1)
                    }
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
          dealTitle={selectedDealForActivity?.title || ""}
        />
      </div>
      {editDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl p-8 overflow-y-auto max-h-[90vh]">
            {/* Use the same form structure as seller/edit-deal/page.tsx, but for admin */}
            {/* --- Admin Deal Edit Form --- */}
            <h2 className="text-2xl font-bold mb-4">Edit Deal</h2>
            <AdminEditDealForm
              deal={editDeal}
              onClose={() => setEditDeal(null)}
              onSaved={() => {
                setEditDeal(null);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
      {deleteDealId && (
  <Dialog open={!!deleteDealId} onOpenChange={() => setDeleteDealId(null)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
      </DialogHeader>
      <div className="py-4 text-gray-700">
        Are you sure you want to delete this deal? This action cannot be undone.
      </div>
      {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
      <DialogFooter>
        <Button variant="outline" onClick={() => setDeleteDealId(null)} disabled={deleteLoading}>
          Cancel
        </Button>
        <Button
          className="bg-red-500 text-white"
          onClick={() => {
            console.log('Delete confirmed for deal:', deleteDealId);
            handleDeleteDeal(deleteDealId);
          }}
          disabled={deleteLoading}
        >
          {deleteLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
{offMarketDeal && (
  <Dialog open={!!offMarketDeal} onOpenChange={() => setOffMarketDeal(null)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Mark Deal as Off Market</DialogTitle>
      </DialogHeader>
      <div className="py-4 text-gray-700">
        Are you sure you want to mark <span className="font-semibold">{offMarketDeal.title}</span> as Off Market? This will move the deal to Off Market tab and mark it as completed.
      </div>
      {offMarketError && <div className="text-red-500 mb-2">{offMarketError}</div>}
      <DialogFooter>
        <Button variant="outline" onClick={() => setOffMarketDeal(null)} disabled={offMarketLoading}>
          Cancel
        </Button>
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-white"
          onClick={handleConfirmOffMarket}
          disabled={offMarketLoading}
        >
          {offMarketLoading ? 'Processing...' : 'Confirm Off Market'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
{offMarketDialogOpen && (
  <Dialog open={offMarketDialogOpen} onOpenChange={setOffMarketDialogOpen}>
    <DialogContent className="sm:max-w-md">
      {currentDialogStep === 1 ? (
        <>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-medium">Did the deal sell?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant={offMarketData.dealSold === false ? "default" : "outline"}
              onClick={() => handleAdminDialogResponse("dealSold", false)}
              className={
                offMarketData.dealSold === false
                  ? "px-8 bg-red-500 text-white hover:bg-red-600 border-red-500"
                  : "px-8 bg-white text-red-500 border border-red-500 hover:bg-red-50"
              }
            >
              No
            </Button>
            <Button
              variant={offMarketData.dealSold === true ? "default" : "outline"}
              onClick={() => handleAdminDialogResponse("dealSold", true)}
              className={
                offMarketData.dealSold === true
                  ? "px-8 bg-teal-500 text-white hover:bg-teal-600 border-teal-500"
                  : "px-8 bg-white text-teal-500 border border-teal-500 hover:bg-teal-50"
              }
            >
              Yes
            </Button>
          </div>
        </>
      ) : currentDialogStep === 2 ? (
        <>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-medium">What was the transaction value?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              value={offMarketData.transactionValue && offMarketData.transactionValue !== "0" ? formatWithCommas(offMarketData.transactionValue) : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                setOffMarketData((prev) => ({ ...prev, transactionValue: rawValue }));
              }}
              placeholder="Enter transaction value"
              className="w-full"
            />
            <div className="flex justify-center">
              <Button
                onClick={() => setCurrentDialogStep(3)}
                className="px-8 bg-teal-500 hover:bg-teal-600"
                disabled={!offMarketData.transactionValue}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle className="text-center text-teal-500 text-lg font-medium">Did the buyer come from CIM Amplify?</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="flex gap-4">
              <Button
                variant={offMarketData.buyerFromCIM === false ? "default" : "outline"}
                onClick={() => setOffMarketData((prev) => ({ ...prev, buyerFromCIM: false }))}
                className={
                  offMarketData.buyerFromCIM === false
                    ? "flex-1 bg-red-500 text-white hover:bg-red-600 border-red-500"
                    : "flex-1 bg-white text-red-500 border border-red-500 hover:bg-red-50"
                }
              >
                No
              </Button>
              <Button
                variant={offMarketData.buyerFromCIM === true ? "default" : "outline"}
                onClick={() => setOffMarketData((prev) => ({ ...prev, buyerFromCIM: true }))}
                className={
                  offMarketData.buyerFromCIM === true
                    ? "flex-1 bg-teal-500 text-white hover:bg-teal-600 border-teal-500"
                    : "flex-1 bg-white text-teal-500 border border-teal-500 hover:bg-teal-50"
                }
              >
                Yes
              </Button>
            </div>
            {offMarketData.buyerFromCIM === true && (
              <div>
                <Label className="text-base font-medium mb-3 block">Select the buyer:</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {buyerActivityLoading ? (
                    <div className="text-center text-gray-500 py-4">Loading buyer activity...</div>
                  ) : buyerActivity.length > 0 ? (
                    buyerActivity.map((buyer) => (
                      <div
                        key={buyer.buyerId}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${selectedWinningBuyer === buyer.buyerId ? "border-teal-500 bg-teal-50" : "border-gray-200"}`}
                        onClick={() => setSelectedWinningBuyer(buyer.buyerId)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            <img
                              src="/placeholder.svg?height=40&width=40"
                              alt={buyer.buyerName || "Buyer"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{buyer.buyerName || "Unknown Buyer"}</div>
                            <div className="text-xs text-gray-500">{buyer.companyName || "Unknown Company"}</div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${buyer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{buyer.status || "Unknown"}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-amber-600 text-sm mt-2">We did not present any buyers.  Please click No</div>
                  )}
                </div>
              </div>
            )}
            {offMarketData.buyerFromCIM !== null && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleAdminOffMarketSubmit} className="bg-teal-500 hover:bg-teal-600">Submit</Button>
              </div>
            )}
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
)}
    </div>
  );
}