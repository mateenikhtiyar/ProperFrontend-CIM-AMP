"use client"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ChevronDown, ChevronRight, Search } from "lucide-react"

import {
  getIndustryData,
  type Sector,
  type IndustryGroup,
  type Industry,
  type SubIndustry,
  type IndustryData,
  type Activity,
} from "@/lib/industry-data"

import { Country, State, City } from "country-state-city"

interface SellerFormData {
  dealTitle: string
  companyDescription: string
  geographySelections: string[]
  industrySelections: string[]
  selectedIndustryDisplay?: string
  geographyHierarchy?: {
    country: string
    states: string[]
    cities: string[]
  }
  industryHierarchy?: {
    selectedItem: string
    subIndustries: string[]
  }
  yearsInBusiness: number
  trailingRevenue: number
  trailingEBITDA: number
  t12FreeCashFlow: number
  t12NetIncome: number
  revenueGrowth: number
  currency: string
  netIncome: number
  askingPrice: number
  businessModels: string[]
  managementPreferences: string
  capitalAvailability: string[]
  companyType: string[]
  minPriorAcquisitions: number
  minTransactionSize: number
  documents: File[]
  employeeCount?: number
}

interface GeoItem {
  id: string
  name: string
  path: string
  type: "country" | "state" | "city"
  countryCode?: string
  stateCode?: string
}

interface CountryData {
  isoCode: string
  name: string
  states: StateData[]
}

interface StateData {
  isoCode: string
  name: string
  countryCode: string
  cities: CityData[]
}

interface CityData {
  name: string
  stateCode: string
  countryCode: string
}

interface IndustryItem {
  id: string
  name: string
  path: string
}

interface GeographySelection {
  selectedId: string | null
  selectedName: string | null
}

interface IndustrySelection {
  sectors: Record<string, boolean>
  industryGroups: Record<string, boolean>
  industries: Record<string, boolean>
  subIndustries: Record<string, boolean>
  activities: Record<string, boolean>
}

const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const validateEBITDAvsRevenue = (ebitda: number, revenue: number): string | null => {
  if (revenue > 0 && ebitda >= revenue) {
    return "EBITDA must be smaller than Revenue"
  }
  return null
}

