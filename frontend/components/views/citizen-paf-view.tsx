'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Languages, 
  CreditCard, 
  FileQuestion, 
  ChevronRight, 
  Check, 
  X, 
  FileText, 
  ShieldCheck,
  Building,
  Image as ImageIcon,
  Download,
  Printer,
  QrCode,
  Volume2
} from 'lucide-react';

const BHASHINI_LANGUAGES = [
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'en', name: 'English' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
];

export const CitizenPafView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isAwardPdfModalOpen, setIsAwardPdfModalOpen] = useState(false);
  const [bankSuccess, setBankSuccess] = useState(false);
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Form states
  const [bankAccount, setBankAccount] = useState('918237192841');
  const [ifsc, setIfsc] = useState('SBIN0001428');
  const [aadhaar, setAadhaar] = useState('XXXX-XXXX-4812');
  const [disputeText, setDisputeText] = useState('');

  // Sync language with global language switcher
  useEffect(() => {
    const syncLang = () => {
      const savedLang = localStorage.getItem('bhusetu_language');
      if (savedLang) {
        setSelectedLang(savedLang === 'HI' ? 'hi' : 'en');
      }
    };
    syncLang();
    window.addEventListener('bhusetu_language_change', syncLang);
    return () => window.removeEventListener('bhusetu_language_change', syncLang);
  }, []);

  const isHindi = selectedLang === 'hi';

  const playAudioSummary = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = isHindi
        ? "श्री रामेश्वर सिंह जी, आपका खसरा संख्या 142/2 के लिए कुल मुआवजा 38 लाख 50 हज़ार रुपये स्वीकृत हो चुका है। यह राशि सीधे आपके भारतीय स्टेट बैंक खाते में 48 घंटे में अंतरित की जा रही है।"
        : "Shri Rameshwar Singh, your total compensation for Khasra number 142/2 of 38 Lakh 50 Thousand Rupees has been approved and is being transferred to your SBI account within 48 hours.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-150">
      {/* Header with Bhashini AI Language Selector & Voice Assist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-extrabold text-[#166534] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isHindi ? 'नागरिक पारदर्शी पोर्टल • MoRTH / NHAI' : 'Citizen Transparency Portal • MoRTH / NHAI'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sm text-slate-600 font-bold">
              {isHindi ? 'RFCTLARR वैधानिक लाभार्थी खाता' : 'RFCTLARR Beneficiary Ledger'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F2E53] mt-1">
            {isHindi ? 'परियोजना प्रभावित परिवार (PAF) पोर्टल' : 'Project Affected Family (PAF) Portal'}
          </h2>

          <p className="text-base sm:text-lg text-slate-700 font-medium">
            {isHindi ? (
              <>स्वागत है, <strong>श्री रामेश्वर सिंह</strong> • खसरा सं: <strong>142/2</strong> (ग्राम: बादशाहपुर)</>
            ) : (
              <>Welcome, <strong>Shri Rameshwar Singh</strong> • Khasra No: <strong>142/2</strong> (Village: Badshahpur)</>
            )}
          </p>
        </div>

        {/* Controls: Audio Assistant & Bhashini Selector */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={playAudioSummary}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-sm transition-all cursor-pointer ${
              isPlayingAudio 
                ? 'bg-amber-600 text-white animate-pulse' 
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
            title="Read Summary Aloud"
          >
            <Volume2 className="h-5 w-5" />
            <span>{isPlayingAudio ? (isHindi ? 'बोल रहा है...' : 'Speaking...') : (isHindi ? 'सुनो (आवाज में)' : 'Listen Aloud')}</span>
          </button>

          {/* Bhashini AI Language Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-300">
            <Languages className="h-5 w-5 text-[#166534]" />
            <span className="text-xs font-bold text-slate-500">भाषा / Lang:</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="text-sm font-black text-[#0F2E53] bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer"
            >
              {BHASHINI_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Row (Large, High-Contrast Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Compensation */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-emerald-100 shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
              {isHindi ? 'कुल परिकलित वैधानिक मुआवजा' : 'Total Calculated Statutory Compensation'}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534] border border-emerald-200">
              <Wallet className="h-6 w-6" />
            </div>
          </div>

          <div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#0F2E53] font-mono">
              ₹ 38,50,000
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>{isHindi ? '१००% वैधानिक तोषामद (Solatium) शामिल' : '100% Statutory Solatium Included'}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 font-medium pt-2 border-t border-slate-100">
            {isHindi 
              ? 'धारा 23/30 के अंतर्गत 1.45 हेक्टेयर कृषि भूमि अधिग्रहण के लिए निर्धारित'
              : 'Determined under Section 23/30 for 1.45 Hectares of land acquisition'}
          </p>
        </div>

        {/* Disbursement Status Pill */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-emerald-100 shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
              {isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) भुगतान स्थिति' : 'Treasury DBT Transfer Status'}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#166534]/10 text-[#166534]">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#166534] flex items-center space-x-2.5">
              <span className="h-3.5 w-3.5 rounded-full bg-[#166534] animate-pulse" />
              <span>{isHindi ? 'PFMS द्वारा प्रक्रियाधीन' : 'Processing via PFMS'}</span>
            </div>
            <span className="inline-block mt-2 text-sm font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              UTR Ref: PFMS-2026-904128
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 font-medium pt-2 border-t border-slate-100">
            {isHindi 
              ? <>सक्षम प्राधिकारी (CALA) द्वारा स्वीकृत। <strong>SBI खाता संख्या ...2841</strong> में 48 घंटे के भीतर जमा होगी।</>
              : <>Payment voucher sanctioned by CALA. Crediting to <strong>SBI A/c ending in 2841</strong> within 48 hours.</>}
          </p>
        </div>
      </div>

      {/* Progress Widget: Step-by-Step E-Commerce Style Timeline */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0F2E53]">
              {isHindi ? 'भू-अधिग्रहण वैधानिक चरण यात्रा' : 'RFCTLARR Acquisition Lifecycle Journey'}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              {isHindi ? 'प्रारंभिक राजपत्र अधिसूचना से लेकर कब्जा सुपुर्दगी तक की स्थिति' : 'Real-time stage tracking from gazette preliminary notification to physical possession'}
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 text-[#166534] font-extrabold text-sm rounded-full self-start">
            {isHindi ? 'चरण 4 सक्रिय' : 'Stage 4 Active'}
          </span>
        </div>

        <div className="relative pl-8 space-y-8 before:absolute before:left-11 before:top-4 before:bottom-4 before:w-1 before:bg-emerald-200">
          {/* Step 1: Notified */}
          <div className="relative flex items-start space-x-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 shadow-md z-10">
              <Check className="h-5 w-5 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h4 className="text-lg font-bold text-slate-900">
                  {isHindi ? '1. प्रारंभिक अधिसूचना (धारा 11)' : '1. Preliminary Notification (Section 11)'}
                </h4>
                <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                  {isHindi ? 'पूर्ण' : 'Completed'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                {isHindi 
                  ? <>राजपत्र में <strong>12-मार्च-2025</strong> को प्रकाशित। सार्वजनिक सूचना जारी की गई।</>
                  : <>Gazette published on <strong>12-Mar-2025</strong> in State Gazette & National Dailies. Public notice served.</>}
              </p>
            </div>
          </div>

          {/* Step 2: Surveyed */}
          <div className="relative flex items-start space-x-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 shadow-md z-10">
              <Check className="h-5 w-5 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h4 className="text-lg font-bold text-slate-900">
                  {isHindi ? '2. संयुक्त क्षेत्रीय सीमांकन व संपत्ति सर्वेक्षण' : '2. Joint Field Demarcation & Asset Survey'}
                </h4>
                <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                  {isHindi ? 'पूर्ण' : 'Completed'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                {isHindi 
                  ? <>पटवारी द्वारा 1.45 हेक्टेयर का GPS सत्यापन। 1 ट्यूबवेल व 8 पेड़ों का रिकॉर्ड दर्ज।</>
                  : <>Patwari verified 1.45 Ha parcel with GPS coordinates. 1 tubewell and 8 trees documented.</>}
              </p>
            </div>
          </div>

          {/* Step 3: Award Calculated */}
          <div className="relative flex items-start space-x-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 shadow-md z-10">
              <Check className="h-5 w-5 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h4 className="text-lg font-bold text-slate-900">
                  {isHindi ? '3. वैधानिक अधिनिर्णय घोषणा (धारा 23/30)' : '3. Statutory Award Declaration (Section 23/30)'}
                </h4>
                <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                  {isHindi ? 'पूर्ण' : 'Completed'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                {isHindi 
                  ? <>सक्षम प्राधिकारी (CALA) ने 100% तोषामद सहित ₹38,50,000 की राशि स्वीकृत की।</>
                  : <>Competent Authority CALA sanctioned ₹38,50,000 compensation including 100% solatium.</>}
              </p>
            </div>
          </div>

          {/* Step 4: Payment Initiated (Active Step) */}
          <div className="relative flex items-start space-x-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#166534] text-white shrink-0 shadow-lg z-10 ring-4 ring-[#166534]/30 animate-pulse">
              <Clock className="h-5 w-5 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h4 className="text-lg font-extrabold text-[#0F2E53]">
                  {isHindi ? '4. प्रत्यक्ष बैंक अंतरण (भुगतान प्रक्रियाधीन)' : '4. Direct Benefit Transfer (Payment Initiated)'}
                </h4>
                <span className="text-xs text-white bg-[#166534] px-2.5 py-0.5 rounded-full font-extrabold">
                  {isHindi ? 'प्रगति पर' : 'In Progress'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 font-medium mt-1">
                {isHindi 
                  ? <>PFMS बैच ट्रांसमिशन सक्रिय। राशि सीधे ट्रेजरी से आपके खाते में भेजी जा रही है।</>
                  : <>PFMS batch transmission active. Funds transferred to treasury clearing. Credit in 48 hours.</>}
              </p>
            </div>
          </div>

          {/* Step 5: Possession */}
          <div className="relative flex items-start space-x-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-500 shrink-0 z-10 font-bold text-sm">
              5
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h4 className="text-lg font-bold text-slate-400">
                  {isHindi ? '5. भौतिक कब्जा सुपुर्दगी (धारा 38)' : '5. Physical Possession Handover (Section 38)'}
                </h4>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold">
                  {isHindi ? 'भुगतान उपरांत' : 'Pending Payment'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-400 font-medium mt-1">
                {isHindi 
                  ? 'बैंक खाते में मुआवजा प्राप्त होने के उपरांत राष्ट्रीय राजमार्ग निर्माण हेतु कब्जा सुपुर्दगी।'
                  : 'Handover of land for highway construction following successful compensation credit.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Panel: Itemized Award Sheet Table */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0F2E53]">
              {isHindi ? 'मदवार पारदर्शी मुआवजा विवरण पत्र' : 'Itemized Transparency Award Sheet'}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              {isHindi ? 'खसरा संख्या 142/2 के लिए धारा 23 के अंतर्गत प्रमाणित मूल्यांकन' : 'Section 23 Certified Valuation breakdown for Khasra 142/2'}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setIsAwardPdfModalOpen(true)}
            className="flex items-center space-x-2 text-sm font-extrabold text-white bg-[#166534] hover:bg-[#12542a] px-5 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <FileText className="h-4 w-4" />
            <span>{isHindi ? 'आधिकारिक आदेश देखें (PDF)' : 'View Official Award Order'}</span>
          </button>
        </div>

        {/* Itemized Table (Large Text & High Contrast) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider font-extrabold border-b border-slate-200 text-xs sm:text-sm">
                <th className="py-3.5 px-4">{isHindi ? 'मूल्यांकन घटक' : 'Valuation Component'}</th>
                <th className="py-3.5 px-4">{isHindi ? 'वैधानिक प्रावधान' : 'Statutory Provision'}</th>
                <th className="py-3.5 px-4">{isHindi ? 'गणना आधार' : 'Computation Basis'}</th>
                <th className="py-3.5 px-4 text-right">{isHindi ? 'राशि (₹)' : 'Amount (₹)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50/70">
                <td className="py-4 px-4 font-bold text-slate-900">{isHindi ? 'भूमि का बाजार मूल्य' : 'Land Market Value'}</td>
                <td className="py-4 px-4 text-slate-600 font-medium">RFCTLARR Sec 26</td>
                <td className="py-4 px-4 text-slate-600 font-medium">1.45 Ha @ ₹1.20 Cr/Ha Circle Rate</td>
                <td className="py-4 px-4 text-right font-mono font-black text-slate-900 text-base">₹ 17,40,000</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-4 px-4 font-bold text-slate-900">{isHindi ? 'भूमि से संलग्न संपत्तियां' : 'Assets Attached to Land'}</td>
                <td className="py-4 px-4 text-slate-600 font-medium">RFCTLARR Sec 29</td>
                <td className="py-4 px-4 text-slate-600 font-medium">1 Tubewell Borewell + 8 Sheesham Trees</td>
                <td className="py-4 px-4 text-right font-mono font-black text-slate-900 text-base">₹ 1,85,000</td>
              </tr>
              <tr className="bg-slate-100/70">
                <td className="py-3.5 px-4 font-extrabold text-slate-800" colSpan={3}>
                  {isHindi ? 'उप-योग (मूल पात्रता)' : 'Subtotal Base Entitlement'}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-base">₹ 19,25,000</td>
              </tr>
              <tr className="bg-emerald-50/60 text-[#166534]">
                <td className="py-4 px-4 font-black">{isHindi ? '१००% अनिवार्य तोषामद (Solatium)' : '100% Mandatory Solatium'}</td>
                <td className="py-4 px-4 font-bold">RFCTLARR Sec 30(1)</td>
                <td className="py-4 px-4 font-bold">{isHindi ? 'कुल बाजार मूल्य का १००%' : '100% of Total Market Value'}</td>
                <td className="py-4 px-4 text-right font-mono font-black text-base text-[#166534]">₹ 19,25,000</td>
              </tr>
              <tr className="bg-[#0F2E53] text-white font-bold">
                <td className="py-4 px-4 text-base sm:text-lg font-black" colSpan={3}>
                  {isHindi ? 'कुल शुद्ध देय मुआवजा राशि (Total Award)' : 'Total Net Entitlement Payable (Award)'}
                </td>
                <td className="py-4 px-4 text-right font-mono text-xl sm:text-2xl font-black text-emerald-300">
                  ₹ 38,50,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Evidence Photos */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3">
            {isHindi ? 'पटवारी संयुक्त सर्वेक्षण प्रमाण छायाचित्र' : 'Patwari Joint Survey Evidence Photos'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80"
                alt="Agricultural Parcel Boundary"
                className="w-full h-48 object-cover"
              />
              <div className="p-3 bg-slate-50 text-xs sm:text-sm text-slate-700 font-bold flex justify-between">
                <span>Kh. 142/2 Northern Peg Demarcation</span>
                <span className="font-mono text-emerald-800">18-Jun-2025</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80"
                alt="Borewell Asset"
                className="w-full h-48 object-cover"
              />
              <div className="p-3 bg-slate-50 text-xs sm:text-sm text-slate-700 font-bold flex justify-between">
                <span>Verified Tubewell & Submersible Pump</span>
                <span className="font-mono text-emerald-800">18-Jun-2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel: Update Bank Details & Raise Discrepancy */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-xl font-black text-[#0F2E53]">
            {isHindi ? 'खाता विवरण अद्यतन अथवा आपत्ति दर्ज करें?' : 'Need to Update Details or Contest Valuation?'}
          </h4>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {isHindi 
              ? 'प्रत्यक्ष लाभ बैंक खाता बदलें अथवा धारा 64 के तहत प्राधिकरण को वैधानिक आपत्ति भेजें।'
              : 'Submit bank changes or file a statutory Section 64 reference to the Land Acquisition Authority.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsBankModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-sm sm:text-base font-extrabold text-[#166534] transition-colors cursor-pointer"
          >
            <CreditCard className="h-5 w-5 text-[#166534]" />
            <span>{isHindi ? 'बैंक खाता / आधार अपडेट करें' : 'Update Bank / Aadhaar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDisputeModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-sm sm:text-base font-extrabold text-rose-700 transition-colors cursor-pointer"
          >
            <FileQuestion className="h-5 w-5" />
            <span>{isHindi ? 'आपत्ति दर्ज करें (धारा 64)' : 'Raise Discrepancy'}</span>
          </button>
        </div>
      </div>

      {/* Official Award PDF Modal (Replaces alert) */}
      {isAwardPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center font-bold">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-[#0F2E53]">Office of Competent Authority (CALA)</h3>
                  <p className="text-xs text-slate-500 font-mono">Award Reference: AWD/2026/GGM/204-142</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAwardPdfModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Official Order Certificate Preview */}
            <div className="p-6 bg-amber-50/40 border-2 border-amber-200/80 rounded-2xl space-y-4 text-sm text-slate-800 leading-relaxed font-serif">
              <div className="text-center pb-3 border-b border-amber-200">
                <p className="font-bold text-xs uppercase tracking-widest text-slate-600 font-sans">
                  FORM NO. 19 • GOVERNMENT OF HARYANA
                </p>
                <h4 className="text-lg font-bold text-[#0F2E53] font-sans mt-1">
                  FINAL STATUTORY AWARD DECLARATION UNDER SECTION 23/30
                </h4>
                <p className="text-xs text-slate-500 font-sans">
                  Right to Fair Compensation & Transparency in Land Acquisition Act, 2013
                </p>
              </div>

              <div className="space-y-2 font-sans text-xs sm:text-sm">
                <p><strong>Awardee:</strong> Shri Rameshwar Singh (S/o Late Sh. Hari Singh)</p>
                <p><strong>Parcel Demarcation:</strong> Khasra No. 142/2, Village Badshahpur, Tehsil Gurugram</p>
                <p><strong>Acquired Area:</strong> 1.450 Hectares (3.58 Acres)</p>
                <p><strong>Net Statutory Award:</strong> ₹ 38,50,000 (Rupees Thirty-Eight Lakh Fifty Thousand Only)</p>
                <p><strong>Solatium Percentage:</strong> 100% Solatium included under Section 30(1)</p>
              </div>

              <div className="pt-4 border-t border-amber-200 flex items-center justify-between font-sans text-xs">
                <div className="flex items-center space-x-2">
                  <QrCode className="h-10 w-10 text-slate-800" />
                  <div>
                    <span className="font-bold block text-[#166534]">DIGITALLY VERIFIED</span>
                    <span className="text-[10px] text-slate-500 font-mono">Hash: 7a8f9c1b...e3</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold block text-slate-900">Dr. S. Mukherjee, IAS</span>
                  <span className="text-slate-500">Competent Authority (CALA)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Document</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAwardPdfModalOpen(false);
                }}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#166534] hover:bg-[#12542a] text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-xl text-[#0F2E53]">Update DBT Bank Account (PFMS KYC)</h3>
              <button 
                type="button"
                onClick={() => setIsBankModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!bankSuccess ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBankSuccess(true);
                  setTimeout(() => {
                    setBankSuccess(false);
                    setIsBankModalOpen(false);
                  }, 1500);
                }}
                className="space-y-4 text-sm"
              >
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Bank Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 px-4 py-3 font-mono font-bold text-base text-slate-900 border-2 border-slate-300 focus:border-[#166534] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 px-4 py-3 font-mono font-bold text-base text-slate-900 border-2 border-slate-300 focus:border-[#166534] focus:outline-none uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Aadhaar (NPCI Seeded)</label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 px-4 py-3 font-mono font-bold text-base text-slate-900 border-2 border-slate-300 focus:border-[#166534] focus:outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(false)}
                    className="px-5 py-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#166534] hover:bg-[#12542a] text-white font-extrabold text-sm shadow-md"
                  >
                    Verify & Save Details
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <Check className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-black text-slate-900">Bank Details Updated!</h4>
                <p className="text-sm text-slate-600 font-medium">NPCI Aadhaar-mapper verification completed successfully.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raise Discrepancy Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-xl text-rose-700">Raise Discrepancy / Section 64 Dispute</h3>
              <button 
                type="button"
                onClick={() => setIsDisputeModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!disputeSuccess ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDisputeSuccess(true);
                  setTimeout(() => {
                    setDisputeSuccess(false);
                    setIsDisputeModalOpen(false);
                  }, 1500);
                }}
                className="space-y-4 text-sm"
              >
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Dispute Classification</label>
                  <select className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-slate-900 font-bold border-2 border-slate-300 focus:border-rose-500 focus:outline-none">
                    <option>Measurement / Area Discrepancy</option>
                    <option>Asset Valuation Objection (Trees/Structures)</option>
                    <option>Co-Sharer Apportionment Dispute</option>
                    <option>Solatium Calculation Grievance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Statement of Facts & Ground</label>
                  <textarea
                    rows={4}
                    value={disputeText}
                    onChange={(e) => setDisputeText(e.target.value)}
                    placeholder="Describe your objection clearly..."
                    className="w-full rounded-2xl bg-slate-50 p-4 text-slate-900 font-medium border-2 border-slate-300 focus:border-rose-500 focus:outline-none text-base"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="px-5 py-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md"
                  >
                    File Objection to CALA
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <Check className="h-10 w-10 text-rose-600 mx-auto" />
                <h4 className="text-xl font-black text-slate-900">Objection Form Dispatched!</h4>
                <p className="text-sm text-slate-600 font-medium">
                  Grievance token <strong>GRV-2026-8812</strong> registered. CALA hearing date will be notified via SMS.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
