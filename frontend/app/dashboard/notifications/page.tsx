'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  Download, 
  Calendar, 
  Scale, 
  ExternalLink, 
  ShieldCheck,
  Send,
  X,
  FileCheck2
} from 'lucide-react';
import { notificationsApi, projectsApi } from '@/lib/api';
import { NotificationEntity, ProjectEntity } from '@/lib/mock-data';

export default function GazetteNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('11111111-1111-1111-1111-111111111111');
  const [loading, setLoading] = useState(true);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [notifType, setNotifType] = useState<'SECTION_11' | 'SECTION_19'>('SECTION_11');
  const [gazetteNo, setGazetteNo] = useState('S.O. 4519(E)');
  const [boundaries, setBoundaries] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedProjectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [notifs, projs] = await Promise.all([
        notificationsApi.list(selectedProjectId),
        projectsApi.list(),
      ]);
      setNotifications(notifs);
      setProjects(projs);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await notificationsApi.issue(selectedProjectId, {
        notification_type: notifType,
        gazette_number: gazetteNo,
        survey_boundaries_summary: boundaries || 'All affected Khasras across notified corridor',
        publication_date: new Date().toISOString().split('T')[0],
      });
      setNotifications([created, ...notifications]);
      setIsIssueModalOpen(false);
      setActionSuccess(`Gazette Notification ${created.gazette_number} published successfully.`);
      setTimeout(() => setActionSuccess(null), 4000);
      setBoundaries('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Statutory Gazette Publication (The Gazette of India)
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">RFCTLARR Sections 11, 15 & 19</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Statutory Notifications & e-Gazette Tracker
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Issue Gazette Notification</span>
          </button>
        </div>
      </div>

      {/* Project Selector Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FileText className="h-4 w-4 text-[#166534]" />
          <span className="text-xs font-bold text-slate-700">Active Corridor:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-semibold text-[#0F2E53] bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#166534] focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <span className="text-slate-500">
            Published Gazettes: <strong className="text-[#0F2E53] font-mono">{notifications.length}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">
            e-Gazette Integration: <strong className="text-emerald-700 font-mono">Live Sync (NIC)</strong>
          </span>
        </div>
      </div>

      {/* Statutory 60-Day Section 15 Hearing Countdown Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-amber-100 rounded-xl text-amber-900 shrink-0">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Section 15 Statutory Objection Period (60 Days Window)
            </h4>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Landowners have a mandatory 60 days from Section 11 gazette publication to file objections regarding land suitability or public purpose before CALA.
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-white px-4 py-2 rounded-xl border border-amber-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Hearing Window</span>
          <span className="text-base font-extrabold text-amber-800 font-mono">24 Days Remaining</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#166534] border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No gazette notifications found for this corridor.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isSec11 = notif.notification_type === 'SECTION_11';
            return (
              <div
                key={notif.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-[#166534] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isSec11 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {isSec11 ? 'Section 11 Preliminary Notification' : 'Section 19 Final Declaration'}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#0F2E53] bg-slate-100 px-2 py-0.5 rounded">
                        {notif.gazette_number}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0F2E53]">
                      Statutory Corridor Boundaries Notification
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {notif.survey_boundaries_summary}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      Published: {notif.publication_date}
                    </span>
                    <button
                      onClick={() => setActionSuccess(`Official Gazette PDF for ${notif.gazette_number} downloaded successfully.`)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border-2 border-slate-300 hover:bg-slate-50 text-xs sm:text-sm font-bold text-[#0F2E53] shadow-xs cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-[#166534]" />
                      <span>Gazette PDF</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-500">
                      Objections Filed: <strong className="text-slate-800 font-mono">{notif.objections_count}</strong>
                    </span>
                    <span className="text-slate-500">
                      Disposed: <strong className="text-emerald-700 font-mono">{notif.objections_disposed}</strong>
                    </span>
                    {notif.hearing_scheduled_date && (
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Hearing Date: {notif.hearing_scheduled_date}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>SHA-256: {notif.sha256_hash.substring(0, 16)}...</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Issue Notification Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#166534]" />
                <h3 className="text-base font-bold text-[#0F2E53]">Register Gazette Notification</h3>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleIssueNotification} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notification Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNotifType('SECTION_11')}
                    className={`p-2.5 rounded-xl border text-left transition-colors font-bold ${
                      notifType === 'SECTION_11'
                        ? 'border-[#166534] bg-emerald-50 text-[#166534]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Section 11 Preliminary
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifType('SECTION_19')}
                    className={`p-2.5 rounded-xl border text-left transition-colors font-bold ${
                      notifType === 'SECTION_19'
                        ? 'border-[#166534] bg-emerald-50 text-[#166534]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Section 19 Final Declaration
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gazette Reference (S.O. Number) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S.O. 4192(E)"
                  value={gazetteNo}
                  onChange={(e) => setGazetteNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Survey Boundaries & Affected Villages *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify affected Tehsils, Villages, and boundary Khasras..."
                  value={boundaries}
                  onChange={(e) => setBoundaries(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492]"
                >
                  {isSubmitting ? 'Publishing...' : 'Register & Publish Gazette'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
