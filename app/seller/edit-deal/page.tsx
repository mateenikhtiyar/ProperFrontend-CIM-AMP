"use client";
import Image from "next/image";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  ChevronDown,
  ChevronRight,
  Search,
  ArrowLeft,
  FileText,
  X,
  Download,
} from "lucide-react";
// Remove these imports:
// import { getGeoData, type Continent, type Region, type SubRegion, type GeoData } from "@/lib/geography-data"

// Add these imports instead:
import { Country, State, City } from "country-state-city";
import {
  getIndustryData,
  type Sector,
  type IndustryGroup,
  type Industry,
  type SubIndustry,
  type IndustryData,
} from "@/lib/industry-data";
import SellerProtectedRoute from "@/components/seller/protected-route";

// ✅ Define the exact enum values as constants to match backend schema
const CAPITAL_AVAILABILITY_OPTIONS = {
  READY: "Ready to deploy immediately",
  NEED: "Need to raise",
} as const;

type CapitalAvailabilityType =
  (typeof CAPITAL_AVAILABILITY_OPTIONS)[keyof typeof CAPITAL_AVAILABILITY_OPTIONS];

interface SellerFormData {
  dealTitle: string;
  companyDescription: string;
  geographySelections: string[];
  industrySelections: string[];
  selectedIndustryDisplay?: string; // Add this field to track what user selected for display
  yearsInBusiness: number;
  trailingRevenue: number;
  trailingEBITDA: number;
  revenueGrowth: number;
  currency: string;
  netIncome: number;
  askingPrice: number;
  businessModels: string[];
  managementPreferences: string;
  capitalAvailability: CapitalAvailabilityType[]; // ✅ Use the exact type
  companyType: string[];
  minPriorAcquisitions: number;
  minTransactionSize: number;
  documents: File[];
  t12FreeCashFlow?: number;
  t12NetIncome?: number;
}

// Replace the existing GeoItem interface with:
interface GeoItem {
  id: string;
  name: string;
  path: string;
  type: "country" | "state" | "city";
  countryCode?: string;
  stateCode?: string;
}

// Add new interfaces:
interface CountryData {
  isoCode: string;
  name: string;
  states: StateData[];
}

interface StateData {
  isoCode: string;
  name: string;
  countryCode: string;
  cities: CityData[];
}

interface CityData {
  name: string;
  stateCode: string;
  countryCode: string;
}

interface IndustryItem {
  id: string;
  name: string;
  path: string;
}

// Type for hierarchical selection
interface GeographySelection {
  selectedId: string | null;
  selectedName: string | null;
}

interface IndustrySelection {
  sectors: Record<string, boolean>;
  industryGroups: Record<string, boolean>;
  industries: Record<string, boolean>;
  subIndustries: Record<string, boolean>;
  activities: Record<string, boolean>;
}

