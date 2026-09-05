"use client"

import { Upload, FileText, Image, File, Download, Trash2, Search } from "lucide-react"
import { useState, useRef } from "react"

const MOCK_DOCS = [
  { id: 1, name: "NH48-SEC-09-boundary.kml", type: "KML", project: "NH-48 Corridor", size: "1.2 MB", uploaded: "2024-03-14", status: "READY" },
  { id: 2, name: "metro-phase3-parcel-88.jpg", type: "IMAGE", project: "Metro Rail Phase 3", size: "3.4 MB", uploaded: "2024-03-10", status: "READY" },
  { id: 3, name: "solar-park-rj-boundary.kml", type: "KML", project: "Solar Park — RJ", size: "4.8 MB", uploaded: "2024-02-28", status: "READY" },
  { id: 4, name: "survey-parcel-0042.jpg", type: "IMAGE", project: "NH-48 Corridor", size: "5.1 MB", uploaded: "2024-03-05", status: "READY" },
  { id: 5, name: "efc-corridor-survey.kml", type: "KML", project: "Eastern Freight", size: "2.9 MB", uploaded: "2024-01-20", status: "READY" },
]

const TYPE_ICON: Record<string, { icon: typeof File; cls: string; bg: string }> = {
  KML: { icon: FileText, cls: "text-green-300", bg: "bg-green-500/15" },
  IMAGE: { icon: Image, cls: "text-blue-300", bg: "bg-blue-500/15" },
  PDF: { icon: File, cls: "text-red-300", bg: "bg-red-500/15" },
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("")
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = MOCK_DOCS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.project.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-bold text-white mb-1">Documents</h1>
        <p className="text-slate-400">KML boundary layers and geo-tagged survey photos stored in MinIO S3.</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
          ${dragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/15 hover:border-white/30 hover:bg-white/3"}`}
      >
        <input ref={inputRef} type="file" className="hidden" accept=".kml,.kmz,.jpg,.jpeg,.png" />
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
          <Upload size={24} className="text-indigo-400" />
        </div>
        <p className="text-white font-semibold mb-1">Drop files here or click to upload</p>
        <p className="text-slate-500 text-sm">Supports .kml, .kmz (boundary layers) and .jpg, .png (survey photos)</p>
        <p className="text-slate-600 text-xs mt-2">⚠️ MinIO storage required — start with <code className="text-indigo-400">docker compose up -d</code></p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents…"
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
      </div>

      {/* Files list */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <span className="text-slate-400 text-sm">{filtered.length} file{filtered.length !== 1 ? "s" : ""}</span>
          <span className="text-slate-600 text-xs">Stored in MinIO bucket: <code className="text-indigo-400">land-aquisition-docs</code></span>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map((doc) => {
            const { icon: Icon, cls, bg } = TYPE_ICON[doc.type] ?? TYPE_ICON.PDF
            return (
              <div key={doc.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/3 transition-colors group">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={cls} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-slate-500 text-xs">{doc.project} · {doc.size} · {doc.uploaded}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium bg-green-500/15 text-green-300 border-green-500/25`}>
                  {doc.type}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <Download size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
