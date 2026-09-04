/**
 * Site Configuration & Identity Metadata for BhuSetu
 * Central source of truth for government entity names, statutory descriptions, and links.
 */

export const SITE_CONFIG = {
  name: 'BhuSetu',
  hindiName: 'भूसेतु',
  tagline: 'National Land Acquisition & Management System',
  subTagline: 'Workflow Management & Transparency Platform under RFCTLARR Act, 2013',
  governingAct: 'Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013',
  governmentEntity: {
    country: 'Government of India',
    countryHindi: 'भारत सरकार',
    department: 'National Land Acquisition Platform',
    departmentHindi: 'राष्ट्रीय भूमि अधिग्रहण मंच',
    responsibleAuthority: 'Ministry of Road Transport & Highways (MoRTH) / Ministry of Rural Development',
  },
  contact: {
    helpline: '1800-11-9922',
    email: 'support-bhusetu@gov.in',
    grievancePortal: 'CPGRAMS Integrated',
    operatingHours: 'Monday – Friday, 09:30 AM – 06:00 PM IST',
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Statutory Process', href: '#statutory-process' },
  ],
  verifiedPortals: [
    { label: 'Ministry of Road Transport & Highways', url: 'https://morth.nic.in' },
    { label: 'Department of Land Resources (DoLR)', url: 'https://dolr.gov.in' },
    { label: 'National Highways Authority of India', url: 'https://nhai.gov.in' },
    { label: 'Public Financial Management System (PFMS)', url: 'https://pfms.nic.in' },
    { label: 'The Gazette of India (eGazette)', url: 'https://egazette.nic.in' },
  ],
  disclaimer:
    'BhuSetu is a digital workflow and tracking system for statutory land acquisition. Official Gazette notifications, declarations under Section 19, and awards passed by the designated Competent Authority (CALA) constitute the definitive legal instruments.',
} as const;