interface DealDocument {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

interface Deal {
  _id: string;
  title: string;
  companyDescription: string;
  dealType?: string;
  companyType?: string[];
  status: string;
  visibility?: string;
  industrySector: string;
  geographySelection: string;
  yearsInBusiness: number;
  employeeCount?: number;
  financialDetails: {
    trailingRevenueCurrency?: string;
    trailingRevenueAmount?: number;
    trailingEBITDACurrency?: string;
    trailingEBITDAAmount?: number;
    avgRevenueGrowth?: number;
    netIncome?: number;
    askingPrice?: number;
    finalSalePrice?: number;
    t12FreeCashFlow?: number;
    t12NetIncome?: number;
  };
  businessModel: {
    recurringRevenue?: boolean;
    projectBased?: boolean;
    assetLight?: boolean;
    assetHeavy?: boolean;
  };
  managementPreferences: string;
  buyerFit: {
    capitalAvailability?: CapitalAvailabilityType[];
    minPriorAcquisitions?: number;
    minTransactionSize?: number;
  };
  targetedBuyers: string[];
  interestedBuyers: string[];
  tags?: string[];
  isPublic: boolean;
  isFeatured?: boolean;
  stakePercentage?: number;
  documents: DealDocument[];
  timeline: {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    completedAt?: string;
  };
  invitationStatus?: Map<string, any>;
  seller: string;
}

// Format number with commas for display
const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function EditDealPageFixed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);
  const [flatIndustryData, setFlatIndustryData] = useState<IndustryItem[]>([]);
  const [geoSearchTerm, setGeoSearchTerm] = useState("");
  const [industrySearchTerm, setIndustrySearchTerm] = useState("");
  const [geoOpen, setGeoOpen] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document management state
  const [existingDocuments, setExistingDocuments] = useState<DealDocument[]>(
    []
  );

  // Hierarchical selection state
  const [geoSelection, setGeoSelection] = useState<GeographySelection>({
    selectedId: null,
    selectedName: null,
  });

  const [industrySelection, setIndustrySelection] = useState<IndustrySelection>(
    {
      sectors: {},
      industryGroups: {},
      industries: {},
      subIndustries: {},
      activities: {},
    }
  );

  // UI state for expanded sections
  const [expandedContinents, setExpandedContinents] = useState<
    Record<string, boolean>
  >({});
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});
  const [expandedSectors, setExpandedSectors] = useState<
    Record<string, boolean>
  >({});
  const [expandedIndustryGroups, setExpandedIndustryGroups] = useState<
    Record<string, boolean>
  >({});

  const [formData, setFormData] = useState<SellerFormData>({
    dealTitle: "",
    companyDescription: "",
    geographySelections: [],
    industrySelections: [],
    yearsInBusiness: 0,
    trailingRevenue: 0,
    trailingEBITDA: 0,
    revenueGrowth: 0,
    currency: "USD($)",
    netIncome: 0,
    askingPrice: 0,
    businessModels: [],
    managementPreferences: "",
    capitalAvailability: [], // ✅ Initialize as empty array with correct type
    companyType: [],
    minPriorAcquisitions: 0,
    minTransactionSize: 0,
    documents: [],
    t12FreeCashFlow: 0,
    t12NetIncome: 0,
  });

  // Add to state
  const [dealData, setDealData] = useState<Deal | null>(null);
  const [flatGeoData, setFlatGeoData] = useState<GeoItem[]>([]);

  // Add debounced search state
  const [debouncedGeoSearch, setDebouncedGeoSearch] = useState("");
  const [debouncedIndustrySearch, setDebouncedIndustrySearch] = useState("");

  // Add new UI state for expanded sub-industries:
  const [expandedSubIndustries, setExpandedSubIndustries] = useState<
    Record<string, boolean>
  >({});

  const [geoRefresh, setGeoRefresh] = useState(0);

  // Flatten industry data for searchable dropdown
  const flattenIndustryData = (
    items: Sector[] | IndustryGroup[] | Industry[] | SubIndustry[],
    parentPath = "",
    result: IndustryItem[] = []
  ) => {
    items.forEach((item) => {
      const path = parentPath ? `${parentPath} > ${item.name}` : item.name;
      result.push({ id: item.id, name: item.name, path });

      if ("industryGroups" in item && item.industryGroups) {
        flattenIndustryData(item.industryGroups, path, result);
      }
      if ("industries" in item && item.industries) {
        flattenIndustryData(item.industries, path, result);
      }
      if ("subIndustries" in item && item.subIndustries) {
        flattenIndustryData(item.subIndustries, path, result);
      }
    });
    return result;
  };

  const normalizeCapitalAvailability = (
    value: string
  ): CapitalAvailabilityType | null => {
    const trimmedValue = value.trim();
    if (trimmedValue === CAPITAL_AVAILABILITY_OPTIONS.READY) {
      return CAPITAL_AVAILABILITY_OPTIONS.READY;
    }
    if (trimmedValue === CAPITAL_AVAILABILITY_OPTIONS.NEED) {
      return CAPITAL_AVAILABILITY_OPTIONS.NEED;
    }
    return null;
  };

  const fetchDealData = async () => {
    if (!dealId) {
      toast({
        title: "Error",
        description: "No deal ID provided",
        variant: "destructive",
      });
      router.push("/seller/dashboard");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001";

      const response = await fetch(`${apiUrl}/deals/${dealId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch deal: ${response.statusText}`);
      }

      const dealData = await response.json();

      // ✅ Fixed: Proper capitalAvailability parsing with normalization
      let capitalAvailabilityArray: CapitalAvailabilityType[] = [];
      if (Array.isArray(dealData.buyerFit?.capitalAvailability)) {
        capitalAvailabilityArray = dealData.buyerFit.capitalAvailability
          .map(normalizeCapitalAvailability)
          .filter(
            (item: unknown): item is CapitalAvailabilityType => item !== null
          );
      } else if (typeof dealData.buyerFit?.capitalAvailability === "string") {
        const normalized = normalizeCapitalAvailability(
          dealData.buyerFit.capitalAvailability
        );
        if (normalized) {
          capitalAvailabilityArray = [normalized];
        }
      }

      // ✅ Improved: Robust companyType parsing
      let companyTypeArray: string[] = [];
      if (Array.isArray(dealData.companyType)) {
        companyTypeArray = dealData.companyType.filter(Boolean);
      } else if (
        typeof dealData.companyType === "string" &&
        dealData.companyType.trim()
      ) {
        companyTypeArray = dealData.companyType
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }

      setFormData({
        dealTitle: dealData.title || "",
        companyDescription: dealData.companyDescription || "",
        geographySelections: dealData.geographySelection
          ? [dealData.geographySelection]
          : [],
        industrySelections: dealData.industrySector
          ? [dealData.industrySector]
          : [],
        selectedIndustryDisplay: dealData.industrySector || undefined,
        yearsInBusiness: dealData.yearsInBusiness || 0,
        trailingRevenue: dealData.financialDetails?.trailingRevenueAmount || 0,
        trailingEBITDA: dealData.financialDetails?.trailingEBITDAAmount || 0,
        revenueGrowth: dealData.financialDetails?.avgRevenueGrowth || 0,
        currency:
          dealData.financialDetails?.trailingRevenueCurrency || "USD($)",
        netIncome: dealData.financialDetails?.netIncome || 0,
        askingPrice: dealData.financialDetails?.askingPrice || 0,
        businessModels: [
          ...(dealData.businessModel?.recurringRevenue
            ? ["recurring-revenue"]
            : []),
          ...(dealData.businessModel?.projectBased ? ["project-based"] : []),
          ...(dealData.businessModel?.assetLight ? ["asset-light"] : []),
          ...(dealData.businessModel?.assetHeavy ? ["asset-heavy"] : []),
        ],
        managementPreferences: dealData.managementPreferences || "",
        capitalAvailability: capitalAvailabilityArray,
        companyType: [...new Set(companyTypeArray)],
        minPriorAcquisitions:
          dealData.buyerFit?.minPriorAcquisitions ?? undefined,
        minTransactionSize: dealData.buyerFit?.minTransactionSize ?? undefined,
        documents: [],
        t12FreeCashFlow: dealData.financialDetails?.t12FreeCashFlow || 0,
        t12NetIncome: dealData.financialDetails?.t12NetIncome || 0,
      });

      setDealData(dealData);
      setExistingDocuments(dealData.documents || []);
      setSelectedReward(dealData.visibility || "seed");

      if (dealData.geographySelection) {
        setGeoSelection({
          selectedId: null,
          selectedName: dealData.geographySelection,
        });
      }
    } catch (error: any) {
      console.error("Error fetching deal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load deal data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch geography and industry data
  // useEffect(() => {
  //   // Add debounce effect for geo search
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setDebouncedGeoSearch(geoSearchTerm)
  //     }, 300)

  //     return () => clearTimeout(timer)
  //   }, [geoSearchTerm])

  //   // Add debounce effect for industry search
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setDebouncedIndustrySearch(industrySearchTerm)
  //     }, 300)

  //     return () => clearTimeout(timer)
  //   }, [industrySearchTerm])

  //   // Replace the existing fetchInitialData function with:
  //   const fetchInitialData = async () => {
  //     try {
  //       const token = localStorage.getItem("token")
  //       const userRole = localStorage.getItem("userRole")

  //       if (!token || userRole !== "seller") {
  //         router.push("/seller/login")
  //         return
  //       }

  //       // Load all countries initially but limit the visible ones
  //       const allCountries = Country.getAllCountries()
  //       const geoData: GeoItem[] = []

  //       // Add all countries to enable search
  //       allCountries.forEach((country) => {
  //         geoData.push({
  //           id: country.isoCode,
  //           name: country.name,
  //           path: country.name,
  //           type: "country",
  //           countryCode: country.isoCode,
  //         })
  //       })

  //       setFlatGeoData(geoData)

  //       // Load industry data asynchronously
  //       const industryResponse = await getIndustryData()
  //       setIndustryData(industryResponse)
  //       setFlatIndustryData(flattenIndustryData(industryResponse.sectors))

  //       // Then fetch the existing deal data (for edit)
  //       await fetchDealData()
  //     } catch (error) {
  //       console.error("Error fetching data:", error)
  //       toast({
  //         title: "Error",
  //         description: "Failed to load form data. Please refresh the page.",
  //         variant: "destructive",
  //       })
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchInitialData()
  // }, [router, dealId])

  const loadStatesAndCities = async (countryCode: string) => {
    const hasStates = flatGeoData.some(
      (item) => item.countryCode === countryCode && item.type === "state"
    );

    if (hasStates) return;

    const states = State.getStatesOfCountry(countryCode);
    const newGeoData = [...flatGeoData];

    const existingIds = new Set(newGeoData.map((item) => item.id));

    states.forEach((state) => {
      const stateId = `${countryCode}-${state.isoCode}`;
      const statePath = `${Country.getCountryByCode(countryCode)?.name} > ${
        state.name
      }`;

      if (!existingIds.has(stateId)) {
        newGeoData.push({
          id: stateId,
          name: state.name,
          path: statePath,
          type: "state",
          countryCode: countryCode,
          stateCode: state.isoCode,
        });
        existingIds.add(stateId);
      }

      const cities = City.getCitiesOfState(countryCode, state.isoCode).slice(
        0,
        5
      );
      cities.forEach((city, cityIndex) => {
        const cityId = `${countryCode}-${state.isoCode}-${city.name}-${cityIndex}`;
        const cityPath = `${Country.getCountryByCode(countryCode)?.name} > ${
          state.name
        } > ${city.name}`;

        if (!existingIds.has(cityId)) {
          newGeoData.push({
            id: cityId,
            name: city.name,
            path: cityPath,
            type: "city",
            countryCode: countryCode,
            stateCode: state.isoCode,
          });
          existingIds.add(cityId);
        }
      });
    });

    setFlatGeoData(newGeoData);
  };

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update handleNumberChange to handle empty string
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof SellerFormData
  ) => {
    const value =
      e.target.value === "" ? undefined : Number.parseFloat(e.target.value);
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle select changes
  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle checkbox changes for business models and management preferences
  const handleCheckboxChange = (
    checked: boolean,
    value: string,
    fieldName: "companyType" | "businessModels" | "managementPreferences"
  ) => {
    setFormData((prev) => {
      const currentValues = Array.isArray(prev[fieldName])
        ? prev[fieldName]
        : [];
      const newValues = checked
        ? [...new Set([...currentValues, value])]
        : currentValues.filter((v) => v !== value);
      return {
        ...prev,
        [fieldName]: newValues,
      };
    });
  };

  // ✅ Fixed: Handle capital availability changes with exact enum values
  const handleCapitalAvailabilityChange = (
    checked: boolean,
    value: CapitalAvailabilityType
  ) => {
    setFormData((prev) => {
      const currentValues = Array.isArray(prev.capitalAvailability)
        ? prev.capitalAvailability
        : [];

      const newValues = checked
        ? [...new Set([...currentValues, value])] // add if checked
        : currentValues.filter((v) => v !== value); // remove if unchecked

      return {
        ...prev,
        capitalAvailability: newValues,
      };
    });
  };

  // Geography selection handlers
  const selectGeography = (id: string, name: string) => {
    setGeoSelection({
      selectedId: id,
      selectedName: name,
    });

    setFormData((prev) => ({
      ...prev,
      geographySelections: [name],
    }));
  };

  const clearGeographySelection = () => {
    setGeoSelection({
      selectedId: null,
      selectedName: null,
    });

    setFormData((prev) => ({
      ...prev,
      geographySelections: [],
    }));
  };

  const removeCountry = (countryToRemove: string) => {
    clearGeographySelection();
  };

  // Industry selection handlers
  const toggleSector = (sector: Sector) => {
    const newIndustrySelection = { ...industrySelection };
    const isSelected = !industrySelection.sectors[sector.id];

    // Update sector selection
    newIndustrySelection.sectors[sector.id] = isSelected;

    // Update all industry groups in this sector
    sector.industryGroups.forEach((group) => {
      newIndustrySelection.industryGroups[group.id] = isSelected;

      // Update all industries in this group
      group.industries.forEach((industry) => {
        newIndustrySelection.industries[industry.id] = isSelected;
      });
    });

    setIndustrySelection(newIndustrySelection);
    updateIndustriesInFormData(newIndustrySelection);
  };

  const toggleIndustryGroup = (group: IndustryGroup, sector: Sector) => {
    const newIndustrySelection = { ...industrySelection };
    const isSelected = !industrySelection.industryGroups[group.id];

    // Update industry group selection
    newIndustrySelection.industryGroups[group.id] = isSelected;

    // Update all industries in this group
    group.industries.forEach((industry) => {
      newIndustrySelection.industries[industry.id] = isSelected;
    });

    // Check if all groups in the sector are selected/deselected
    const allGroupsSelected = sector.industryGroups.every((g) =>
      g.id === group.id ? isSelected : newIndustrySelection.industryGroups[g.id]
    );

    const allGroupsDeselected = sector.industryGroups.every((g) =>
      g.id === group.id
        ? !isSelected
        : !newIndustrySelection.industryGroups[g.id]
    );

    // Update sector selection based on groups
    if (allGroupsSelected) {
      newIndustrySelection.sectors[sector.id] = true;
    } else if (allGroupsDeselected) {
      newIndustrySelection.sectors[sector.id] = false;
    }

    setIndustrySelection(newIndustrySelection);
    updateIndustriesInFormData(newIndustrySelection);
  };

  const toggleIndustry = (
    industry: Industry,
    group: IndustryGroup,
    sector: Sector
  ) => {
    const newIndustrySelection = { ...industrySelection };
    const isSelected = !industrySelection.industries[industry.id];

    // Update industry selection
    newIndustrySelection.industries[industry.id] = isSelected;

    // Check if all industries in the group are selected/deselected
    const allIndustriesSelected = group.industries.every((i) =>
      i.id === industry.id ? isSelected : newIndustrySelection.industries[i.id]
    );

    const allIndustriesDeselected = group.industries.every((i) =>
      i.id === industry.id
        ? !isSelected
        : !newIndustrySelection.industries[i.id]
    );

    // Update group selection based on industries
    if (allIndustriesSelected) {
      newIndustrySelection.industryGroups[group.id] = true;
    } else if (allIndustriesDeselected) {
      newIndustrySelection.industryGroups[group.id] = false;
    }

    // Check if all groups in the sector are selected/deselected
    const allGroupsSelected = sector.industryGroups.every((g) =>
      g.id === group.id
        ? newIndustrySelection.industryGroups[g.id]
        : newIndustrySelection.industryGroups[g.id]
    );

    const allGroupsDeselected = sector.industryGroups.every((g) =>
      g.id === group.id
        ? !newIndustrySelection.industryGroups[g.id]
        : !newIndustrySelection.industryGroups[g.id]
    );

    // Update sector selection based on groups
    if (allGroupsSelected) {
      newIndustrySelection.sectors[sector.id] = true;
    } else if (allGroupsDeselected) {
      newIndustrySelection.sectors[sector.id] = false;
    }

    setIndustrySelection(newIndustrySelection);
    updateIndustriesInFormData(newIndustrySelection);
  };

  // Update the industries array in formData based on the hierarchical selection
  const updateIndustriesInFormData = (selection: IndustrySelection) => {
    if (!industryData) return;

    const selectedIndustries: string[] = [];

    industryData.sectors.forEach((sector) => {
      const sectorSelected = selection.sectors[sector.id];

      // Check if all industry groups in this sector are selected
      const allGroupsSelected = sector.industryGroups.every((group) => {
        return group.industries.every(
          (industry) => selection.industries[industry.id]
        );
      });

      if (sectorSelected && allGroupsSelected) {
        // If sector is selected and all its groups/industries are selected, send only the sector
        selectedIndustries.push(sector.name);
      } else {
        // Otherwise, check individual groups and industries
        sector.industryGroups.forEach((group) => {
          const groupSelected = selection.industryGroups[group.id];

          // Check if all industries in this group are selected
          const allIndustriesSelected = group.industries.every(
            (industry) => selection.industries[industry.id]
          );

          if (groupSelected && allIndustriesSelected) {
            // If group is selected and all its industries are selected, send only the group
            selectedIndustries.push(group.name);
          } else {
            // Otherwise, send only the selected industries
            group.industries.forEach((industry) => {
              if (selection.industries[industry.id]) {
                selectedIndustries.push(industry.name);
              }
            });
          }
        });
      }
    });

    setFormData((prev) => ({
      ...prev,
      industrySelections: selectedIndustries,
    }));
  };

  const removeIndustry = (industryToRemove: string) => {
    if (!industryData) return;

    const newIndustrySelection = { ...industrySelection };
    let found = false;

    // Search through all levels to find and unselect the matching item
    industryData.sectors.forEach((sector) => {
      if (sector.name === industryToRemove) {
        newIndustrySelection.sectors[sector.id] = false;
        found = true;

        // Unselect all children
        sector.industryGroups.forEach((group) => {
          newIndustrySelection.industryGroups[group.id] = false;

          group.industries.forEach((industry) => {
            newIndustrySelection.industries[industry.id] = false;
          });
        });
      }

      if (!found) {
        sector.industryGroups.forEach((group) => {
          if (group.name === industryToRemove) {
            newIndustrySelection.industryGroups[group.id] = false;
            found = true;

            // Unselect all children
            group.industries.forEach((industry) => {
              newIndustrySelection.industries[industry.id] = false;
            });

            // Check if all groups in the sector are now deselected
            const allGroupsDeselected = sector.industryGroups.every(
              (g) => !newIndustrySelection.industryGroups[g.id]
            );

            if (allGroupsDeselected) {
              newIndustrySelection.sectors[sector.id] = false;
            }
          }

          if (!found) {
            group.industries.forEach((industry) => {
              if (industry.name === industryToRemove) {
                newIndustrySelection.industries[industry.id] = false;
                found = true;

                // Check parent selections
                const allIndustriesDeselected = group.industries.every(
                  (i) => !newIndustrySelection.industries[i.id]
                );

                if (allIndustriesDeselected) {
                  newIndustrySelection.industryGroups[group.id] = false;

                  const allGroupsDeselected = sector.industryGroups.every(
                    (g) => !newIndustrySelection.industryGroups[g.id]
                  );

                  if (allGroupsDeselected) {
                    newIndustrySelection.sectors[sector.id] = false;
                  }
                }
              }
            });
          }
        });
      }
    });

    setIndustrySelection(newIndustrySelection);
    updateIndustriesInFormData(newIndustrySelection);
  };

  // Replace the existing toggleContinentExpansion function
  const toggleContinentExpansion = async (continentId: string) => {
    const isCurrentlyExpanded = expandedContinents[continentId];
    if (!isCurrentlyExpanded) {
      await loadStatesAndCities(continentId);
      setExpandedContinents((prev) => ({
        ...prev,
        [continentId]: true,
      }));
      setGeoRefresh((v) => v + 1); // Force re-render so new states/cities are included
    } else {
      setExpandedContinents((prev) => ({
        ...prev,
        [continentId]: false,
      }));
    }
  };

  const toggleRegionExpansion = (regionId: string) => {
    setExpandedRegions((prev) => {
      const newState = {
        ...prev,
        [regionId]: !prev[regionId],
      };
      return newState;
    });
  };

  const toggleSectorExpansion = (sectorId: string) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sectorId]: !prev[sectorId],
    }));
  };

  const toggleIndustryGroupExpansion = (groupId: string) => {
    setExpandedIndustryGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Add toggle function for sub-industries:
  const toggleSubIndustryExpansion = (subIndustryId: string) => {
    setExpandedSubIndustries((prev) => ({
      ...prev,
      [subIndustryId]: !prev[subIndustryId],
    }));
  };

  // Filter industry data based on search term
  const filterIndustryData = () => {
    if (!industryData || !industrySearchTerm) return industryData;

    const filteredSectors: Sector[] = [];

    industryData.sectors.forEach((sector) => {
      const filteredGroups: IndustryGroup[] = [];

      sector.industryGroups.forEach((group) => {
        const filteredIndustries: Industry[] = [];

        group.industries.forEach((industry) => {
          if (
            industry.name
              .toLowerCase()
              .includes(industrySearchTerm.toLowerCase())
          ) {
            filteredIndustries.push(industry);
          }
        });

        if (
          filteredIndustries.length > 0 ||
          group.name.toLowerCase().includes(industrySearchTerm.toLowerCase())
        ) {
          filteredGroups.push({
            ...group,
            industries:
              filteredIndustries.length > 0
                ? filteredIndustries
                : group.industries,
          });
        }
      });

      if (
        filteredGroups.length > 0 ||
        sector.name.toLowerCase().includes(industrySearchTerm.toLowerCase())
      ) {
        filteredSectors.push({
          ...sector,
          industryGroups:
            filteredGroups.length > 0 ? filteredGroups : sector.industryGroups,
        });
      }
    });

    return { sectors: filteredSectors };
  };

  // Add this function inside EditDealPageFixed, before renderIndustrySelection
  const handleIndustryRadioChange = (industryName: string) => {
    if (!industryData) return;

    // Find the selected industry and get all its sub-industries
    const subIndustryNames: string[] = [];
    let selectedIndustryType = "industry"; // track what type was selected

    // Search through all levels to find the selected item
    industryData.sectors.forEach((sector) => {
      if (sector.name === industryName) {
        selectedIndustryType = "sector";
        // If a sector is selected, get all sub-industries from all its industry groups
        sector.industryGroups.forEach((group) => {
          group.industries.forEach((industry) => {
            industry.subIndustries.forEach((subIndustry) => {
              subIndustryNames.push(subIndustry.name);
            });
          });
        });
      } else {
        sector.industryGroups.forEach((group) => {
          if (group.name === industryName) {
            selectedIndustryType = "industryGroup";
            // If an industry group is selected, get all sub-industries from all its industries
            group.industries.forEach((industry) => {
              industry.subIndustries.forEach((subIndustry) => {
                subIndustryNames.push(subIndustry.name);
              });
            });
          } else {
            group.industries.forEach((industry) => {
              if (industry.name === industryName) {
                selectedIndustryType = "industry";
                // If an industry is selected, get all its sub-industries
                industry.subIndustries.forEach((subIndustry) => {
                  subIndustryNames.push(subIndustry.name);
                });
              } else {
                industry.subIndustries.forEach((subIndustry) => {
                  if (subIndustry.name === industryName) {
                    selectedIndustryType = "subIndustry";
                    // If a sub-industry is selected, just send that sub-industry
                    subIndustryNames.push(subIndustry.name);
                  }
                });
              }
            });
          }
        });
      }
    });

    // Update form data
    setFormData((prev) => ({
      ...prev,
      industrySelections:
        subIndustryNames.length > 0 ? subIndustryNames : [industryName], // fallback to industry name if no sub-industries found
      selectedIndustryDisplay: industryName, // keep track of what the user selected for display
    }));

    console.log(`Selected ${selectedIndustryType}: ${industryName}`);
    console.log(
      `Sending ${subIndustryNames.length} sub-industries to backend:`,
      subIndustryNames
    );
  };

  // Replace renderIndustrySelection to use radio buttons
  const renderIndustrySelection = () => {
    const filteredData = filterIndustryData();
    if (!filteredData) return <div>Loading industry data...</div>;

    return (
      <div className="space-y-2">
        {filteredData.sectors.map((sector) => (
          <div key={sector.id} className="border-b border-gray-100 pb-1">
            <div className="flex items-center">
              <div
                className="flex items-center cursor-pointer flex-1"
                onClick={() => toggleSectorExpansion(sector.id)}
              >
                {expandedSectors[sector.id] ? (
                  <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                )}
                <Label
                  htmlFor={`sector-${sector.id}`}
                  className="text-[#344054] cursor-pointer font-medium"
                >
                  {sector.name}
                </Label>
              </div>
            </div>

            {expandedSectors[sector.id] && (
              <div className="ml-6 mt-1 space-y-1">
                {sector.industryGroups.map((group) => (
                  <div key={group.id} className="pl-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`group-${group.id}`}
                        name="industry"
                        checked={
                          formData.selectedIndustryDisplay === group.name
                        }
                        onChange={() => handleIndustryRadioChange(group.name)}
                        className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                      />
                      <div
                        className="flex items-center cursor-pointer flex-1"
                        onClick={() => toggleIndustryGroupExpansion(group.id)}
                      >
                        <Label
                          htmlFor={`group-${group.id}`}
                          className="text-[#344054] cursor-pointer"
                        >
                          {group.name}
                        </Label>
                      </div>
                    </div>
                    {group.description && (
                      <div className="ml-6 mt-1 text-xs text-gray-500 font-poppins italic">
                        {group.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Replace the renderGeographySelection function with this optimized version
  const renderGeographySelection = () => {
    const filteredGeoData = flatGeoData.filter(
      (item) =>
        !debouncedGeoSearch ||
        item.name.toLowerCase().includes(debouncedGeoSearch.toLowerCase()) ||
        item.path.toLowerCase().includes(debouncedGeoSearch.toLowerCase())
    );

    const groupedData = filteredGeoData.reduce((acc, item) => {
      const countryCode = item.countryCode || item.id;
      if (!acc[countryCode]) {
        acc[countryCode] = {
          country: null,
          states: [],
        };
      }

      if (item.type === "country") {
        acc[countryCode].country = item;
      } else if (item.type === "state") {
        acc[countryCode].states.push(item);
      } // Do not handle cities

      return acc;
    }, {} as Record<string, { country: GeoItem | null; states: GeoItem }>);

    return (
      <div className="space-y-2 font-poppins">
        {Object.values(groupedData)
          .filter((group) => group.country || group.states.length > 0)
          .map((group, groupIndex) => {
            if (!group.country) return null;
            const country = group.country;

            const filteredStates = group.states;

            return (
              <div
                key={`country-${country.id}-${groupIndex}`}
                className="border-b border-gray-100 pb-1"
              >
                <div className="flex items-center">
                  <div
                    className="flex items-center cursor-pointer flex-1"
                    onClick={() => toggleContinentExpansion(country.id)}
                  >
                    {expandedContinents[country.id] ? (
                      <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                    )}
                    <Label className="text-[#344054] cursor-pointer font-medium">
                      {country.name}
                    </Label>
                  </div>
                </div>

                {expandedContinents[country.id] &&
                  filteredStates.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1">
                      {filteredStates.map((state, stateIndex) => (
                        <div
                          key={`state-${state.id}-${stateIndex}`}
                          className="pl-2"
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`geo-${state.id}`}
                              name="geography"
                              checked={geoSelection.selectedId === state.id}
                              onChange={() =>
                                selectGeography(state.id, state.path)
                              }
                              className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                            />
                            <Label
                              htmlFor={`geo-${state.id}`}
                              className="text-[#344054] cursor-pointer"
                            >
                              {state.name}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
      </div>
    );
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = [];
      let hasError = false;

      // Check each file
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          setFileError(`File ${file.name} exceeds 10MB limit`);
          hasError = true;
          break;
        }

        newFiles.push(file);
      }

      if (!hasError) {
        setSelectedFile(e.target.files[0]); // Show first file name for UI
        setFileError(null);

        // Add to documents array
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, ...newFiles],
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dealId) {
      toast({
        title: "Error",
        description: "No deal ID provided",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Validate form
      if (!formData.dealTitle.trim()) throw new Error("Deal title is required");
      if (!formData.companyDescription.trim())
        throw new Error("Company description is required");
      if (formData.geographySelections.length === 0)
        throw new Error("Please select a geography");
      if (formData.industrySelections.length === 0)
        throw new Error("Please select at least one industry");
      if (formData.capitalAvailability.length === 0)
        throw new Error(
          "Please select at least one capital availability option"
        );

      const token = localStorage.getItem("token");
      const sellerId = localStorage.getItem("userId");
      const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001";

      if (!token || !sellerId) throw new Error("Authentication required");

      // Map business models to booleans
      const businessModel = {
        recurringRevenue: formData.businessModels.includes("recurring-revenue"),
        projectBased: formData.businessModels.includes("project-based"),
        assetLight: formData.businessModels.includes("asset-light"),
        assetHeavy: formData.businessModels.includes("asset-heavy"),
      };

      // Use managementPreferences as a string
      const managementPreferences = formData.managementPreferences;

      // ✅ Ensure capitalAvailability is never empty and uses exact enum values
      const validCapitalAvailability =
        formData.capitalAvailability.length > 0
          ? formData.capitalAvailability
          : [CAPITAL_AVAILABILITY_OPTIONS.READY]; // Default fallback

      const payload = {
        title: formData.dealTitle,
        companyDescription: formData.companyDescription,
        visibility: selectedReward || "seed",
        industrySector: formData.industrySelections[0] || "",
        geographySelection: formData.geographySelections[0] || "",
        yearsInBusiness: formData.yearsInBusiness,
        companyType: Array.isArray(formData.companyType)
          ? formData.companyType
          : [],
        financialDetails: {
          trailingRevenueCurrency: formData.currency,
          trailingRevenueAmount: formData.trailingRevenue,
          trailingEBITDACurrency: formData.currency,
          trailingEBITDAAmount: formData.trailingEBITDA,
          avgRevenueGrowth: formData.revenueGrowth,
          netIncome: formData.netIncome,
          askingPrice: formData.askingPrice,
          t12FreeCashFlow: formData.t12FreeCashFlow || 0,
          t12NetIncome: formData.t12NetIncome || 0,
        },
        businessModel,
        managementPreferences,
        buyerFit: {
          capitalAvailability: validCapitalAvailability, // ✅ Fixed: Always valid array with exact enum values
          minPriorAcquisitions: formData.minPriorAcquisitions,
          minTransactionSize: formData.minTransactionSize,
        },
        dealType: dealData?.dealType || "acquisition",
        status: dealData?.status || "draft",
      };

      console.log("Updating deal payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${apiUrl}/deals/${dealId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(`Failed to update deal: ${response.statusText}`);
      }

      // Handle document uploads if there are any new documents
      if (formData.documents.length > 0) {
        const uploadFormData = new FormData();

        Array.from(formData.documents).forEach((file) => {
          uploadFormData.append("files", file);
        });

        const uploadResponse = await fetch(
          `${apiUrl}/deals/${dealId}/upload-documents`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: uploadFormData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(
            `Failed to upload documents: ${uploadResponse.statusText}`
          );
        }
      }

      toast({
        title: "Success",
        description: "Your deal has been updated successfully.",
      });

      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Update Failed",
        description:
          error.message || "Failed to update deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle document deletion
  const handleDocumentDelete = async (doc: DealDocument) => {
    if (!dealId) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001";

      const docIndex = existingDocuments.findIndex(
        (d) => d.filename === doc.filename
      );
      const response = await fetch(
        `${apiUrl}/deals/${dealId}/documents/${docIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.statusText}`);
      }

      // Remove from existing documents
      setExistingDocuments(
        existingDocuments.filter((d) => d.filename !== doc.filename)
      );

      toast({
        title: "Document deleted",
        description: `${doc.originalName} has been deleted successfully.`,
      });
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  // Handle document download
  const handleDocumentDownload = (doc: DealDocument) => {
    const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:3001";
    const link = document.createElement("a");
    link.href = `${apiUrl}/uploads/deal-documents/${doc.filename}`;
    link.download = doc.originalName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle new document deletion (remove from formData.documents)
  const handleNewDocumentDelete = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== indexToRemove),
    }));

    // Clear selected file display if it was the last one
    if (formData.documents.length === 1) {
      setSelectedFile(null);
    }

    toast({
      title: "Document removed",
      description: "Document has been removed from upload queue.",
    });
  };

  // Function to handle multi-select changes for company type
  const handleMultiSelectChange = (option: string) => {
    setFormData((prev) => {
      const currentValues = Array.isArray(prev.companyType)
        ? prev.companyType
        : [];
      const isChecked = currentValues.includes(option);

      const newValues = isChecked
        ? currentValues.filter((v) => v !== option) // remove if unchecked
        : [...currentValues, option]; // add if checked

      return {
        ...prev,
        companyType: newValues,
      };
    });
  };

  // Add debounce effect for geo search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGeoSearch(geoSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [geoSearchTerm]);

  // Add debounce effect for industry search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIndustrySearch(industrySearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [industrySearchTerm]);

  // Fetch geography and industry data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");

        if (!token || userRole !== "seller") {
          router.push("/seller/login");
          return;
        }

        // Load all countries initially but limit the visible ones
        const allCountries = Country.getAllCountries();
        const geoData: GeoItem[] = [];

        // Add all countries to enable search
        allCountries.forEach((country) => {
          geoData.push({
            id: country.isoCode,
            name: country.name,
            path: country.name,
            type: "country",
            countryCode: country.isoCode,
          });
        });

        setFlatGeoData(geoData);

        // Load industry data asynchronously
        const industryResponse = await getIndustryData();
        setIndustryData(industryResponse);
        setFlatIndustryData(flattenIndustryData(industryResponse.sectors));

        // Then fetch the existing deal data (for edit)
        await fetchDealData();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router, dealId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3aafa9]"></div>
      </div>
    );
  }

  return (
    <SellerProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-5xl bg-white">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => router.push("/seller/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Deal</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seller Rewards */}
          <div className="bg-[#f0f7fa] p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Seller Rewards - Choose Reward Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Seed Option */}
              <Card
                className={`cursor-pointer border-4 ${
                  selectedReward === "seed"
                    ? "border-[#3aafa9]"
                    : "border-gray-200"
                } overflow-hidden`}
                onClick={() => setSelectedReward("seed")}
              >
                <div className="flex flex-col h-full">
                  <div className="p-4">
                    <div className="flex justify-between overflow-hidden">
                      <h3 className="font-semibold text-[#3aafa9]">Seed</h3>
                      <Image
                        width={100}
                        height={100}
                        src="/seed.svg"
                        alt="seed"
                        className="w-20 h-20"
                      />
                    </div>
                    <p className="text-sm mt-2 text-gray-600">
                      This deal will be made widely available on other deal
                      platforms. Most of our buyers refuse deals from this level
                      - you will get very few buyer matches.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="p-4">
                        <div className="bg-[#3aafa9] text-white text-xs rounded-md px-3 py-3 inline-block">
                          <span className="text-[#F4E040]">$10</span> Amazon
                          Gift Card for posting with us
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bloom Option */}
              <Card
                className={`cursor-pointer border-4 ${
                  selectedReward === "bloom"
                    ? "border-[#3aafa9]"
                    : "border-gray-200"
                } overflow-hidden`}
                onClick={() => setSelectedReward("bloom")}
              >
                <div className="flex flex-col h-full">
                  <div className="p-4">
                    <div className=" flex justify-between overflow-hidden">
                      <h3 className="font-semibold  text-[#3aafa9]">Bloom</h3>

                      <Image
                        width={100}
                        height={100}
                        src="/bloom.svg"
                        alt="bloom"
                        className="w-20 h-20 "
                      />
                    </div>{" "}
                    <p className="text-sm mt-2 text-gray-600">
                      Give CIM Amplify a two week head start! This deal will be
                      posted exclusively on CIM Amplify for two weeks and no
                      other deal sites including your own website. Feel free to
                      market directly to buyers you do not choose on CIM
                      Amplify.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="p-4">
                        <div className="bg-[#3aafa9] text-white text-xs rounded-md px-3 py-3 inline-block">
                          <span className="text-[#F4E040]">$25</span> Amazon
                          Gift Card for posting with us PLUS $5,000 if acquired
                          via CIM Amplify
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Fruit Option */}
              <Card
                className={`cursor-pointer border-4 ${
                  selectedReward === "fruit"
                    ? "border-[#3aafa9]"
                    : "border-gray-200"
                } overflow-hidden`}
                onClick={() => setSelectedReward("fruit")}
              >
                <div className="flex flex-col h-full">
                  <div className="p-4">
                    <div className=" flex justify-between overflow-hidden">
                      <h3 className="font-semibold  text-[#3aafa9]">Fruit</h3>

                      <Image
                        width={100}
                        height={100}
                        src="/fruit.svg"
                        alt="Fruit"
                        className="w-20 h-20 "
                      />
                    </div>

                    <p className="text-sm mt-2 text-gray-600">
                      This deal will be posted exclusively on CIM Amplify and no
                      other deal sites including your own website. Feel free to
                      market directly to buyers you do not choose on CIM
                      Amplify.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="p-4">
                        <div className="bg-[#3aafa9] text-white text-xs rounded-md px-3 py-3 inline-block">
                          <span className="text-[#F4E040]">$50</span> Amazon
                          Gift Card for posting with us PLUS $10,000 if acquired
                          via CIM Amplify
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Overview Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Overview</h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="dealTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deal Title
                </label>
                <Input
                  id="dealTitle"
                  name="dealTitle"
                  value={formData.dealTitle}
                  onChange={handleInputChange}
                  placeholder="Add title"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="companyDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Description
                </label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  placeholder="Make sure to be very specific about what the company does"
                  className="w-full min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Geography Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Location
                  </label>
                  <div className="border border-[#d0d5dd] rounded-md p-4 h-80 flex flex-col">
                    <div className="relative mb-4">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#667085]" />
                      <Input
                        placeholder="Search "
                        className="pl-8 border-[#d0d5dd]"
                        value={geoSearchTerm}
                        onChange={(e) => setGeoSearchTerm(e.target.value)}
                      />
                    </div>

                    {formData.geographySelections.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-[#667085] mb-1">
                          Selected{" "}
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                          {formData.geographySelections.map(
                            (country, index) => (
                              <span
                                key={`selected-country-${index}`}
                                className="bg-gray-100 text-[#344054] text-xs rounded-full px-2 py-0.5 flex items-center group"
                              >
                                {country}
                                <button
                                  type="button"
                                  onClick={() => removeCountry(country)}
                                  className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto">
                      {renderGeographySelection()}
                    </div>
                  </div>
                </div>

                {/* Industry Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Selector
                  </label>
                  <div className="border border-[#d0d5dd] rounded-md p-4 h-80 flex flex-col">
                    <div className="relative mb-4">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#667085]" />
                      <Input
                        placeholder="Search "
                        className="pl-8 border-[#d0d5dd]"
                        value={industrySearchTerm}
                        onChange={(e) => setIndustrySearchTerm(e.target.value)}
                      />
                    </div>

                    {formData.selectedIndustryDisplay && (
                      <div className="mb-4">
                        <div className="text-sm text-[#667085] mb-1">
                          Selected{" "}
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                          <span
                            key="selected-industry-display"
                            className="bg-gray-100 text-[#344054] text-xs rounded-full px-2 py-0.5 flex items-center group"
                          >
                            {formData.selectedIndustryDisplay}
                            <span className="ml-1 text-gray-400 text-xs">
                              ({formData.industrySelections.length}{" "}
                              sub-industries)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  industrySelections: [],
                                  selectedIndustryDisplay: undefined,
                                }));
                              }}
                              className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto">
                      {renderIndustrySelection()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="yearsInBusiness"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of years in business
                </label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  min="0"
                  value={formData.yearsInBusiness ?? ""}
                  onChange={(e) => handleNumberChange(e, "yearsInBusiness")}
                  className="w-full"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Business Models
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Checkbox
                      id="recurring-revenue"
                      checked={formData.businessModels.includes(
                        "recurring-revenue"
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          Boolean(checked),
                          "recurring-revenue",
                          "businessModels"
                        )
                      }
                      className="mr-2 border-[#d0d5dd]"
                    />
                    <Label
                      htmlFor="recurring-revenue"
                      className="cursor-pointer"
                    >
                      Recurring Revenue
                    </Label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id="project-based"
                      checked={formData.businessModels.includes(
                        "project-based"
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          Boolean(checked),
                          "project-based",
                          "businessModels"
                        )
                      }
                      className="mr-2 border-[#d0d5dd]"
                    />
                    <Label htmlFor="project-based" className="cursor-pointer">
                      Project Based
                    </Label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id="asset-light"
                      checked={formData.businessModels.includes("asset-light")}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          Boolean(checked),
                          "asset-light",
                          "businessModels"
                        )
                      }
                      className="mr-2 border-[#d0d5dd]"
                    />
                    <Label htmlFor="asset-light" className="cursor-pointer">
                      Asset Light
                    </Label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id="asset-heavy"
                      checked={formData.businessModels.includes("asset-heavy")}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          Boolean(checked),
                          "asset-heavy",
                          "businessModels"
                        )
                      }
                      className="mr-2 border-[#d0d5dd]"
                    />
                    <Label htmlFor="asset-heavy" className="cursor-pointer">
                      Asset Heavy
                    </Label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="managementPreferences"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Management Preferences
                </label>
                <textarea
                  id="managementPreferences"
                  name="managementPreferences"
                  value={formData.managementPreferences}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  placeholder="Enter management preferences"
                  required
                />
              </div>
            </div>
          </section>

          {/* Financials Section */}
          <section className="bg-[#f9f9f9] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Financials</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="trailingRevenue"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Trailing 12 Month Revenue
                  </label>
                  <div className="flex">
                    <Input
                      id="trailingRevenue"
                      type="text"
                      value={
                        formData.trailingRevenue
                          ? formatNumberWithCommas(formData.trailingRevenue)
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                          handleNumberChange(
                            {
                              target: { value: rawValue },
                            } as React.ChangeEvent<HTMLInputElement>,
                            "trailingRevenue"
                          );
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Currency
                  </label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      handleSelectChange(value, "currency")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD($)">USD($)</SelectItem>
                      <SelectItem value="EUR(€)">EUR(€)</SelectItem>
                      <SelectItem value="GBP(£)">GBP(£)</SelectItem>
                      <SelectItem value="CAD($)">CAD($)</SelectItem>
                      <SelectItem value="AUD($)">AUD($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="trailingEBITDA"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Trailing 12 Month EBITDA(0 covers negative)
                  </label>
                  <Input
                    id="trailingEBITDA"
                    type="text"
                    value={
                      formData.trailingEBITDA !== undefined &&
                      formData.trailingEBITDA !== null
                        ? formatNumberWithCommas(formData.trailingEBITDA)
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                        handleNumberChange(
                          {
                            target: { value: rawValue },
                          } as React.ChangeEvent<HTMLInputElement>,
                          "trailingEBITDA"
                        );
                      }
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="revenueGrowth"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Average 3 year revenue growth in %(0 covers negative)
                  </label>
                  <Input
                    id="revenueGrowth"
                    type="text"
                    value={
                      formData.revenueGrowth !== undefined &&
                      formData.revenueGrowth !== null
                        ? formatNumberWithCommas(formData.revenueGrowth)
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                        handleNumberChange(
                          {
                            target: { value: rawValue },
                          } as React.ChangeEvent<HTMLInputElement>,
                          "revenueGrowth"
                        );
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Optional Financial Information */}
          <section className="bg-[#f9f9f9] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Optional Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="netIncome"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Net Income
                </label>
                <Input
                  id="netIncome"
                  type="text"
                  value={
                    formData.netIncome
                      ? formatNumberWithCommas(formData.netIncome)
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                      handleNumberChange(
                        {
                          target: { value: rawValue },
                        } as React.ChangeEvent<HTMLInputElement>,
                        "netIncome"
                      );
                    }
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="t12FreeCashFlow"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  T12 Free Cash Flow
                </label>
                <Input
                  id="t12FreeCashFlow"
                  type="text"
                  value={
                    formData.t12FreeCashFlow
                      ? formatNumberWithCommas(formData.t12FreeCashFlow)
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                      handleNumberChange(
                        {
                          target: { value: rawValue },
                        } as React.ChangeEvent<HTMLInputElement>,
                        "t12FreeCashFlow"
                      );
                    }
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="t12NetIncome"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  T12 Net Income
                </label>
                <Input
                  id="t12NetIncome"
                  type="text"
                  value={
                    formData.t12NetIncome
                      ? formatNumberWithCommas(formData.t12NetIncome)
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                      handleNumberChange(
                        {
                          target: { value: rawValue },
                        } as React.ChangeEvent<HTMLInputElement>,
                        "t12NetIncome"
                      );
                    }
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="askingPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Asking Price
                </label>
                <Input
                  id="askingPrice"
                  type="text"
                  value={
                    formData.askingPrice
                      ? formatNumberWithCommas(formData.askingPrice)
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                      handleNumberChange(
                        {
                          target: { value: rawValue },
                        } as React.ChangeEvent<HTMLInputElement>,
                        "askingPrice"
                      );
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Buyer Fit / Ability to Close */}
          <section className="bg-[#f9f9f9] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">
              Buyer Fit / Ability to Close
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Capital Availability <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="ready-capital"
                    checked={formData.capitalAvailability.includes(
                      CAPITAL_AVAILABILITY_OPTIONS.READY
                    )}
                    onCheckedChange={(checked) =>
                      handleCapitalAvailabilityChange(
                        Boolean(checked),
                        CAPITAL_AVAILABILITY_OPTIONS.READY
                      )
                    }
                    className="border-[#d0d5dd]"
                  />
                  <label
                    htmlFor="ready-capital"
                    className="text-sm cursor-pointer"
                  >
                    {CAPITAL_AVAILABILITY_OPTIONS.READY}
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="need-raise"
                    checked={formData.capitalAvailability.includes(
                      CAPITAL_AVAILABILITY_OPTIONS.NEED
                    )}
                    onCheckedChange={(checked) =>
                      handleCapitalAvailabilityChange(
                        Boolean(checked),
                        CAPITAL_AVAILABILITY_OPTIONS.NEED
                      )
                    }
                    className="border-[#d0d5dd]"
                  />
                  <label
                    htmlFor="need-raise"
                    className="text-sm cursor-pointer"
                  >
                    {CAPITAL_AVAILABILITY_OPTIONS.NEED}
                  </label>
                </div>
              </div>
            </div>

            {/* Company Type - spans full width on md+ */}
            <div className="md:col-span-2 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Type
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left h-auto min-h-11 px-3 py-2 border border-gray-300 hover:border-gray-400 focus:border-[#3aafa9] focus:ring-2 focus:ring-[#3aafa9]/20 rounded-md overflow-hidden bg-transparent"
                  >
                    <span
                      className={`${
                        Array.isArray(formData.companyType) &&
                        formData.companyType.length > 0
                          ? "text-gray-900"
                          : "text-gray-500"
                      } truncate block pr-2`}
                    >
                      {Array.isArray(formData.companyType) &&
                      formData.companyType.length > 0
                        ? formData.companyType.join(", ")
                        : "Select company types"}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={4}
                  className="max-w-full w-[--radix-popover-trigger-width] p-0 border border-gray-200 rounded-md shadow-lg bg-white"
                >
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        Select Company Types
                      </h3>
                      <span className="text-xs text-gray-500">
                        {Array.isArray(formData.companyType)
                          ? formData.companyType.length
                          : 0}{" "}
                        selected
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const allOptions = [
                            "Buy Side Mandate",
                            "Entrepreneurship through Acquisition",
                            "Family Office",
                            "Holding Company",
                            "Independent Sponsor",
                            "Private Equity",
                            "Single Acquisition Search",
                            "Strategic Operating Company",
                          ];
                          setFormData((prev) => ({
                            ...prev,
                            companyType: allOptions,
                          }));
                        }}
                        className="flex-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, companyType: [] }))
                        }
                        className="flex-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {[
                      "Buy Side Mandate",
                      "Entrepreneurship through Acquisition",
                      "Family Office",
                      "Holding Company",
                      "Independent Sponsor",
                      "Private Equity",
                      "Single Acquisition Search",
                      "Strategic Operating Company",
                    ].map((option) => {
                      const isChecked =
                        Array.isArray(formData.companyType) &&
                        formData.companyType.includes(option);

                      return (
                        <div
                          key={option}
                          className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-blue-50 hover:bg-blue-100"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleMultiSelectChange(option)}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // Controlled by onClick above
                              className="h-4 w-4 border-gray-300 rounded appearance-none border-2 checked:bg-[#3aafa9] checked:border-[#3aafa9] focus:ring-[#3aafa9] focus:ring-2 transition-colors"
                            />
                            {isChecked && (
                              <svg
                                className="absolute inset-0 h-4 w-4 text-white pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <label
                            className={`text-sm cursor-pointer flex-1 select-none ${
                              isChecked
                                ? "font-medium text-blue-900"
                                : "text-gray-700"
                            }`}
                          >
                            {option}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row w-full gap-4">
                {/* Minimum Prior Acquisitions */}
                <div className="w-full">
                  <label
                    htmlFor="minPriorAcquisitions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Minimum Prior Acquisitions
                  </label>
                  <Input
                    id="minPriorAcquisitions"
                    type="number"
                    min="0"
                    value={formData.minPriorAcquisitions === 0 ? "0" : formData.minPriorAcquisitions || ""}
                    onChange={(e) => handleNumberChange(e, "minPriorAcquisitions")}
                    className="w-full"
                  />
                </div>

                {/* Minimum Transaction Size */}
                <div className="w-full">
                  <label
                    htmlFor="minTransactionSize"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Minimum Transaction Size
                  </label>
                  <Input
                    id="minTransactionSize"
                    type="number"
                    min="0"
                    value={formData.minTransactionSize === 0 ? "0" : formData.minTransactionSize || ""}
                    onChange={(e) => handleNumberChange(e, "minTransactionSize")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Documents Section */}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  Updating...
                  <div className="animate-spin rounded-full h-4 w-4 ml-2 border-t-2 border-b-2 border-white"></div>
                </>
              ) : (
                "Update Deal"
              )}
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </SellerProtectedRoute>
  );
}