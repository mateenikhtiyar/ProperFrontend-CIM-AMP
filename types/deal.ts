export interface DealFinancialDetails {
  trailingRevenueCurrency: string
  trailingRevenueAmount: number
  trailingEBITDACurrency: string
  trailingEBITDAAmount: number
  avgRevenueGrowth: number
  netIncome: number
  askingPrice: number
  finalSalePrice?: number
}

export interface DealBusinessModel {
  recurringRevenue: boolean
  projectBased: boolean
  assetLight: boolean
  assetHeavy: boolean
}

export interface DealManagementPreferences {
  retiringDivesting: boolean
  staffStay: boolean
}

export interface DealBuyerFit {
  capitalAvailability: string
  minPriorAcquisitions: number
  minTransactionSize: number
}

export interface Deal {
  id: string
  title: string
  companyDescription: string
  dealType: string
  status: string
  visibility: string
  industry?: string
  industrySector: string
  geography: string
  yearsInBusiness: number
  financialDetails: DealFinancialDetails
  businessModel?: string
  businessMode?: string
  managementPreferences?: string
  buyerFit: DealBuyerFit
  targetedBuyers?: string[]
  tags?: string[]
  isPublic: boolean
  isFeatured: boolean
  stakePercentage: number
  documents?: string[]
  trailingRevenueCurrency?: string
  trailingRevenue: number
  trailingEbitda: number
  trailingEBITDA?: number
  trailingEbitdaCurrency?: string
  averageGrowth: number
  revenueGrowth?: number
  netIncome: number
  askingPrice: number
}
