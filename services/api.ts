import axios from "axios"

// Get API URL with fallback and validation
const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    console.warn("NEXT_PUBLIC_API_URL not set, using default backend URL")
    return "https://api.cimamplify.com" // Default backend URL
  }

  console.log("Using API URL:", apiUrl)
  return apiUrl
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      localStorage.removeItem("userRole")

    }
    return Promise.reject(error)
  },
)

// Seller API functions
export const sellerLogin = async (credentials: { email: string; password: string }) => {
  try {
    console.log("Making login request to:", api.defaults.baseURL + "/auth/seller/login")

    const response = await api.post("/auth/seller/login", {
      ...credentials,
      userType: "seller",
    })

    const { access_token, user } = response.data

    if (access_token) {
      localStorage.setItem("token", access_token)
      localStorage.setItem("userRole", "seller")
    }

    if (user?.id) {
      localStorage.setItem("userId", user.id)
    }

    return response.data
  } catch (error: any) {
    console.error("Seller login error:", error)
    console.error("Request URL:", error.config?.url)
    console.error("Base URL:", api.defaults.baseURL)
    throw error
  }
}

export const sellerRegister = async (userData: {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  title: string;
  phoneNumber: string;
  website: string;
}) => {
  try {
    const response = await api.post("/sellers/register", userData)

    // Auto-login after registration
    const loginResponse = await sellerLogin({
      email: userData.email,
      password: userData.password,
    })

    return loginResponse
  } catch (error) {
    console.error("Seller registration error:", error)
    throw error
  }
}

export const submitDeal = async (dealData: any) => {
  try {
    const response = await api.post("/deals", dealData)
    return response.data
  } catch (error) {
    console.error("Deal submission error:", error)
    throw error
  }
}

export const getMyDeals = async () => {
  try {
    const response = await api.get("/deals/my-deals")
    return response.data
  } catch (error) {
    console.error("Error fetching deals:", error)
    throw error
  }
}

export const getSellerProfile = async () => {
  try {
    const response = await api.get("/sellers/profile")
    return response.data
  } catch (error) {
    console.error("Error fetching seller profile:", error)
    throw error
  }
}

export const getMatchingBuyers = async (dealId: string) => {
  try {
    const response = await api.get(`/deals/${dealId}/matching-buyers`)
    return response.data
  } catch (error) {
    console.error("Error fetching matching buyers:", error)
    throw error
  }
}

export const targetDealToBuyers = async (dealId: string, buyerIds: string[]) => {
  try {
    const response = await api.post(`/deals/${dealId}/target-buyers`, { buyerIds })
    return response.data
  } catch (error) {
    console.error("Error targeting deal to buyers:", error)
    throw error
  }
}

export const getDealById = async (dealId: string) => {
  try {
    const response = await api.get(`/deals/${dealId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching deal:", error)
    throw error
  }
}

// Buyer API functions
export const register = async (userData: {
  fullName: string
  email: string
  password: string
  companyName: string
}) => {
  try {
    const response = await api.post("/buyers/register", userData)

    // Auto-login after registration
    const loginResponse = await login({
      email: userData.email,
      password: userData.password,
    })

    return loginResponse
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", credentials)

    const { access_token, user } = response.data

    if (access_token) {
      localStorage.setItem("token", access_token)
      localStorage.setItem("userRole", "buyer")
    }

    if (user?.id) {
      localStorage.setItem("userId", user.id)
    }

    return { token: access_token, userId: user.id }
  } catch (error: any) {
    console.error("Login error:", error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
  localStorage.removeItem("userRole")
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("token")
  return !!token
}

export const getUserId = () => {
  return localStorage.getItem("userId")
}

export default api
