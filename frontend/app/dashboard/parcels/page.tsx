"use client"

import { useState } from "react"
import { Search, Filter, Map, ChevronDown, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const PARCELS = [
  { id: "PR-0001", project: "NH-48 Corridor", parcelNo: "MH-PN-04-0012", village: "Khed", area: 4250, status: "PAID", payment: "COMPLETED", owner: "Ramesh Jadhav" },
  { id: "PR-0002", project: "NH-48 Corridor", parcelNo: "MH-PN-04-0013", village: "Khed", area: 3800, status: "AWARDED", payment: "PENDING", owner: "Sunita Deshmukh" },
  { id: "PR-0003", project: "Metro Rail Phase 3", parcelNo: "MH-MB-01-0088", village: "Andheri", area: 1200, status: "NOTIFIED", payment: "NOT_INITIATED", owner: "Vikas Mehta" },
  { id: "PR-0004", project: "Metro Rail Phase 3", parcelNo: "MH-MB-01-0089", village: "Andheri", area: 980, status: "PAID", payment: "COMPLETED", owner: "Priya Sharma" },
  { id: "PR-0005", project: "Solar Park — RJ", parcelNo: "RJ-JD-09-0210", village: "Boranada", area: 22000, status: "AWARDED", payment: "PENDING", owner: "Bharat Singh Rathore" },
  { id: "PR-0006", project: "Solar Park — RJ", parcelNo: "RJ-JD-09-0211", village: "Boranada", area: 18500, status: "NOTIFIED", payment: "NOT_INITIATED", owner: "Mangi Lal Bishnoi" },
  { id: "PR-0007", project: "Eastern Freight Corridor", parcelNo: "JH-DB-02-0033", village: "Sindri", area: 6700, status: "PAID", payment: "COMPLETED", owner: "Arjun Das" },
  { id: "PR-0008", project: "Smart City Ring Road", parcelNo: "UP-LK-01-0056", village: "Bakshi Ka Talab", area: 3100, status: "PAID", payment: "COMPLETED", owner: "Anita Verma" },
]

const STATUSES = ["ALL", "NOTIFIED", "AWARDED", "PAID"]
const PAYMENT = ["ALL", "NOT_INITIATED", "PENDING", "COMPLETED"]

const PARCEL_STATUS_COLOR: Record<string, string> = {
  NOTIFIED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  AWARDED: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  PAID: "bg-green-500/20 text-green-300 border-green-500/30",
}

const PAYMENT_COLOR: Record<string, { cls: string; icon: typeof CheckCircle2 }> = {
  COMPLETED: { cls: "text-green-400", icon: CheckCircle2 },
  PENDING: { cls: "text-yellow-400", icon: Clock },
  NOT_INITIATED: { cls: "text-slate-500", icon: AlertCircle },
}

export default function ParcelsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [paymentFilter, setPaymentFilter] = useState("ALL")

  const filtered = PARCELS.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = p.id.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q) || p.parcelNo.toLowerCase().includes(q) || p.project.toLowerCase().includes(q)
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter
    const matchPayment = paymentFilter === "ALL" || p.payment === paymentFilter
    return matchSearch && matchStatus && matchPayment
  })

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-bold text-white mb-1">Parcels</h1>
        <p className="text-slate-400">View and manage cadastral land parcels across all projects.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by parcel ID, owner, village, project…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
        </div>
        {[
          { label: "Parcel Status", val: statusFilter, set: setStatusFilter, options: STATUSES },
          { label: "Payment", val: paymentFilter, set: setPaymentFilter, options: PAYMENT },
        ].map((f) => (
          <div key={f.label} className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <select value={f.val} onChange={(e) => f.set(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer min-w-[160px]">
              {f.options.map((o) => <option key={o} value={o} className="bg-slate-800">{o === "ALL" ? `All ${f.label}` : o.replace("_", " ")}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          </div>
        ))}
      </div>

      {/* Count badge */}
      <p className="text-slate-500 text-sm">{filtered.length} parcel{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                {["Parcel ID", "Parcel Number", "Project", "Village", "Area (m²)", "Owner", "Status", "Payment"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-slate-500 font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">No parcels match your filters.</td>
                </tr>
              ) : filtered.map((p) => {
                const PayIcon = PAYMENT_COLOR[p.payment]?.icon ?? AlertCircle
                return (
                  <tr key={p.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                          <Map size={13} className="text-cyan-300" />
                        </div>
                        <span className="font-mono text-xs text-white font-medium">{p.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">{p.parcelNo}</td>
                    <td className="px-5 py-4 text-slate-300 text-xs">{p.project}</td>
                    <td className="px-5 py-4 text-slate-300">{p.village}</td>
                    <td className="px-5 py-4 text-slate-300">{p.area.toLocaleString()}</td>
                    <td className="px-5 py-4 text-slate-300">{p.owner}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${PARCEL_STATUS_COLOR[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${PAYMENT_COLOR[p.payment]?.cls}`}>
                        <PayIcon size={13} />
                        {p.payment.replace("_", " ")}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
