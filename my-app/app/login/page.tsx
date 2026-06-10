"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.message || "Login failed")
      return
    }

    // Save token to localStorage
    localStorage.setItem("token", data.token)

    // Decode the JWT to get the role (middle part of the token)
    const payload = JSON.parse(atob(data.token.split(".")[1]))
    const role = payload.role

    localStorage.setItem("role", role)

    if (role === "farmer") {
      router.push("/farmer/dashboard")
    } else {
      router.push("/buyer/marketplace")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-page-bg px-4">

      {/* Top logo */}
      <div className="flex items-center gap-1.5 mt-10 mb-10">
        <Leaf className="w-9 h-7 text-brand" />
        <span className="text-sm font-semibold text-brand">Mavuno</span>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-brand mb-2">Mavuno</h1>
      <p className="text-gray-500 text-sm tracking-wide mb-8">
        Track your harvest. Grow your income.
      </p>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6 space-y-5">

        {/* Email field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 bg-page-bg border-0"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <span className="text-xs text-brand font-medium cursor-pointer">
              Forgot Password?
            </span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-9 bg-page-bg border-0"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit button */}
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl h-12 text-base font-semibold"
        >
          {loading ? "Signing in..." : (
            <span className="flex items-center gap-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          New to Mavuno?{" "}
          <Link href="/register" className="text-brand font-bold hover:underline">
            Register 
          </Link>
        </p>
      </div>
    </div>
  )
}
