"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api-config";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})
  const { login, isLoggedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Validate email format
  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address"
    return undefined
  }

  // Validate password
  const validatePassword = (value: string): string | undefined => {
    if (!value) return "Password is required"
    return undefined
  }

  // Handle email change with validation
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (touched.email) {
      setFieldErrors(prev => ({ ...prev, email: validateEmail(value) }))
    }
    if (error) setError("")
  }

  // Handle password change with validation
  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (touched.password) {
      setFieldErrors(prev => ({ ...prev, password: validatePassword(value) }))
    }
    if (error) setError("")
  }

  // Handle field blur for validation
  const handleBlur = (field: "email" | "password") => {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (field === "email") {
      setFieldErrors(prev => ({ ...prev, email: validateEmail(email) }))
    } else {
      setFieldErrors(prev => ({ ...prev, password: validatePassword(password) }))
    }
  }

  // Check for token and userId in URL parameters
  useEffect(() => {
    // Check if redirected due to session expiry
    const sessionExpired = searchParams?.get("session") === "expired"
    if (sessionExpired) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      })
    }

    const urlToken = searchParams?.get("token")
    const urlUserId = searchParams?.get("userId")

    if (urlToken) {
      const cleanToken = urlToken.trim()
      localStorage.setItem("token", cleanToken)
    }

    if (urlUserId) {
      const cleanUserId = urlUserId.trim()
      localStorage.setItem("userId", cleanUserId)
    }

    // If both token and userId are provided, redirect to deals
    if (urlToken && urlUserId) {
      router.push("/buyer/acquireprofile")
      return
    }

    // Check if already logged in
    const storedToken = sessionStorage.getItem('token')
    if (storedToken) {
      router.push("/buyer/acquireprofile")
    }
  }, [searchParams, router])

  // Update the handleSubmit function to properly handle the login response
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate all fields before submission
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setFieldErrors({ email: emailError, password: passwordError })
    setTouched({ email: true, password: true })

    if (emailError || passwordError) {
      return
    }

    setIsLoading(true)

    try {

      const apiUrl = API_BASE_URL;

      // Use fetch directly for more control
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Login failed with status: ${response.status}`)
      }

      const data = await response.json()

      // Store token - adapt this to match your API response format
      if (data.token) {
        localStorage.setItem("token", data.token)
      } else if (data.access_token) {
        localStorage.setItem("token", data.access_token)
      } else {
        throw new Error("Login response missing token")
      }

      // Store userId - adapt this to match your API response format
      if (data.userId) {
        localStorage.setItem("userId", data.userId)
      } else if (data.user && data.user.id) {
        localStorage.setItem("userId", data.user.id)
      }

      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
      })

      // Redirect to acquire profile page
      setTimeout(() => {
        router.push("/deals")
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
      toast({
        title: "Login Failed",
        description: err.message || "Login failed. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#C7D7D7] overflow-hidden">
      {/* Left side - Illustration */}
      <div className="hidden  md:flex md:w-1/2 items-center justify-center  relative">
        <Image
          src="/Bg.svg"
          alt="Financial illustration with handshake and growth chart"
          width={500}
          height={500}
          priority
          className="z-10 bg-cover bg-center w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-2/3 bg-white rounded-l-[40px] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder=""
                required
                className={`w-full py-6 ${fieldErrors.email && touched.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {fieldErrors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  required
                  className="w-full pr-10 py-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 "
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#3aafa9] hover:bg-[#2a9d8f] text-white py-6 rounded-3xl"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login my account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#3aafa9] hover:underline font-medium">
              signup
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