export default function SellerFormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [industryData, setIndustryData] = useState<IndustryData | null>(null)
  const [flatGeoData, setFlatGeoData] = useState<GeoItem[]>([])
  const [flatIndustryData, setFlatIndustryData] = useState<IndustryItem[]>([])
  const [geoSearchTerm, setGeoSearchTerm] = useState("")
  const [industrySearchTerm, setIndustrySearchTerm] = useState("")
  const [geoOpen, setGeoOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [geoSelection, setGeoSelection] = useState<GeographySelection>({
    selectedId: null,
    selectedName: null,
  })

  const [industrySelection, setIndustrySelection] = useState<IndustrySelection>({
    sectors: {},
    industryGroups: {},
    industries: {},
    subIndustries: {},
    activities: {},
  })

  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({})
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({})
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({})
  const [expandedIndustryGroups, setExpandedIndustryGroups] = useState<Record<string, boolean>>({})
  const [expandedSubIndustries, setExpandedSubIndustries] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState<SellerFormData>({
    dealTitle: "",
    companyDescription: "",
    geographySelections: [],
    industrySelections: [""],
    yearsInBusiness: 0,
    trailingRevenue: 0,
    trailingEBITDA: 0,
    t12FreeCashFlow: 0,
    t12NetIncome: 0,
    revenueGrowth: 0,
    currency: "USD($)",
    netIncome: 0,
    askingPrice: 0,
    businessModels: [],
    managementPreferences: "",
    capitalAvailability: [],
    companyType: [],
    minPriorAcquisitions: 0,
    minTransactionSize: 0,
    documents: [],
  })

  const [fileError, setFileError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [realtimeErrors, setRealtimeErrors] = useState<{ [key: string]: string }>({})

  const handleMultiSelectChange = (option: string, fieldName: string) => {
    setFormData((prev) => {
      const arr = Array.isArray((prev as any)[fieldName]) ? (prev as any)[fieldName] : []
      return {
        ...prev,
        [fieldName]: arr.includes(option) ? arr.filter((v: string) => v !== option) : [...arr, option],
      }
    })
  }

  const flattenIndustryData = (
    items: Sector[] | IndustryGroup[] | Industry[] | SubIndustry[],
    parentPath = "",
    result: IndustryItem[] = [],
  ) => {
    if (!Array.isArray(items)) return result
    items.forEach((item) => {
      const path = parentPath ? `${parentPath} > ${item.name}` : item.name
      result.push({ id: item.id, name: item.name, path })

      if ("industryGroups" in item && item.industryGroups) {
        flattenIndustryData(item.industryGroups, path, result)
      }
      if ("industries" in item && item.industries) {
        flattenIndustryData(item.industries, path, result)
      }
      if ("subIndustries" in item && item.subIndustries) {
        flattenIndustryData(item.subIndustries, path, result)
      }
    })
    return result
  }

  const [debouncedGeoSearch, setDebouncedGeoSearch] = useState("")
  const [debouncedIndustrySearch, setDebouncedIndustrySearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGeoSearch(geoSearchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [geoSearchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIndustrySearch(industrySearchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [industrySearchTerm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCountries = Country.getAllCountries()
        const geoData: GeoItem[] = []

        allCountries.forEach((country) => {
          geoData.push({
            id: country.isoCode,
            name: country.name,
            path: country.name,
            type: "country",
            countryCode: country.isoCode,
          })
        })

        setFlatGeoData(geoData)

        const industryResponse = await getIndustryData()
        setIndustryData(industryResponse)
        setFlatIndustryData(flattenIndustryData(industryResponse.sectors))
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    if (!token || userRole !== "seller") {
      router.push("/seller/login")
    }
  }, [router])

  const loadStatesAndCities = async (countryCode: string) => {
    const hasStates = flatGeoData.some((item) => item.countryCode === countryCode && item.type === "state")

    if (hasStates) return

    const states = State.getStatesOfCountry(countryCode)
    const newGeoData = [...flatGeoData]
    const existingIds = new Set(newGeoData.map((item) => item.id))

    states.forEach((state) => {
      const stateId = `${countryCode}-${state.isoCode}`
      const statePath = `${Country.getCountryByCode(countryCode)?.name} > ${state.name}`

      if (!existingIds.has(stateId)) {
        newGeoData.push({
          id: stateId,
          name: state.name,
          path: statePath,
          type: "state",
          countryCode: countryCode,
          stateCode: state.isoCode,
        })
        existingIds.add(stateId)
      }

      const cities = City.getCitiesOfState(countryCode, state.isoCode).slice(0, 5)
      cities.forEach((city, cityIndex) => {
        const cityId = `${countryCode}-${state.isoCode}-${city.name}-${cityIndex}`
        const cityPath = `${Country.getCountryByCode(countryCode)?.name} > ${state.name} > ${city.name}`

        if (!existingIds.has(cityId)) {
          newGeoData.push({
            id: cityId,
            name: city.name,
            path: cityPath,
            type: "city",
            countryCode: countryCode,
            stateCode: state.isoCode,
          })
          existingIds.add(cityId)
        }
      })
    })

    setFlatGeoData(newGeoData)
  }

  const toggleContinentExpansion = async (continentId: string) => {
    const isCurrentlyExpanded = expandedContinents[continentId]

    setExpandedContinents((prev) => ({
      ...prev,
      [continentId]: !prev[continentId],
    }))

    if (!isCurrentlyExpanded) {
      await loadStatesAndCities(continentId)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleCheckboxChange = (
    checked: boolean,
    value: string,
    fieldName: "businessModels" | "managementPreferences",
  ) => {
    setFormData((prev) => {
      if (fieldName === "managementPreferences") {
        // No-op or custom logic if needed, since managementPreferences is now a string
        return prev;
      }
      if (checked) {
        return { ...prev, [fieldName]: [...prev[fieldName], value] }
      } else {
        return {
          ...prev,
          [fieldName]: prev[fieldName].filter((item: string) => item !== value),
        }
      }
    })
  }

  // Updated geography selection handler to collect hierarchical data
  const selectGeography = async (id: string, name: string, type: "country" | "state" | "city") => {
    setGeoSelection({
      selectedId: id,
      selectedName: name,
    })

    // Collect hierarchical data based on selection type
    const hierarchyData = {
      country: "",
      states: [] as string[],
      cities: [] as string[],
    }

    if (type === "country") {
      const countryCode = id
      hierarchyData.country = name

      // Get all states for this country
      const states = State.getStatesOfCountry(countryCode)
      hierarchyData.states = states.map((state) => state.name)

      // Get all cities for all states (limited for performance)
      const allCities: string[] = []
      for (const state of states.slice(0, 10)) {
        // Limit to first 10 states for performance
        const cities = City.getCitiesOfState(countryCode, state.isoCode).slice(0, 5)
        allCities.push(...cities.map((city) => city.name))
      }
      hierarchyData.cities = allCities
    } else if (type === "state") {
      const [countryCode, stateCode] = id.split("-")
      const country = Country.getCountryByCode(countryCode)
      const state = State.getStateByCodeAndCountry(stateCode, countryCode)

      hierarchyData.country = country?.name || ""
      hierarchyData.states = [name]

      // Get all cities for this state
      const cities = City.getCitiesOfState(countryCode, stateCode)
      hierarchyData.cities = cities.map((city) => city.name)
    } else if (type === "city") {
      const parts = id.split("-")
      const countryCode = parts[0]
      const stateCode = parts[1]
      const country = Country.getCountryByCode(countryCode)
      const state = State.getStateByCodeAndCountry(stateCode, countryCode)

      hierarchyData.country = country?.name || ""
      hierarchyData.states = [state?.name || ""]
      hierarchyData.cities = [name]
    }

    setFormData((prev) => ({
      ...prev,
      geographySelections: [name],
      geographyHierarchy: hierarchyData,
    }))

    console.log("Geography hierarchy data to send to backend:", hierarchyData)
  }

  const clearGeographySelection = () => {
    setGeoSelection({
      selectedId: null,
      selectedName: null,
    })

    setFormData((prev) => ({
      ...prev,
      geographySelections: [],
      geographyHierarchy: undefined,
    }))
  }

  const removeCountry = (countryToRemove: string) => {
    clearGeographySelection()
  }

  // Updated industry selection handler to collect hierarchical data
  const handleIndustryRadioChange = (industryName: string) => {
    if (!industryData) return

    const subIndustryNames: string[] = []
    let selectedIndustryType = "industry"
    const hierarchyData = {
      selectedItem: industryName,
      subIndustries: [] as string[],
    }

    // Search through all levels to find the selected item and collect sub-industries
    industryData.sectors.forEach((sector) => {
      if (sector.name === industryName) {
        selectedIndustryType = "sector"
        sector.industryGroups.forEach((group) => {
          group.industries.forEach((industry) => {
            industry.subIndustries.forEach((subIndustry) => {
              subIndustryNames.push(subIndustry.name)
            })
          })
        })
      } else {
        sector.industryGroups.forEach((group) => {
          if (group.name === industryName) {
            selectedIndustryType = "industryGroup"
            group.industries.forEach((industry) => {
              industry.subIndustries.forEach((subIndustry) => {
                subIndustryNames.push(subIndustry.name)
              })
            })
          } else {
            group.industries.forEach((industry) => {
              if (industry.name === industryName) {
                selectedIndustryType = "industry"
                industry.subIndustries.forEach((subIndustry) => {
                  subIndustryNames.push(subIndustry.name)
                })
              } else {
                industry.subIndustries.forEach((subIndustry) => {
                  if (subIndustry.name === industryName) {
                    selectedIndustryType = "subIndustry"
                    subIndustryNames.push(subIndustry.name)
                  }
                })
              }
            })
          }
        })
      }
    })

    hierarchyData.subIndustries = subIndustryNames.length > 0 ? subIndustryNames : [industryName]

    setFormData((prev) => ({
      ...prev,
      industrySelections: subIndustryNames.length > 0 ? subIndustryNames : [industryName],
      selectedIndustryDisplay: industryName,
      industryHierarchy: hierarchyData,
  }))

    console.log(`Selected ${selectedIndustryType}: ${industryName}`)
    console.log("Industry hierarchy data to send to backend:", hierarchyData)
  }

  const toggleSector = (sector: Sector) => {
    const newIndustrySelection = { ...industrySelection }
    const isSelected = !industrySelection.sectors[sector.id]

    newIndustrySelection.sectors[sector.id] = isSelected

    sector.industryGroups.forEach((group) => {
      newIndustrySelection.industryGroups[group.id] = isSelected

      group.industries.forEach((industry) => {
        newIndustrySelection.industries[industry.id] = isSelected

        industry.subIndustries.forEach((subIndustry) => {
          newIndustrySelection.subIndustries[subIndustry.id] = isSelected

          if (subIndustry.activities) {
            subIndustry.activities.forEach((activity) => {
              newIndustrySelection.activities[activity.id] = isSelected
            })
          }
        })
      })
    })

    setIndustrySelection(newIndustrySelection)
    updateIndustriesInFormData(newIndustrySelection)
  }

  const toggleIndustryGroup = (group: IndustryGroup, sector: Sector) => {
    const newIndustrySelection = { ...industrySelection }
    const isSelected = !industrySelection.industryGroups[group.id]

    newIndustrySelection.industryGroups[group.id] = isSelected

    group.industries.forEach((industry) => {
      newIndustrySelection.industries[industry.id] = isSelected

      industry.subIndustries.forEach((subIndustry) => {
        newIndustrySelection.subIndustries[subIndustry.id] = isSelected

        if (subIndustry.activities) {
          subIndustry.activities.forEach((activity) => {
            newIndustrySelection.activities[activity.id] = isSelected
          })
        }
      })
    })

    const allGroupsSelected = sector.industryGroups.every((g) =>
      g.id === group.id ? isSelected : newIndustrySelection.industryGroups[g.id],
    )

    const allGroupsDeselected = sector.industryGroups.every((g) =>
      g.id === group.id ? !isSelected : !newIndustrySelection.industryGroups[g.id],
    )

    if (allGroupsSelected) {
      newIndustrySelection.sectors[sector.id] = true
    } else if (allGroupsDeselected) {
      newIndustrySelection.sectors[sector.id] = false
    }

    setIndustrySelection(newIndustrySelection)
    updateIndustriesInFormData(newIndustrySelection)
  }

  const toggleIndustry = (industry: Industry, group: IndustryGroup, sector: Sector) => {
    const newIndustrySelection = { ...industrySelection }
    const isSelected = !industrySelection.industries[industry.id]

    newIndustrySelection.industries[industry.id] = isSelected

    industry.subIndustries.forEach((subIndustry) => {
      newIndustrySelection.subIndustries[subIndustry.id] = isSelected

      if (subIndustry.activities) {
        subIndustry.activities.forEach((activity) => {
          newIndustrySelection.activities[activity.id] = isSelected
        })
      }
    })

    const allIndustriesSelected = group.industries.every((i) =>
      i.id === industry.id ? isSelected : newIndustrySelection.industries[i.id],
    )

    const allIndustriesDeselected = group.industries.every((i) =>
      i.id === industry.id ? !isSelected : newIndustrySelection.industries[i.id],
    )

    if (allIndustriesSelected) {
      newIndustrySelection.industryGroups[group.id] = true
    } else if (allIndustriesDeselected) {
      newIndustrySelection.industryGroups[group.id] = false
    }

    const allGroupsSelected = sector.industryGroups.every((g) =>
      g.id === group.id ? newIndustrySelection.industryGroups[g.id] : newIndustrySelection.industryGroups[g.id],
    )

    const allGroupsDeselected = sector.industryGroups.every((g) =>
      g.id === group.id ? !newIndustrySelection.industryGroups[g.id] : !newIndustrySelection.industryGroups[g.id],
    )

    if (allGroupsSelected) {
      newIndustrySelection.sectors[sector.id] = true
    } else if (allGroupsDeselected) {
      newIndustrySelection.sectors[sector.id] = false
    }

    setIndustrySelection(newIndustrySelection)
    updateIndustriesInFormData(newIndustrySelection)
  }

  const toggleSubIndustry = (subIndustry: SubIndustry, industry: Industry, group: IndustryGroup, sector: Sector) => {
    const newIndustrySelection = { ...industrySelection }
    const isSelected = !industrySelection.subIndustries[subIndustry.id]

    newIndustrySelection.subIndustries[subIndustry.id] = isSelected

    if (subIndustry.activities) {
      subIndustry.activities.forEach((activity) => {
        newIndustrySelection.activities[activity.id] = isSelected
      })
    }

    const allSubIndustriesSelected = industry.subIndustries.every((si) =>
      si.id === subIndustry.id ? isSelected : newIndustrySelection.subIndustries[si.id],
    )

    const allSubIndustriesDeselected = industry.subIndustries.every((si) =>
      si.id === subIndustry.id ? !isSelected : !newIndustrySelection.subIndustries[si.id],
    )

    if (allSubIndustriesSelected) {
      newIndustrySelection.industries[industry.id] = true
    } else if (allSubIndustriesDeselected) {
      newIndustrySelection.industries[industry.id] = false
    }

    const allIndustriesSelected = group.industries.every((i) => newIndustrySelection.industries[i.id])
    const allIndustriesDeselected = group.industries.every((i) => !newIndustrySelection.industries[i.id])

    if (allIndustriesSelected) {
      newIndustrySelection.industryGroups[group.id] = true
    } else if (allIndustriesDeselected) {
      newIndustrySelection.industryGroups[group.id] = false
    }

    const allGroupsSelected = sector.industryGroups.every((g) => newIndustrySelection.industryGroups[g.id])
    const allGroupsDeselected = sector.industryGroups.every((g) => !newIndustrySelection.industryGroups[g.id])

    if (allGroupsSelected) {
      newIndustrySelection.sectors[sector.id] = true
    } else if (allGroupsDeselected) {
      newIndustrySelection.sectors[sector.id] = false
    }

    setIndustrySelection(newIndustrySelection)
    updateIndustriesInFormData(newIndustrySelection)
  }

  const toggleActivity = (
    activity: Activity,
    subIndustry: SubIndustry,
    industry: Industry,
    group: IndustryGroup,
    sector: Sector,
  ) => {
    const newIndustrySelection = { ...industrySelection }
    const isSelected = !industrySelection.activities[activity.id]

    newIndustrySelection.activities[activity.id] = isSelected

    if (subIndustry.activities) {
      const allActivitiesSelected = subIndustry.activities.every((a) =>
        a.id === activity.id ? isSelected : newIndustrySelection.activities[a.id],
      )

      const allActivitiesDeselected = subIndustry.activities.every((a) =>
        a.id === activity.id ? !isSelected : !newIndustrySelection.activities[a.id],
      )

      if (allActivitiesSelected) {
        newIndustrySelection.subIndustries[subIndustry.id] = true
      } else if (allActivitiesDeselected) {
        newIndustrySelection.subIndustries[subIndustry.id] = false
      }
    }

    const allSubIndustriesSelected = industry.subIndustries.every((si) => newIndustrySelection.subIndustries[si.id])
    const allSubIndustriesDeselected = industry.subIndustries.every((si) => !newIndustrySelection.subIndustries[si.id])

    if (allSubIndustriesSelected) {
      newIndustrySelection.industries[industry.id] = true
    } else if (allSubIndustriesDeselected) {
      newIndustrySelection.industries[industry.id] = false
    }

    const allIndustriesSelected = group.industries.every((i) => newIndustrySelection.industries[i.id])
    const allIndustriesDeselected = group.industries.every((i) => !newIndustrySelection.industries[i.id])

    if (allIndustriesSelected) {
      newIndustrySelection.industryGroups[group.id] = true
    } else if (allIndustriesDeselected) {
      newIndustrySelection.industryGroups[group.id] = false
    }

    const allGroupsSelected = sector.industryGroups.every((g) => newIndustrySelection.industryGroups[g.id])
    const allGroupsDeselected = sector.industryGroups.every((g) => !newIndustrySelection.industryGroups[g.id])

    if (allGroupsSelected) {
      newIndustrySelection.sectors[sector.id] = true
    } else if (allGroupsDeselected) {
      newIndustrySelection.sectors[sector.id] = false
    }

    setIndustrySelection(newIndustrySelection)
    updateIndustriesInFormData(newIndustrySelection)
  }

  const toggleSubIndustryExpansion = (subIndustryId: string) => {
    setExpandedSubIndustries((prev) => ({
      ...prev,
      [subIndustryId]: !prev[subIndustryId],
    }))
  }

  const updateIndustriesInFormData = (selection: IndustrySelection) => {
    if (!industryData) return

    const selectedIndustries: string[] = []

    industryData.sectors.forEach((sector) => {
      const sectorSelected = selection.sectors[sector.id]

      const allGroupsSelected = sector.industryGroups.every((group) => {
        return group.industries.every((industry) => selection.industries[industry.id])
      })

      if (sectorSelected && allGroupsSelected) {
        selectedIndustries.push(sector.name)
      } else {
        sector.industryGroups.forEach((group) => {
          const groupSelected = selection.industryGroups[group.id]

          const allIndustriesSelected = group.industries.every((industry) => selection.industries[industry.id])

          if (groupSelected && allIndustriesSelected) {
            selectedIndustries.push(group.name)
          } else {
            group.industries.forEach((industry) => {
              if (selection.industries[industry.id]) {
                selectedIndustries.push(industry.name)
              }
            })
          }
        })
      }
    })

    setFormData((prev) => ({
      ...prev,
      industrySelections: selectedIndustries,
    }))
  }

  const removeIndustry = (industryToRemove: string) => {
    if (!industryData) return

    const newIndustrySelection = { ...industrySelection }
    let found = false

    industryData.sectors.forEach((sector) => {
      if (sector.name === industryToRemove) {
        newIndustrySelection.sectors[sector.id] = false
        found = true

        sector.industryGroups.forEach((group) => {
          newIndustrySelection.industryGroups[group.id] = false

          group.industries.forEach((industry) => {
            newIndustrySelection.industries[industry.id] = false
          })
        })
      }

      if (!found) {
        sector.industryGroups.forEach((group) => {
          if (group.name === industryToRemove) {
            newIndustrySelection.industryGroups[group.id] = false
            found = true

            group.industries.forEach((industry) => {
              newIndustrySelection.industries[industry.id] = false
            })

            const allGroupsDeselected = sector.industryGroups.every((g) => !newIndustrySelection.industryGroups[g.id])

            if (allGroupsDeselected) {
              newIndustrySelection.sectors[sector.id] = false
            }
          }

          if (!found) {
            group.industries.forEach((industry) => {
              if (industry.name === industryToRemove) {
                newIndustrySelection.industries[industry.id] = false
                found = true

                const allIndustriesDeselected = group.industries.every((i) => !newIndustrySelection.industries[i.id])

                if (allIndustriesDeselected) {
                  newIndustrySelection.industryGroups[group.id] = false

                  const allGroupsDeselected = sector.industryGroups.every(
                    (g) => !newIndustrySelection.industryGroups[g.id],
                  )

                  if (allGroupsDeselected) {
                    newIndustrySelection.sectors[sector.id] = false
                  }
                }
              }
            })
          }
        })
      }
    })

    setIndustrySelection(newIndustrySelection)
    updateIndustriesInFormData(newIndustrySelection)
  }

  const toggleRegionExpansion = (regionId: string) => {
    setExpandedRegions((prev) => {
      const newState = {
        ...prev,
        [regionId]: !prev[regionId],
      }
      return newState
    })
  }

  const toggleSectorExpansion = (sectorId: string) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sectorId]: !prev[sectorId],
    }))
  }

  const toggleIndustryGroupExpansion = (groupId: string) => {
    setExpandedIndustryGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const renderGeographySelection = () => {
    const filteredGeoData = flatGeoData
      .filter(
        (item) =>
          !debouncedGeoSearch ||
          item.name.toLowerCase().includes(debouncedGeoSearch.toLowerCase()) ||
          item.path.toLowerCase().includes(debouncedGeoSearch.toLowerCase()),
      )
      .slice(0, 200)

    const groupedData = filteredGeoData.reduce(
      (acc, item) => {
        const countryCode = item.countryCode || item.id
        if (!acc[countryCode]) {
          acc[countryCode] = {
            country: null,
            states: [],
            cities: [],
          }
        }

        if (item.type === "country") {
          acc[countryCode].country = item
        } else if (item.type === "state") {
          acc[countryCode].states.push(item)
        } else if (item.type === "city") {
          acc[countryCode].cities.push(item)
        }

        return acc
      },
      {} as Record<string, { country: GeoItem | null; states: GeoItem[]; cities: GeoItem[] }>,
    )

    const countryLimit = debouncedGeoSearch ? 50 : 20

    return (
      <div className="space-y-2 font-poppins">
        {Object.values(groupedData)
          .filter((group) => group.country || group.states.length > 0 || group.cities.length > 0)
          .slice(0, countryLimit)
          .map((group, groupIndex) => {
            if (!group.country) return null
            const country = group.country

            const filteredStates = group.states.slice(0, 10)
            const filteredCities = group.cities.slice(0, 10)

            return (
              <div key={`country-${country.id}-${groupIndex}`} className="border-b border-gray-100 pb-1">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`geo-${country.id}`}
                    name="geography"
                    checked={geoSelection.selectedId === country.id}
                    onChange={() => selectGeography(country.id, country.name, "country")}
                    className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                  />
                  <div
                    className="flex items-center cursor-pointer flex-1"
                    onClick={() => toggleContinentExpansion(country.id)}
                  >
                    {expandedContinents[country.id] ? (
                      <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                    )}
                    <Label htmlFor={`geo-${country.id}`} className="text-[#344054] cursor-pointer font-medium">
                      {country.name}
                    </Label>
                  </div>
                </div>

                {expandedContinents[country.id] && filteredStates.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {filteredStates.map((state, stateIndex) => (
                      <div key={`state-${state.id}-${stateIndex}`} className="pl-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`geo-${state.id}`}
                            name="geography"
                            checked={geoSelection.selectedId === state.id}
                            onChange={() => selectGeography(state.id, state.path, "state")}
                            className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                          />
                          <Label htmlFor={`geo-${state.id}`} className="text-[#344054] cursor-pointer">
                            {state.name}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedContinents[country.id] && filteredCities.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {filteredCities.map((city, cityIndex) => (
                      <div key={`city-${city.id}-${cityIndex}`} className="pl-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`geo-${city.id}`}
                            name="geography"
                            checked={geoSelection.selectedId === city.id}
                            onChange={() => selectGeography(city.id, city.path, "city")}
                            className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                          />
                          <Label htmlFor={`geo-${city.id}`} className="text-[#344054] cursor-pointer">
                            {city.name}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        {Object.values(groupedData).length > countryLimit && (
          <div className="text-center py-2 text-sm text-gray-500">
            {debouncedGeoSearch
              ? `Showing first ${countryLimit} matching countries. Refine your search for better results.`
              : `Showing first ${countryLimit} countries. Use search to find more.`}
          </div>
        )}
      </div>
    )
  }

  const memoizedFilteredGeoData = useMemo(() => {
    return flatGeoData
      .filter(
        (item) =>
          !debouncedGeoSearch ||
          item.name.toLowerCase().includes(debouncedGeoSearch.toLowerCase()) ||
          item.path.toLowerCase().includes(debouncedGeoSearch.toLowerCase()),
      )
      .slice(0, 100)
  }, [flatGeoData, debouncedGeoSearch])

  const memoizedFilteredIndustryData = useMemo(() => {
    if (!industryData || !debouncedIndustrySearch) return industryData

    const filteredSectors = industryData.sectors
      .map((sector) => {
        const filteredIndustryGroups = sector.industryGroups
          .map((group) => {
            const filteredIndustries = group.industries
              .map((industry) => {
                const filteredSubIndustries = industry.subIndustries.filter((subIndustry) =>
                  subIndustry.name.toLowerCase().includes(debouncedIndustrySearch.toLowerCase()),
                )

                if (
                  industry.name.toLowerCase().includes(debouncedIndustrySearch.toLowerCase()) ||
                  filteredSubIndustries.length > 0
                ) {
                  return { ...industry, subIndustries: filteredSubIndustries }
                }
                return null
              })
              .filter(Boolean) as Industry[]

            if (
              group.name.toLowerCase().includes(debouncedIndustrySearch.toLowerCase()) ||
              filteredIndustries.length > 0
            ) {
              return { ...group, industries: filteredIndustries }
            }
            return null
          })
          .filter(Boolean) as IndustryGroup[]

        if (
          sector.name.toLowerCase().includes(debouncedIndustrySearch.toLowerCase()) ||
          filteredIndustryGroups.length > 0
        ) {
          return { ...sector, industryGroups: filteredIndustryGroups }
        }
        return null
      })
      .filter(Boolean) as Sector[]

    return { ...industryData, sectors: filteredSectors }
  }, [industryData, debouncedIndustrySearch])

  const filterIndustryData = () => {
    if (!industryData) return null

    if (!industrySearchTerm) {
      return industryData
    }

    const filteredSectors = industryData.sectors
      .map((sector) => {
        const filteredIndustryGroups = sector.industryGroups
          .map((group) => {
            const filteredIndustries = group.industries
              .map((industry) => {
                const filteredSubIndustries = industry.subIndustries
                  .map((subIndustry) => {
                    if (subIndustry.name.toLowerCase().includes(industrySearchTerm.toLowerCase())) {
                      return subIndustry
                    }
                    return null
                  })
                  .filter(Boolean) as SubIndustry[]

                if (
                  industry.name.toLowerCase().includes(industrySearchTerm.toLowerCase()) ||
                  filteredSubIndustries.length > 0
                ) {
                  return { ...industry, subIndustries: filteredSubIndustries }
                }
                return null
              })
              .filter(Boolean) as Industry[]

            if (group.name.toLowerCase().includes(industrySearchTerm.toLowerCase()) || filteredIndustries.length > 0) {
              return { ...group, industries: filteredIndustries }
            }
            return null
          })
          .filter(Boolean) as IndustryGroup[]

        if (sector.name.toLowerCase().includes(industrySearchTerm.toLowerCase()) || filteredIndustryGroups.length > 0) {
          return { ...sector, industryGroups: filteredIndustryGroups }
        }
        return null
      })
      .filter(Boolean) as Sector[]

    return { ...industryData, sectors: filteredSectors }
  }

  const renderIndustrySelection = () => {
    const filteredData = filterIndustryData()
    if (!filteredData) return <div>Loading industry data...</div>

    return (
      <div className="space-y-2">
        {filteredData.sectors.map((sector) => (
          <div key={sector.id} className="border-b border-gray-100 pb-1">
            <div className="flex items-center">
              <input
                type="radio"
                id={`sector-${sector.id}`}
                name="industry"
                checked={formData.selectedIndustryDisplay === sector.name}
                onChange={() => handleIndustryRadioChange(sector.name)}
                className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
              />
              <div className="flex items-center cursor-pointer flex-1" onClick={() => toggleSectorExpansion(sector.id)}>
                {expandedSectors[sector.id] ? (
                  <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                )}
                <Label htmlFor={`sector-${sector.id}`} className="text-[#344054] cursor-pointer font-medium">
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
                        checked={formData.selectedIndustryDisplay === group.name}
                        onChange={() => handleIndustryRadioChange(group.name)}
                        className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                      />
                      <div
                        className="flex items-center cursor-pointer flex-1"
                        onClick={() => toggleIndustryGroupExpansion(group.id)}
                      >
                        <Label htmlFor={`group-${group.id}`} className="text-[#344054] cursor-pointer">
                          {group.name}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = []
      let hasError = false

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]

        const allowedTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/html",
          "text/plain",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ]

        if (!allowedTypes.includes(file.type)) {
          setFileError(
            `File ${file.name} is not a supported format. Please upload PDF, DOCX, XLSX, PPTX, HTML, TXT, or image files.`,
          )
          hasError = true
          break
        }

        if (file.size > 10 * 1024 * 1024) {
          setFileError(`File ${file.name} exceeds 10MB limit`)
          hasError = true
          break
        }

        newFiles.push(file)
      }

      if (!hasError) {
        setFileError(null)
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, ...newFiles],
        }))

        toast({
          title: "Files Selected",
          description: `${newFiles.length} file(s) selected for upload`,
        })
      }
    }
  }

  const removeDocument = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== indexToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const errors: { [key: string]: string } = {}
    try {
      if (!formData.dealTitle.trim()) throw new Error("Deal title is required")
      if (!formData.companyDescription.trim()) throw new Error("Company description is required")
      if (formData.geographySelections.length === 0) throw new Error("Please select a geography")
      if (formData.industrySelections.length === 0) throw new Error("Please select at least one industry")
      if (!formData.yearsInBusiness || formData.yearsInBusiness < 0)
        throw new Error("Years in business must be a positive number")
      if (!formData.companyType || formData.companyType.length === 0) throw new Error("Please select a buyer type")

      if (formData.businessModels.length === 0) {
        errors.businessModels = "Please select at least one business model."
      }

      if (!formData.managementPreferences.trim()) {
        errors.managementPreferences = "Please enter your management future preferences."
      }

      if (!formData.capitalAvailability || formData.capitalAvailability.length === 0) {
        errors.capitalAvailability = "Please select capital availability."
      }
      if (!formData.companyType || formData.companyType.length === 0) {
        errors.companyType = "Please select at least one company type."
      }

      if (formData.trailingEBITDA >= formData.trailingRevenue && formData.trailingRevenue > 0) {
        errors.trailingEBITDA = "Trailing 12 Month EBITDA must be smaller than Trailing 12 Month Revenue."
      }

      setFieldErrors(errors)
      if (Object.keys(errors).length > 0) {
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("token")
      const sellerId = localStorage.getItem("userId")
      if (!token || !sellerId) throw new Error("Authentication required")

      // Compose the payload (no timeline, createdAt, updatedAt)
      const rewardLevelMap: Record<string, "Seed" | "Bloom" | "Fruit"> = {
        seed: "Seed",
        bloom: "Bloom",
        fruit: "Fruit",
      };

      // Enhanced payload with hierarchical data
      const dealData: any = {
        title: formData.dealTitle,
        companyDescription: formData.companyDescription,
        companyType: formData.companyType.length > 0 ? formData.companyType.join(", ") : "Other",
        dealType: "acquisition",
        status: "draft",
        visibility: selectedReward || "seed",
        rewardLevel: rewardLevelMap[selectedReward || "seed"],
        industrySector: formData.industrySelections[0] || "Other",
        geographySelection: formData.geographySelections[0] || "Global",
        // Add hierarchical data
        geographyHierarchy: formData.geographyHierarchy,
        industryHierarchy: formData.industryHierarchy,
        yearsInBusiness: formData.yearsInBusiness || 0,
        seller: sellerId,
        financialDetails: {
          trailingRevenueCurrency: formData.currency || "USD($)",
          trailingRevenueAmount: formData.trailingRevenue || 0,
          trailingEBITDAAmount: formData.trailingEBITDA || 0,
          t12FreeCashFlow: formData.t12FreeCashFlow || 0,
          t12NetIncome: formData.t12NetIncome || 0,
          avgRevenueGrowth: formData.revenueGrowth || 0,
          netIncome: formData.netIncome || 0,
          askingPrice: formData.askingPrice || 0,
        },
        businessModel: {
          recurringRevenue: formData.businessModels.includes("recurring-revenue"),
          projectBased: formData.businessModels.includes("project-based"),
          assetLight: formData.businessModels.includes("asset-light"),
          assetHeavy: formData.businessModels.includes("asset-heavy"),
        },
        managementPreferences: formData.managementPreferences,
        buyerFit: {
          capitalAvailability: formData.capitalAvailability.map((item) =>
            item === "ready" ? "Ready to deploy immediately" : item === "need-raise" ? "Need to raise" : item,
          ),
          minPriorAcquisitions: formData.minPriorAcquisitions || 0,
          minTransactionSize: formData.minTransactionSize || 0,
        },
        targetedBuyers: [],
        interestedBuyers: [],
        tags: [],
        isPublic: false,
        isFeatured: false,
        stakePercentage: 100,
        priority: "medium",
      }

      if (formData.employeeCount && formData.employeeCount > 0) {
        dealData.employeeCount = formData.employeeCount
      }

      if (!["seed", "bloom", "fruit"].includes(dealData.visibility)) {
        dealData.visibility = "seed"
      }

      console.log("Documents to upload:", formData.documents.length)
      console.log("Geography hierarchy data:", formData.geographyHierarchy)
      console.log("Industry hierarchy data:", formData.industryHierarchy)

      const apiUrl = localStorage.getItem("apiUrl") || "https://api.cimamplify.com"

      const multipartFormData = new FormData()
      multipartFormData.append("dealData", JSON.stringify(dealData))

      formData.documents.forEach((file) => {
        multipartFormData.append("files", file)
      })

      const response = await fetch(`${apiUrl}/deals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: multipartFormData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          router.push("/seller/login?session=expired")
          throw new Error("Session expired. Please log in again.")
        }

        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to create deal: ${response.status}`)
      }

      const result = await response.json()
      console.log("Deal created successfully:", result)

      toast({
        title: "Success",
        description: "Your deal has been submitted successfully. Redirecting to buyer matching...",
      })

      setTimeout(() => {
        router.push(`/seller/deal?id=${result._id}&newDeal=true`)
      }, 2000)
    } catch (error: any) {
      console.error("Form submission error:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3aafa9]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seller Rewards */}
        <div className="bg-[#f0f7fa] p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Seller Rewards - Choose Reward Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Seed Option */}
            <Card
              className={`cursor-pointer border-4 ${
                selectedReward === "seed" ? "border-[#3aafa9]" : "border-gray-200"
              } overflow-hidden`}
              onClick={() => setSelectedReward("seed")}
            >
              <div className="flex flex-col h-full">
                <div className="p-4">
                  <div className="flex justify-between overflow-hidden">
                    <h3 className="font-semibold text-[#3aafa9]">Seed</h3>
                    <Image width={100} height={100} src="/seed.svg" alt="seed" className="w-20 h-20" />
                  </div>
                  <p className="text-sm mt-2 text-gray-600">
                    This deal will be made widely available on other deal platforms. Most of our buyers refuse deals
                    from this level - you will get very few buyer matches.
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="p-4">
                      <div className="bg-[#3aafa9] text-white text-xs rounded-md px-3 py-3 inline-block">
                        <span className="text-[#F4E040]">$10</span> Amazon Gift Card for posting with us
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bloom Option */}
            <Card
              className={`cursor-pointer border-4 ${
                selectedReward === "bloom" ? "border-[#3aafa9]" : "border-gray-200"
              } overflow-hidden`}
              onClick={() => setSelectedReward("bloom")}
            >
              <div className="flex flex-col h-full">
                <div className="p-4">
                  <div className=" flex justify-between overflow-hidden">
                    <h3 className="font-semibold  text-[#3aafa9]">Bloom</h3>

                    <Image width={100} height={100} src="/bloom.svg" alt="bloom" className="w-20 h-20 " />
                  </div>{" "}
                  <p className="text-sm mt-2 text-gray-600">
                    Give CIM Amplify a two week head start! This deal will be posted exclusively on CIM Amplify for two
                    weeks and no other deal sites including your own website. Feel free to market directly to buyers you
                    do not choose on CIM Amplify.
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="p-4">
                      <div className="bg-[#3aafa9] text-white text-xs rounded-md px-3 py-3 inline-block">
                        <span className="text-[#F4E040]">$25</span> Amazon Gift Card for posting with us PLUS $5,000 if
                        acquired via CIM Amplify
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Fruit Option */}
            <Card
              className={`cursor-pointer border-4 ${
                selectedReward === "fruit" ? "border-[#3aafa9]" : "border-gray-200"
              } overflow-hidden`}
              onClick={() => setSelectedReward("fruit")}
            >
              <div className="flex flex-col h-full">
                <div className="p-4">
                  <div className=" flex justify-between overflow-hidden">
                    <h3 className="font-semibold  text-[#3aafa9]">Fruit</h3>

                    <Image width={100} height={100} src="/fruit.svg" alt="Fruit" className="w-20 h-20 " />
                  </div>

                  <p className="text-sm mt-2 text-gray-600">
                    This deal will be posted exclusively on CIM Amplify and no other deal sites including your own
                    website. Feel free to market directly to buyers you do not choose on CIM Amplify.
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="p-4">
                      <div className="bg-[#3aafa9] text-white text-xs rounded-md px-3 py-3 inline-block">
                        <span className="text-[#F4E040]">$50</span> Amazon Gift Card for posting with us PLUS $10,000 if
                        acquired via CIM Amplify
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
              <label htmlFor="dealTitle" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              <Textarea
                id="companyDescription"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                placeholder="Make the company shine by being very specific about what the company does"
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Geography Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Location</label>
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
                      <div className="text-sm text-[#667085] mb-1">Selected </div>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        {formData.geographySelections.map((country, index) => (
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
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto">{renderGeographySelection()}</div>
                </div>
              </div>

              {/* Industry Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Selector</label>
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
                      <div className="text-sm text-[#667085] mb-1">Selected </div>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        <span
                          key="selected-industry-display"
                          className="bg-gray-100 text-[#344054] text-xs rounded-full px-2 py-0.5 flex items-center group"
                        >
                          {formData.selectedIndustryDisplay}
                          <span className="ml-1 text-gray-400 text-xs">
                            ({formData.industrySelections.length} sub-industries)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                industrySelections: [],
                                selectedIndustryDisplay: undefined,
                                industryHierarchy: undefined,
                              }))
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

                  <div className="flex-1 overflow-y-auto">{renderIndustrySelection()}</div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-1">
                Number of years in business
              </label>
              <Input
                id="yearsInBusiness"
                type="number"
                required
                min="0"
                value={formData.yearsInBusiness || ""}
                onChange={(e) => handleNumberChange(e, "yearsInBusiness")}
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Business Models <span className="text-red-500">*</span>
              </label>
              {fieldErrors.businessModels && <p className="text-red-500 text-sm mt-2">{fieldErrors.businessModels}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring-revenue"
                    checked={formData.businessModels.includes("recurring-revenue")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked === true, "recurring-revenue", "businessModels")
                    }
                  />
                  <label htmlFor="recurring-revenue" className="text-sm">
                    Recurring Revenue
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="project-based"
                    checked={formData.businessModels.includes("project-based")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked === true, "project-based", "businessModels")
                    }
                  />
                  <label htmlFor="project-based" className="text-sm">
                    Project-Based
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="asset-light"
                    checked={formData.businessModels.includes("asset-light")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked === true, "asset-light", "businessModels")
                    }
                  />
                  <label htmlFor="asset-light" className="text-sm">
                    Asset Light
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="asset-heavy"
                    checked={formData.businessModels.includes("asset-heavy")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked === true, "asset-heavy", "businessModels")
                    }
                  />
                  <label htmlFor="asset-heavy" className="text-sm">
                    Asset Heavy
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700 mb-3">
                Management Future Preferences <span className="text-red-500">*</span>
              </label>
              {fieldErrors.managementPreferences && (
                <p className="text-red-500 text-sm mt-2">{fieldErrors.managementPreferences}</p>
              )}
              <textarea
                id="managementPreferences"
                name="managementPreferences"
                value={formData.managementPreferences}
                onChange={handleInputChange}
                rows={4}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="Enter management future preferences"
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
                <label htmlFor="trailingRevenue" className="block text-sm font-medium text-gray-700 mb-1">
                  Trailing 12 Month Revenue
                </label>
                <div className="flex">
                  <Input
                    id="trailingRevenue"
                    type="text"
                    value={formData.trailingRevenue ? formatNumberWithCommas(formData.trailingRevenue) : ""}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "")
                      if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                        const numValue = rawValue === "" ? 0 : Number.parseFloat(rawValue)
                        handleNumberChange(
                          {
                            target: { value: rawValue },
                          } as React.ChangeEvent<HTMLInputElement>,
                          "trailingRevenue",
                        )

                        const validationError = validateEBITDAvsRevenue(formData.trailingEBITDA, numValue)
                        setRealtimeErrors((prev) => ({
                          ...prev,
                          trailingEBITDA: validationError || "",
                        }))
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <Select value={formData.currency} onValueChange={(value) => handleSelectChange(value, "currency")}>
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
                <label htmlFor="trailingEBITDA" className="block text-sm font-medium text-gray-700 mb-1">
                  Trailing 12 Month EBITDA(0 covers negative)
                </label>
                <Input
                  id="trailingEBITDA"
                  type="text"
                  value={formData.trailingEBITDA !== undefined && formData.trailingEBITDA !== null ? formatNumberWithCommas(formData.trailingEBITDA) : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "")
                    if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                      const numValue = rawValue === "" ? 0 : Number.parseFloat(rawValue)
                      handleNumberChange(
                        { target: { value: rawValue } } as React.ChangeEvent<HTMLInputElement>,
                        "trailingEBITDA",
                      )
                      const validationError = validateEBITDAvsRevenue(numValue, formData.trailingRevenue)
                      setRealtimeErrors((prev) => ({
                        ...prev,
                        trailingEBITDA: validationError || "",
                      }))
                    }
                  }}
                  className="w-full"
                />
                {(fieldErrors.trailingEBITDA || realtimeErrors.trailingEBITDA) && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.trailingEBITDA || realtimeErrors.trailingEBITDA}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="revenueGrowth" className="block text-sm font-medium text-gray-700 mb-1">
                  Average 3 year revenue growth in %(0 covers negative)
                </label>
                <Input
                  id="revenueGrowth"
                  type="text"
                  value={formData.revenueGrowth !== undefined && formData.revenueGrowth !== null ? formatNumberWithCommas(formData.revenueGrowth) : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "")
                    if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                      handleNumberChange(
                        { target: { value: rawValue } } as React.ChangeEvent<HTMLInputElement>,
                        "revenueGrowth",
                      )
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Optional Information */}
        <section className="bg-[#f9f9f9] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Optional Financial Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="t12FreeCashFlow" className="block text-sm font-medium text-gray-700 mb-1">
                T12 Free Cash Flow
              </label>
              <Input
                id="t12FreeCashFlow"
                type="text"
                value={formData.t12FreeCashFlow ? formatNumberWithCommas(formData.t12FreeCashFlow) : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "")
                  if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                    handleNumberChange(
                      {
                        target: { value: rawValue },
                      } as React.ChangeEvent<HTMLInputElement>,
                      "t12FreeCashFlow",
                    )
                  }
                }}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="t12NetIncome" className="block text-sm font-medium text-gray-700 mb-1">
                T12 Net Income
              </label>
              <Input
                id="t12NetIncome"
                type="text"
                value={formData.t12NetIncome ? formatNumberWithCommas(formData.t12NetIncome) : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "")
                  if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                    handleNumberChange(
                      {
                        target: { value: rawValue },
                      } as React.ChangeEvent<HTMLInputElement>,
                      "t12NetIncome",
                    )
                  }
                }}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="netIncome" className="block text-sm font-medium text-gray-700 mb-1">
                Net Income
              </label>
              <Input
                id="netIncome"
                type="text"
                value={formData.netIncome ? formatNumberWithCommas(formData.netIncome) : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "")
                  if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                    handleNumberChange(
                      {
                        target: { value: rawValue },
                      } as React.ChangeEvent<HTMLInputElement>,
                      "netIncome",
                    )
                  }
                }}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="askingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Asking Price
              </label>
              <Input
                id="askingPrice"
                type="text"
                value={formData.askingPrice ? formatNumberWithCommas(formData.askingPrice) : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "")
                  if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                    handleNumberChange(
                      {
                        target: { value: rawValue },
                      } as React.ChangeEvent<HTMLInputElement>,
                      "askingPrice",
                    )
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Buyer Fit / Ability to Close */}
        <section className="bg-[#f9f9f9] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Buyer Fit / Ability to Close</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Capital Availability <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ready-capital"
                  checked={formData.capitalAvailability.includes("ready")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleMultiSelectChange("ready", "capitalAvailability")
                    } else {
                      handleMultiSelectChange("ready", "capitalAvailability")
                    }
                  }}
                  className="border-[#d0d5dd]"
                />
                <label htmlFor="ready-capital" className="text-sm">
                  Ready to deploy immediately
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="need-raise"
                  checked={formData.capitalAvailability.includes("need-raise")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleMultiSelectChange("need-raise", "capitalAvailability")
                    } else {
                      handleMultiSelectChange("need-raise", "capitalAvailability")
                    }
                  }}
                  className="border-[#d0d5dd]"
                />
                <label htmlFor="need-raise" className="text-sm">
                  Need to raise
                </label>
              </div>
            </div>

            {fieldErrors.capitalAvailability && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.capitalAvailability}</p>
            )}
          </div>

          <div className="md:col-span-2 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left h-auto min-h-11 px-3 py-2 border border-gray-300 hover:border-gray-400 focus:border-[#3aafa9] focus:ring-2 focus:ring-[#3aafa9]/20 rounded-md overflow-hidden bg-transparent"
                >
                  <span
                    className={`${Array.isArray(formData.companyType) && formData.companyType.length > 0 ? "text-gray-900" : "text-gray-500"} truncate block pr-2`}
                  >
                    {Array.isArray(formData.companyType) && formData.companyType.length > 0
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
                    <h3 className="text-sm font-medium text-gray-900">Select Company Types</h3>
                    <span className="text-xs text-gray-500">
                      {Array.isArray(formData.companyType) ? formData.companyType.length : 0} selected
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
                        ]
                        setFormData((prev) => ({ ...prev, companyType: allOptions }))
                      }}
                      className="flex-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, companyType: [] }))}
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
                    const isChecked = Array.isArray(formData.companyType) && formData.companyType.includes(option)

                    return (
                      <div
                        key={option}
                        className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                          isChecked ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleMultiSelectChange(option, "companyType")}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="h-4 w-4 border-gray-300 rounded appearance-none border-2 checked:bg-[#3aafa9] checked:border-[#3aafa9] focus:ring-[#3aafa9] focus:ring-2 transition-colors"
                          />
                          {isChecked && (
                            <svg
                              className="absolute inset-0 h-4 w-4 text-white pointer-events-none"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <label
                          className={`text-sm cursor-pointer flex-1 select-none ${
                            isChecked ? "font-medium text-blue-900" : "text-gray-700"
                          }`}
                        >
                          {option}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {fieldErrors.companyType && <p className="text-red-500 text-sm mt-2">{fieldErrors.companyType}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minPriorAcquisitions" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Number of Prior Acquisitions
              </label>
              <Input
                id="minPriorAcquisitions"
                type="number"
                min="0"
                value={formData.minPriorAcquisitions || ""}
                onChange={(e) => handleNumberChange(e, "minPriorAcquisitions")}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="minTransactionSize" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Transaction Size
              </label>
              <Input
                id="minTransactionSize"
                type="text"
                value={formData.minTransactionSize ? formatNumberWithCommas(formData.minTransactionSize) : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "")
                  if (rawValue === "" || /^-?\d*$/.test(rawValue)) {
                    handleNumberChange(
                      {
                        target: { value: rawValue },
                      } as React.ChangeEvent<HTMLInputElement>,
                      "minTransactionSize",
                    )
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="bg-[#f9f9f9] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
          <p className="text-sm text-gray-600 mb-4">
            In this section you can add relevant documents like the CIM/CIP. Keep in mind the buyer has already agreed
            to our{" "}
            <Link
              href="/buyer/universalNDA"
              className="text-[#38A4F1] hover:text-[#2a9d8f] cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Straight to CIM NDA"
            </Link>{" "}
            so you and your client are covered.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <div className="mb-4 flex flex-col items-center">
              <p className="text-sm mb-2">Click to select files</p>
              <p className="text-xs text-gray-500 mb-4">
                .PDF, .DOCX, .XLSX, .PPTX, .HTML, .TXT, Images (Max 10MB each)
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-gray-300"
              >
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.pptx,.html,.txt,.jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {formData.documents.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <span className="text-sm text-gray-600 font-medium">{file.name}</span>
                          <div className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fileError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{fileError}</p>
              </div>
            )}
          </div>
        </section>

        {/* Seller Matching and Buyer Selection */}
        <section className="bg-[#f9f9f9] p-6 rounded-lg">
          <div>
            <p className="text-md font-medium text-gray-600 mb-4">
              By clicking on Submit you agree to CIM Ampliify{" "}
              <Link
                href="/buyer/terms"
                className="text-[#38A4F1] hover:text-[#2a9d8f] cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions.
              </Link>
              &nbsp;After clicking on Submit you will be presented with a list of matched potential buyers for
              selection.
            </p>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-[#3aafa9] hover:bg-[#2a9d8f] text-white px-8 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>

      <Toaster />
    </div>
  )
}