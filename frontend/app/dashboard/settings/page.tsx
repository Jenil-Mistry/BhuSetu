"use client"

import { User, Bell, Shield, Database, Key, Save } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const sections = [
    {
      id: "profile",
      icon: User,
      title: "Profile",
      desc: "Your personal information",
      fields: [
        { id: "s-name", label: "Full Name", type: "text", defaultValue: "Rajesh Kumar Sharma", placeholder: "" },
        { id: "s-email", label: "Email", type: "email", defaultValue: "rajesh.sharma@district.gov.in", placeholder: "" },
        { id: "s-phone", label: "Phone", type: "tel", defaultValue: "+91 98765 43210", placeholder: "" },
        { id: "s-org", label: "Organization", type: "text", defaultValue: "District Collectorate, Pune", placeholder: "" },
      ],
    },
    {
      id: "api",
      icon: Database,
      title: "API Configuration",
      desc: "Backend connection settings",
      fields: [
        { id: "s-api-url", label: "Backend API URL", type: "text", defaultValue: "http://localhost:8000", placeholder: "http://localhost:8000" },
        { id: "s-map-style", label: "MapLibre Style URL", type: "text", defaultValue: "https://demotiles.maplibre.org/style.json", placeholder: "" },
        { id: "s-supabase-url", label: "Supabase URL", type: "text", defaultValue: "", placeholder: "https://xxx.supabase.co" },
      ],
    },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-400">Configure your account and platform connections.</p>
      </div>

      {sections.map(({ id, icon: Icon, title, desc, fields }) => (
        <div key={id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Icon size={16} className="text-indigo-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{title}</p>
              <p className="text-slate-500 text-xs">{desc}</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {fields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <label htmlFor={f.id} className="text-slate-300 text-sm">{f.label}</label>
                <input id={f.id} type={f.type} defaultValue={f.defaultValue} placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Notifications */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Bell size={16} className="text-indigo-300" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Notifications</p>
            <p className="text-slate-500 text-xs">Alert preferences</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { id: "n-proj", label: "Project status changes" },
            { id: "n-comp", label: "Compensation approvals" },
            { id: "n-upload", label: "Document uploads" },
            { id: "n-parcel", label: "New parcel notifications" },
          ].map((n) => (
            <label key={n.id} className="flex items-center justify-between cursor-pointer group">
              <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{n.label}</span>
              <div className="relative">
                <input id={n.id} type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-indigo-600 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={16} className="text-indigo-300" />
          <p className="text-white font-semibold text-sm">Security</p>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left">
            <Key size={15} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-slate-200 text-sm font-medium">Change Password</p>
              <p className="text-slate-500 text-xs">Last changed 30 days ago</p>
            </div>
          </button>
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
          saved ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25"
        }`}>
        <Save size={16} />
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  )
}
