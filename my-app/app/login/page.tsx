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

    localStorage.setItem("token", data.token)
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-page-bg px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 flex flex-col min-h-[85vh]">

        {/* equal space above logo */}
        <div className="flex-1" />

        {/* logo + heading */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-brand">Mavuno</h1>
          <p className="text-gray-400 text-sm tracking-wide">
            Track your harvest. Grow your income.
          </p>
        </div>

        {/* equal space below logo */}
        <div className="flex-1" />

        {/* form fields */}
        <div className="flex flex-col gap-4">

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-sm">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-page-bg border border-gray-200 h-12 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="font-semibold text-sm">Password</Label>
              <span className="text-xs text-brand font-medium cursor-pointer">Forgot Password?</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 bg-page-bg border border-gray-200 h-12 rounded-xl"
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Button */}
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

        </div>

        {/* OR Divider */}
        <div className="flex flex-col gap-3 mt-4">

          {/* OR divider */}
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign in with Google */}
          <button className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            New to Mavuno?{" "}
            <Link href="/register" className="text-brand font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center space-y-2">
        <div className="flex gap-4 justify-center text-xs text-gray-400">
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="cursor-pointer hover:underline">Terms of Service</span>
          <span className="cursor-pointer hover:underline">Support</span>
        </div>
        <p className="text-xs text-gray-400">
          © 2026 Mavuno Agritech Solutions. Built for the modern farmer.
        </p>
      </div>

    </div>
  )
}
