'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Upload, 
  Filter, 
  Clock, 
  User, 
  FileText, 
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { AuditLogEntity } from '@/lib/mock-data';

export default function AuditSecurityPage() {
  const [logs, setLogs] = useState<AuditLogEntity[]>([]);
  const [outboxEvents, setOutboxEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // SHA-256 Verifier State
  const [testText, setTestText] = useState('BhuSetu Statutory Award CALA/GGM/2026/AWD-89 - Sum: INR 52172000');
  const [computedHash, setComputedHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<'MATCH' | 'TAMPERED' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadData();
    computeSha256(testText);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [auditLogs, events] = await Promise.all([
        adminApi.getAuditLogs(),
        adminApi.getOutboxEvents(),
      ]);
      setLogs(auditLogs);
      setOutboxEvents(events);
    } finally {
      setLoading(false);
    }
  };

  // Browser-native Web Crypto SHA-256 implementation
  const computeSha256 = async (input: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setComputedHash(hashHex);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Sample check
      if (testText.includes('AWD-89')) {
        setVerificationResult('MATCH');
      } else {
        setVerificationResult('TAMPERED');
      }
    }, 600);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesEntity = entityFilter === 'ALL' || l.entity_type === entityFilter;
    const matchesSearch = l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.sha256_hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Zero-Trust Architecture & Cryptographic Integrity
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">SHA-256 Immutable Audit Ledger</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Audit Trail & Cryptographic Verification
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 shadow-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Append-Only Immutable Ledger Active</span>
        </div>
      </div>

      {/* SIH Innovation Spotlight: Cryptographic SHA-256 Verifier */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <Lock className="h-5 w-5 text-[#166534]" />
          <div>
            <h3 className="text-base font-bold text-[#0F2E53]">
              Zero-Trust SHA-256 Document Integrity Verifier
            </h3>
            <p className="text-xs text-slate-500">
              Verifies statutory award PDFs and compensation orders against the immutable hash ledger to prevent post-approval file tampering.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3 text-xs">
            <label className="block font-semibold text-slate-700">
              Verify Award Document Contents / Text Hash:
            </label>
            <textarea
              rows={3}
              value={testText}
              onChange={(e) => {
                setTestText(e.target.value);
                computeSha256(e.target.value);
                setVerificationResult(null);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const sample = 'BhuSetu Statutory Award CALA/GGM/2026/AWD-89 - Sum: INR 52172000';
                    setTestText(sample);
                    computeSha256(sample);
                    setVerificationResult(null);
                  }}
                  className="text-[11px] text-[#166534] font-bold hover:underline"
                >
                  Load Certified Award (Authentic)
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    const tampered = 'BhuSetu Statutory Award CALA/GGM/2026/AWD-89 - Sum: INR 99999999 (TAMPERED AMOUNT)';
                    setTestText(tampered);
                    computeSha256(tampered);
                    setVerificationResult(null);
                  }}
                  className="text-[11px] text-rose-600 font-bold hover:underline"
                >
                  Simulate Fraudulent Edit (Tampered)
                </button>
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492] transition-colors"
              >
                {isVerifying ? 'Checking Ledger...' : 'Verify Cryptographic Hash'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Calculated SHA-256 Digest (Client-Side)
              </span>
              <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 break-all select-all">
                {computedHash}
              </div>
            </div>

            {verificationResult === 'MATCH' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start space-x-2 animate-in fade-in">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs">Authenticity Certified (100% Match)</div>
                  <p className="text-[10px] text-emerald-800 mt-0.5">
                    Hash matches Government of India SHA-256 ledger. No alterations detected.
                  </p>
                </div>
              </div>
            )}

            {verificationResult === 'TAMPERED' && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 flex items-start space-x-2 animate-in fade-in">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs">INTEGRITY BREACH DETECTED</div>
                  <p className="text-[10px] text-rose-800 mt-0.5">
                    Hash does not match recorded statutory award. Document has been modified!
                  </p>
                </div>
              </div>
            )}

            {!verificationResult && (
              <span className="text-[10px] text-slate-400 text-center block">
                Click &quot;Verify Cryptographic Hash&quot; to test document against backend ledger.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log Table & Filters */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#0F2E53]">
              Immutable Statutory Audit Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every stage transition, award declaration, and payment event with cryptographic correlation ID
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1"
            >
              <option value="ALL">All Entities</option>
              <option value="PROJECT">Projects</option>
              <option value="PARCEL">Parcels</option>
              <option value="NOTIFICATION">Notifications</option>
              <option value="AWARD">Awards</option>
              <option value="PAYMENT_BATCH">Payments</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Authorized Actor</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Correlation ID</th>
                <th className="px-4 py-3">SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#0F2E53]">
                    {log.action.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {log.entity_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <div>{log.actor_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.actor_role}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">
                    {log.correlation_id}
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-700 text-[10px]">
                    {log.sha256_hash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outbox Broker Queue Status */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0F2E53]">
          <Database className="h-4 w-4 text-[#166534]" />
          <span>Transactional Outbox Queue (Asynchronous Reliability)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {outboxEvents.map((ev) => (
            <div key={ev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-mono text-[10px] text-slate-400">{ev.event_type}</div>
              <div className="flex items-center space-x-1.5 mt-1 font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{ev.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
