"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface RegisterFormData {
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  companyName: string
  targetCriteria: {
    countries: string[]
  }
}

export default function BuyerRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    targetCriteria: {
      countries: [],
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<RegisterFormData & { general: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countrySearchTerm, setCountrySearchTerm] = useState("");

  // Check for token and userId in URL parameters
  useEffect(() => {
    const urlToken = searchParams?.get("token")
    const urlUserId = searchParams?.get("userId")

    if (urlToken) {
      const cleanToken = urlToken.trim()
      localStorage.setItem("token", cleanToken)
      console.log("Register page - Token set from URL:", cleanToken.substring(0, 10) + "...")
    }

    if (urlUserId) {
      const cleanUserId = urlUserId.trim()
      localStorage.setItem("userId", cleanUserId)
      console.log("Register page - User ID set from URL:", cleanUserId)
    }

    // If both token and userId are provided, redirect to deals
    if (urlToken && urlUserId) {
      console.log("Register page - Redirecting to acquireprofile with token and userId from URL")
      localStorage.setItem("userRole", "buyer")
      router.push("/buyer/acquireprofile")
      return
    }

    // Check if already logged in
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      console.log("Register page - Token found in localStorage, redirecting to acquireprofile")
      router.push("/buyer/acquireprofile")
    }
  }, [searchParams, router])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors: Partial<RegisterFormData & { general: string }> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle traditional registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    console.log("Form submission started")
    console.log("Form data:", formData)

    if (!validateForm()) {
      console.log("Form validation failed")
      return
    }

    setIsSubmitting(true)

    try {
      // Get API URL from localStorage or use default
      const apiUrl = localStorage.getItem("apiUrl") || "https://api.cimamplify.com"

      console.log("Register page - Submitting registration to:", apiUrl)
      console.log("POST to:", `${apiUrl}/buyers/register`)

      const requestBody = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null, // Allow phone to be optional
        password: formData.password,
        companyName: formData.companyName.trim(),
      }

      console.log("Request body:", requestBody)

      const response = await fetch(`${apiUrl}/buyers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Registration failed:", errorData)
        throw new Error(errorData.message || `Registration failed with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Registration response:", data)

      // The backend should return the user data and we'll generate a login token
      if (data) {
        // After successful registration, log the user in
        console.log("Attempting automatic login...")
        const loginResponse = await fetch(`${apiUrl}/buyers/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        })

        if (!loginResponse.ok) {
          console.warn("Automatic login failed, redirecting to login page")
          toast({
            title: "Registration Successful",
            description: "Please log in with your credentials.",
          })
          setTimeout(() => {
            router.push("/buyer/login")
          }, 1500)
          return
        }

        const loginData = await loginResponse.json()
        console.log("Login response:", loginData)

        // Store token - adapt this to match your API response format
        if (loginData.access_token) {
          localStorage.setItem("token", loginData.access_token)
          console.log("Register page - Token stored from login:", loginData.access_token.substring(0, 10) + "...")
        } else if (loginData.token) {
          localStorage.setItem("token", loginData.token)
          console.log("Register page - Token stored from login:", loginData.token.substring(0, 10) + "...")
        } else {
          console.warn("Register page - Login response missing token")
        }

        // Store userId - adapt this to match your API response format
        if (loginData.user && loginData.user._id) {
          localStorage.setItem("userId", loginData.user._id)
          console.log("Register page - User ID stored from login:", loginData.user._id)
        } else if (loginData.user && loginData.user.id) {
          localStorage.setItem("userId", loginData.user.id)
          console.log("Register page - User ID stored from login:", loginData.user.id)
        } else if (loginData.userId) {
          localStorage.setItem("userId", loginData.userId)
          console.log("Register page - User ID stored from login:", loginData.userId)
        } else {
          console.warn("Register page - Login response missing userId")
        }

        // Set user role
        localStorage.setItem("userRole", "buyer")

        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully.",
        })

        // Redirect to company profile page
        setTimeout(() => {
          router.push("/buyer/acquireprofile")
        }, 1500)
      } else {
        throw new Error("Registration response missing user data")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setErrors({
        general: error.message || "Registration failed. Please try again.",
      })
      toast({
        title: "Registration Failed",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    // Get API URL from localStorage or use default
    const apiUrl = localStorage.getItem("apiUrl") || "https://api.cimamplify.com"
    console.log("Register page - Redirecting to Google OAuth:", `${apiUrl}/buyers/google`)

    // Redirect to Google OAuth endpoint
    window.location.href = `${apiUrl}/buyers/google`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C7D7D7] to-[#8C9EA8]">
      <div className="flex min-h-screen lg:h-screen">
        {/* Left side with illustration - hidden on mobile and tablet */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
          <Image
            src="/Bg.svg"
            alt="Financial illustration with handshake and growth chart"
            width={500}
            height={500}
            priority
            className="z-10 bg-cover bg-center w-full h-full object-cover"
          />
        </div>

        {/* Right side - Registration form */}
        <div className="w-full lg:w-1/2 bg-white lg:rounded-l-[30px] overflow-y-auto">
          <div className="w-full max-w-md mx-auto p-6 sm:p-8 py-8 sm:py-12">
            <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Buyer Registration</h1>

                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {errors.general}
                  </div>
                )}

                {/* Google signup button */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md p-3 mb-4 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Create account with Google</span>
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`${errors.email ? "border-red-300" : ""} py-3 sm:py-4`}
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`${errors.fullName ? "border-red-300" : ""} py-3 sm:py-4`}
                      required
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      className={`${errors.companyName ? "border-red-300" : ""} py-3 sm:py-4`}
                      required
                    />
                    {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+44 7123 123456"
                      className={`${errors.phone ? "border-red-300" : ""} py-3 sm:py-4`}
                      required
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={`${errors.password ? "border-red-300 pr-10" : "pr-10"} py-3 sm:py-4`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`${errors.confirmPassword ? "border-red-300 pr-10" : "pr-10"} py-3 sm:py-4`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#3aafa9] hover:bg-[#2a9d8f] text-white py-4 sm:py-5 rounded-3xl mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      "Create an account"
                    )}
                  </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/buyer/login" className="text-[#3aafa9] hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}