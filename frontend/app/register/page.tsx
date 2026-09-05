"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Eye, EyeOff, Lock, Mail, User, Building2, Phone,
  ArrowRight, Loader2, CheckCircle2
} from "lucide-react"

const ROLES = [
  { value: "district_officer", label: "District Land Acquisition Officer" },
  { value: "tehsildar", label: "Tehsildar / Revenue Inspector" },
  { value: "survey_officer", label: "Survey & Settlement Officer" },
  { value: "project_manager", label: "Project Manager (NHIDCL/NHAI/PWD)" },
  { value: "legal_officer", label: "Legal & Compensation Officer" },
  { value: "viewer", label: "Read-Only Viewer" },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    password: "",
    confirm: "",
  })

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.fullName || !form.email || !form.organization || !form.role || !form.password) {
      setError("Please fill in all required fields.")
      return
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.")
      return
    }

    startTransition(async () => {
      // TODO: wire to Supabase auth.signUp
      await new Promise((r) => setTimeout(r, 1400))
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <div>
            <h2 className="font-bold text-white mb-3">Access Request Submitted!</h2>
            <p className="text-slate-400 leading-relaxed">
              Your account request for <span className="text-white font-medium">{form.email}</span> has been submitted.
              A system administrator will review and approve your access shortly.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
            <p className="text-slate-400 text-sm font-medium">What happens next:</p>
            {[
              "Admin reviews your organization & role",
              "You receive an email confirmation",
              "Login with your credentials",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Go to Login <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 via-white to-green-500 flex items-center justify-center shadow-lg">
              <span className="text-slate-900 font-black text-base">भू</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">BhuSetu</span>
          </Link>
          <h2 className="font-bold text-white mb-2">Request Platform Access</h2>
          <p className="text-slate-400">
            Fill in your details to request access. An administrator will review your application.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-6" noValidate>
            {/* Row 1: Name + Phone */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-slate-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    suppressHydrationWarning
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Rajesh Kumar Sharma"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-slate-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    suppressHydrationWarning
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-slate-300">
                Official Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  suppressHydrationWarning
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="officer@district.gov.in"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                />
              </div>
              <p className="text-slate-600 text-xs">Use your official government / organization email address</p>
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <label htmlFor="organization" className="text-slate-300">
                Organization / Department <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  suppressHydrationWarning
                  id="organization"
                  type="text"
                  value={form.organization}
                  onChange={(e) => update("organization", e.target.value)}
                  placeholder="District Collectorate, Pune / NHAI / PWD Maharashtra"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-slate-300">
                Role / Designation <span className="text-red-400">*</span>
              </label>
              <select
                suppressHydrationWarning
                id="role"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className="w-full bg-slate-800 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your role…</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Password row */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="text-slate-300">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    suppressHydrationWarning
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-11 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirm" className="text-slate-300">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    suppressHydrationWarning
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => update("confirm", e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-11 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Toggle confirm password visibility">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength hint */}
            {form.password && (
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= level * 3
                        ? level <= 1 ? "bg-red-500"
                          : level <= 2 ? "bg-yellow-500"
                          : level <= 3 ? "bg-blue-500"
                          : "bg-green-500"
                        : "bg-white/10"
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-500 ml-1">
                  {form.password.length < 4 ? "Weak" : form.password.length < 7 ? "Fair" : form.password.length < 10 ? "Good" : "Strong"}
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><Loader2 size={17} className="animate-spin" />Submitting request…</>
              ) : (
                <>Submit Access Request <ArrowRight size={17} /></>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}
