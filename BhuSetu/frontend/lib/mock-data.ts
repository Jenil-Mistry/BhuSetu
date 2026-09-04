import { CadastralParcel, ChainagePackage, KpiGlance, RfctlarrStatus } from '@/types/rfctlarr';

export const STATUS_COLORS: Record<RfctlarrStatus, { bg: string; text: string; hex: string; label: string }> = {
  not_started: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    hex: '#94A3B8',
    label: 'Not Started',
  },
  sec11_notified: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    hex: '#EAB308',
    label: 'Section 11 Notified',
  },
  award_declared: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    hex: '#2563EB',
    label: 'Award Declared',
  },
  possession_taken: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    hex: '#16A34A',
    label: 'Possession Taken',
  },
  disputed: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    hex: '#DC2626',
    label: 'Disputed (Sec 64 / Court)',
  },
};

export const MOCK_KPI: KpiGlance = {
  landRequiredHa: 1450.0,
  landAcquiredHa: 985.4,
  fundsWithCalaCrores: 482.5,
  fundsDisbursedCrores: 318.2,
  totalFundsAllocatedCrores: 850.0,
  bottleneckCount: 14,
  totalParcelsCount: 4210,
  totalPafCount: 3840,
  disbursedPafCount: 2618,
};

export const MOCK_CHAINAGE_PACKAGES: ChainagePackage[] = [
  {
    id: 'pkg-01',
    code: 'PKG-01',
    title: 'Package 01: Northern Bypass to Sohna Junction',
    district: 'Gurugram',
    chainageStart: '0+000',
    chainageEnd: '26+400',
    lengthKm: 26.4,
    totalParcels: 980,
    sec11Count: 980,
    sec19Count: 980,
    awardCount: 940,
    possessionCount: 912,
    possessionPercentage: 93.1,
    criticalFlag: false,
    slaDaysLeft: 84,
    bottleneckSummary: 'Minor mutation pending for 28 Khasras',
  },
  {
    id: 'pkg-02',
    code: 'PKG-02',
    title: 'Package 02: Sohna Interchange to Tauru Feeder',
    district: 'Nuh',
    chainageStart: '26+400',
    chainageEnd: '54+800',
    lengthKm: 28.4,
    totalParcels: 1140,
    sec11Count: 1140,
    sec19Count: 1080,
    awardCount: 920,
    possessionCount: 810,
    possessionPercentage: 71.1,
    criticalFlag: false,
    slaDaysLeft: 38,
    bottleneckSummary: 'Tree asset joint valuation pending with Forest Dept',
  },
  {
    id: 'pkg-03',
    code: 'PKG-03',
    title: 'Package 03: Tauru Corridor to Dharuhera West',
    district: 'Rewari',
    chainageStart: '54+800',
    chainageEnd: '88+200',
    lengthKm: 33.4,
    totalParcels: 1210,
    sec11Count: 1210,
    sec19Count: 840,
    awardCount: 650,
    possessionCount: 480,
    possessionPercentage: 39.7,
    criticalFlag: true,
    slaDaysLeft: 12,
    bottleneckSummary: 'Section 15 hearing backlog (48 objections unaddressed)',
  },
  {
    id: 'pkg-04',
    code: 'PKG-04',
    title: 'Package 04: Rewari Spur to Bawal Border',
    district: 'Rewari',
    chainageStart: '88+200',
    chainageEnd: '120+000',
    lengthKm: 31.8,
    totalParcels: 880,
    sec11Count: 720,
    sec19Count: 410,
    awardCount: 220,
    possessionCount: 140,
    possessionPercentage: 15.9,
    criticalFlag: true,
    slaDaysLeft: 6,
    bottleneckSummary: 'High Court status-quo stay on Ch 94+300 (Writ 4812/2026)',
  },
];

// Center point for coordinates: [76.92, 28.32] (Delhi-NCR corridor)
export const MOCK_PARCELS: CadastralParcel[] = [
  {
    id: 'kh-101',
    khasraNo: '142/2',
    village: 'Badshahpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    chainage: 'Ch 4+120',
    areaHectares: 1.45,
    landowner: 'Rameshwar Singh & Brothers',
    status: 'possession_taken',
    baseRatePerHa: 12000000,
    assetsValuation: 1850000,
    solatium100Percent: 19250000,
    totalCompensation: 38500000,
    sec11Date: '2025-03-12',
    sec19Date: '2025-08-20',
    awardDate: '2025-11-15',
    possessionDate: '2026-01-10',
    coordinates: [
      [76.980, 28.380],
      [76.984, 28.380],
      [76.984, 28.383],
      [76.980, 28.383],
      [76.980, 28.380],
    ],
  },
  {
    id: 'kh-102',
    khasraNo: '144/1',
    village: 'Badshahpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    chainage: 'Ch 4+380',
    areaHectares: 0.92,
    landowner: 'Kiran Devi w/o Late Satbir',
    status: 'possession_taken',
    baseRatePerHa: 12000000,
    assetsValuation: 850000,
    solatium100Percent: 11890000,
    totalCompensation: 23780000,
    sec11Date: '2025-03-12',
    sec19Date: '2025-08-20',
    awardDate: '2025-11-15',
    possessionDate: '2026-01-14',
    coordinates: [
      [76.984, 28.380],
      [76.988, 28.380],
      [76.988, 28.383],
      [76.984, 28.383],
      [76.984, 28.380],
    ],
  },
  {
    id: 'kh-103',
    khasraNo: '188/3',
    village: 'Fazilpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    chainage: 'Ch 7+620',
    areaHectares: 2.10,
    landowner: 'Deepak Yadav & Suman Yadav',
    status: 'award_declared',
    baseRatePerHa: 11000000,
    assetsValuation: 3200000,
    solatium100Percent: 26300000,
    totalCompensation: 52600000,
    sec11Date: '2025-04-05',
    sec19Date: '2025-09-18',
    awardDate: '2026-02-04',
    slaDeadlineDays: 24,
    coordinates: [
      [76.988, 28.380],
      [76.993, 28.380],
      [76.993, 28.384],
      [76.988, 28.384],
      [76.988, 28.380],
    ],
  },
  {
    id: 'kh-104',
    khasraNo: '204',
    village: 'Fazilpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    chainage: 'Ch 8+150',
    areaHectares: 1.15,
    landowner: 'Mahinder Tanwar',
    status: 'disputed',
    baseRatePerHa: 11000000,
    assetsValuation: 1400000,
    solatium100Percent: 14050000,
    totalCompensation: 28100000,
    sec11Date: '2025-04-05',
    sec19Date: '2025-09-18',
    disputeReason: 'High Court Stay: Title partition claim between co-sharers (CS 109/2025)',
    coordinates: [
      [76.993, 28.380],
      [76.997, 28.380],
      [76.997, 28.384],
      [76.993, 28.384],
      [76.993, 28.380],
    ],
  },
  {
    id: 'kh-105',
    khasraNo: '312/1',
    village: 'Kherki Daula',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    chainage: 'Ch 11+400',
    areaHectares: 1.80,
    landowner: 'Gram Panchayat (Common Grazing Land)',
    status: 'sec11_notified',
    baseRatePerHa: 9500000,
    assetsValuation: 450000,
    solatium100Percent: 17550000,
    totalCompensation: 35100000,
    sec11Date: '2025-10-14',
    slaDeadlineDays: 14,
    coordinates: [
      [76.997, 28.380],
      [77.002, 28.380],
      [77.002, 28.385],
      [76.997, 28.385],
      [76.997, 28.380],
    ],
  },
  {
    id: 'kh-106',
    khasraNo: '315/2',
    village: 'Kherki Daula',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    chainage: 'Ch 12+100',
    areaHectares: 0.65,
    landowner: 'Baljeet Chillar',
    status: 'sec11_notified',
    baseRatePerHa: 9500000,
    assetsValuation: 620000,
    solatium100Percent: 6795000,
    totalCompensation: 13590000,
    sec11Date: '2025-10-14',
    slaDeadlineDays: 14,
    coordinates: [
      [77.002, 28.380],
      [77.006, 28.380],
      [77.006, 28.385],
      [77.002, 28.385],
      [77.002, 28.380],
    ],
  },
  {
    id: 'kh-107',
    khasraNo: '401/a',
    village: 'Manesar North',
    tehsil: 'Manesar',
    district: 'Gurugram',
    chainage: 'Ch 16+800',
    areaHectares: 3.40,
    landowner: 'Om Prakash & Sons HUF',
    status: 'not_started',
    baseRatePerHa: 8800000,
    assetsValuation: 0,
    solatium100Percent: 29920000,
    totalCompensation: 59840000,
    coordinates: [
      [77.006, 28.380],
      [77.012, 28.380],
      [77.012, 28.386],
      [77.006, 28.386],
      [77.006, 28.380],
    ],
  },
  {
    id: 'kh-108',
    khasraNo: '404/2',
    village: 'Manesar North',
    tehsil: 'Manesar',
    district: 'Gurugram',
    chainage: 'Ch 17+250',
    areaHectares: 1.10,
    landowner: 'Vikramaditya Rao',
    status: 'not_started',
    baseRatePerHa: 8800000,
    assetsValuation: 0,
    solatium100Percent: 9680000,
    totalCompensation: 19360000,
    coordinates: [
      [77.012, 28.380],
      [77.016, 28.380],
      [77.016, 28.386],
      [77.012, 28.386],
      [77.012, 28.380],
    ],
  },
  {
    id: 'kh-109',
    khasraNo: '512/3',
    village: 'Pataudi Rural',
    tehsil: 'Pataudi',
    district: 'Gurugram',
    chainage: 'Ch 22+900',
    areaHectares: 2.75,
    landowner: 'Sukhdev Singh Dhillon',
    status: 'award_declared',
    baseRatePerHa: 8200000,
    assetsValuation: 4100000,
    solatium100Percent: 26650000,
    totalCompensation: 53300000,
    sec11Date: '2025-05-18',
    sec19Date: '2025-10-30',
    awardDate: '2026-01-28',
    coordinates: [
      [77.016, 28.380],
      [77.022, 28.380],
      [77.022, 28.387],
      [77.016, 28.387],
      [77.016, 28.380],
    ],
  },
  {
    id: 'kh-110',
    khasraNo: '550/1',
    village: 'Pataudi Rural',
    tehsil: 'Pataudi',
    district: 'Gurugram',
    chainage: 'Ch 24+150',
    areaHectares: 0.85,
    landowner: 'Anita Kumari w/o Rajender',
    status: 'disputed',
    baseRatePerHa: 8200000,
    assetsValuation: 900000,
    solatium100Percent: 7870000,
    totalCompensation: 15740000,
    sec11Date: '2025-05-18',
    sec19Date: '2025-10-30',
    disputeReason: 'Solatium & tree valuation objection under Sec 64 reference to Authority',
    coordinates: [
      [77.022, 28.380],
      [77.026, 28.380],
      [77.026, 28.387],
      [77.022, 28.387],
      [77.022, 28.380],
    ],
  },
];

// ============================================================================
// Backend V1 Aligned Mock Datasets & Entities
// ============================================================================

export interface ProjectEntity {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'DRAFT' | 'SUBMITTED' | 'SCRUTINY' | 'RECOMMENDED' | 'APPROVED' | 'NOTIFICATION_IN_PROGRESS' | 'AWARD_IN_PROGRESS' | 'COMPENSATION_IN_PROGRESS' | 'POSSESSION_IN_PROGRESS' | 'RR_IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'REJECTED';
  district_id: number;
  district_name?: string;
  state_name?: string;
  organization_id: number;
  organization_name?: string;
  estimated_budget: number;
  estimated_area_hectares: number;
  requiring_body: string;
  purpose: string;
  created_at: string;
  updated_at: string;
  sla_days_left?: number;
  parcels_count?: number;
}

export const MOCK_PROJECTS: ProjectEntity[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'NH-48 Greenfield Spur (Gurugram to Rewari Corridor)',
    code: 'NH48-SPUR-01',
    description: 'Statutory greenfield bypass acquisition for 8-lane expressway connecting Sohna, Tauru, and Pataudi.',
    status: 'APPROVED',
    district_id: 1,
    district_name: 'Gurugram',
    state_name: 'Haryana',
    organization_id: 1,
    organization_name: 'National Highways Authority of India (NHAI)',
    estimated_budget: 1850000000,
    estimated_area_hectares: 145.8,
    requiring_body: 'MoRTH / NHAI Regional Office Delhi-NCR',
    purpose: 'Inter-state logistics bypass corridor to decongest national capital highway network.',
    created_at: '2026-06-12T10:00:00Z',
    updated_at: '2026-08-20T14:30:00Z',
    sla_days_left: 45,
    parcels_count: 342,
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    name: 'Western Peripheral Expressway Connector (Spur B)',
    code: 'WPE-CONN-04',
    description: 'Four-lane radial access road linking industrial corridor in Manesar with WPE interchange.',
    status: 'NOTIFICATION_IN_PROGRESS',
    district_id: 1,
    district_name: 'Gurugram',
    state_name: 'Haryana',
    organization_id: 1,
    organization_name: 'National Highways Authority of India (NHAI)',
    estimated_budget: 920000000,
    estimated_area_hectares: 78.4,
    requiring_body: 'Haryana State Industrial & Infrastructure Dev. Corp. (HSIIDC)',
    purpose: 'Direct heavy commercial vehicle routing to ease urban arterial congestion.',
    created_at: '2026-07-05T09:15:00Z',
    updated_at: '2026-08-28T11:00:00Z',
    sla_days_left: 21,
    parcels_count: 184,
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    name: 'Rewari Feeder Freight Link • Ch 54+800 to 88+200',
    code: 'RFL-PKG-03',
    description: 'Dedicated multi-modal logistics park road feeder spur through Rewari agricultural belt.',
    status: 'SCRUTINY',
    district_id: 2,
    district_name: 'Rewari',
    state_name: 'Haryana',
    organization_id: 1,
    organization_name: 'National Highways Authority of India (NHAI)',
    estimated_budget: 640000000,
    estimated_area_hectares: 54.2,
    requiring_body: 'NHAI PIU Rewari',
    purpose: 'Freight corridor integration with Western Dedicated Freight Corridor (WDFC).',
    created_at: '2026-08-14T08:30:00Z',
    updated_at: '2026-09-01T16:20:00Z',
    sla_days_left: 12,
    parcels_count: 215,
  },
  {
    id: '11111111-1111-1111-1111-111111111114',
    name: 'Delhi-Mumbai Expressway Spur Link to Jewar Airport',
    code: 'DME-JEWAR-02',
    description: 'Greenfield highway link from DME interchange to upcoming Noida International Airport.',
    status: 'DRAFT',
    district_id: 3,
    district_name: 'Faridabad',
    state_name: 'Haryana',
    organization_id: 1,
    organization_name: 'National Highways Authority of India (NHAI)',
    estimated_budget: 1250000000,
    estimated_area_hectares: 112.6,
    requiring_body: 'MoRTH Special Project Wing',
    purpose: 'High-speed passenger and air cargo corridor connectivity.',
    created_at: '2026-08-25T11:45:00Z',
    updated_at: '2026-08-25T11:45:00Z',
    sla_days_left: 90,
    parcels_count: 140,
  }
];

export interface NotificationEntity {
  id: string;
  project_id: string;
  notification_type: 'SECTION_11' | 'SECTION_19';
  gazette_number: string;
  publication_date: string;
  survey_boundaries_summary: string;
  status: 'PUBLISHED' | 'HEARING_ACTIVE' | 'OBJECTIONS_DISPOSED';
  objections_count: number;
  objections_disposed: number;
  hearing_scheduled_date?: string;
  pdf_url?: string;
  sha256_hash: string;
}

export const MOCK_NOTIFICATIONS: NotificationEntity[] = [
  {
    id: 'notif-01',
    project_id: '11111111-1111-1111-1111-111111111111',
    notification_type: 'SECTION_19',
    gazette_number: 'S.O. 4192(E)',
    publication_date: '2026-08-18',
    survey_boundaries_summary: 'Gurugram Tehsil: Villages Fazilpur, Badshahpur, Kherki Daula (Ch 0+000 to 26+400)',
    status: 'PUBLISHED',
    objections_count: 82,
    objections_disposed: 82,
    pdf_url: '/docs/gazette_so_4192.pdf',
    sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    id: 'notif-02',
    project_id: '11111111-1111-1111-1111-111111111112',
    notification_type: 'SECTION_11',
    gazette_number: 'S.O. 3918(E)',
    publication_date: '2026-08-28',
    survey_boundaries_summary: 'Manesar Tehsil: Villages Naharpur Kasan, Kasan Rural, Manesar North (Ch 26+400 to 54+800)',
    status: 'HEARING_ACTIVE',
    objections_count: 48,
    objections_disposed: 29,
    hearing_scheduled_date: '2026-09-15',
    pdf_url: '/docs/gazette_so_3918.pdf',
    sha256_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  },
  {
    id: 'notif-03',
    project_id: '11111111-1111-1111-1111-111111111113',
    notification_type: 'SECTION_11',
    gazette_number: 'S.O. 3410(E)',
    publication_date: '2026-08-15',
    survey_boundaries_summary: 'Rewari Tehsil: Villages Bawal, Dharuhera West, Pataudi Border (Ch 54+800 to 88+200)',
    status: 'HEARING_ACTIVE',
    objections_count: 64,
    objections_disposed: 18,
    hearing_scheduled_date: '2026-09-10',
    pdf_url: '/docs/gazette_so_3410.pdf',
    sha256_hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
  }
];

export interface AwardEntity {
  id: string;
  project_id: string;
  award_number: string;
  award_date: string;
  total_awarded_amount: number;
  solatium_percentage: number;
  interest_rate_percentage: number;
  market_value: number;
  solatium_amount: number;
  interest_amount: number;
  assets_value: number;
  status: 'DECLARED' | 'PFMS_QUEUED' | 'DISBURSED' | 'DISPUTED';
  parcels_included: number;
  sha256_checksum: string;
}

export const MOCK_AWARDS: AwardEntity[] = [
  {
    id: 'award-01',
    project_id: '11111111-1111-1111-1111-111111111111',
    award_number: 'CALA/GGM/2026/AWD-89',
    award_date: '2026-08-20',
    market_value: 23100000,
    solatium_percentage: 100,
    solatium_amount: 23100000,
    interest_rate_percentage: 12,
    interest_amount: 2772000,
    assets_value: 3200000,
    total_awarded_amount: 52172000,
    status: 'DECLARED',
    parcels_included: 14,
    sha256_checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'award-02',
    project_id: '11111111-1111-1111-1111-111111111111',
    award_number: 'CALA/GGM/2026/AWD-90',
    award_date: '2026-08-24',
    market_value: 17100000,
    solatium_percentage: 100,
    solatium_amount: 17100000,
    interest_rate_percentage: 12,
    interest_amount: 2052000,
    assets_value: 450000,
    total_awarded_amount: 36702000,
    status: 'PFMS_QUEUED',
    parcels_included: 8,
    sha256_checksum: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  }
];

export interface PaymentBatchEntity {
  id: string;
  project_id: string;
  batch_reference: string;
  disbursement_source: 'PFMS' | 'DBT' | 'ESCROW';
  total_amount: number;
  total_beneficiaries: number;
  processed_beneficiaries: number;
  status: 'PENDING' | 'TRANSMITTED' | 'RECONCILED' | 'PARTIAL_FAILURE';
  created_at: string;
  utr_number?: string;
}

export const MOCK_PAYMENT_BATCHES: PaymentBatchEntity[] = [
  {
    id: 'batch-01',
    project_id: '11111111-1111-1111-1111-111111111111',
    batch_reference: 'PFMS-2026-MORTH-8841',
    disbursement_source: 'PFMS',
    total_amount: 52172000,
    total_beneficiaries: 18,
    processed_beneficiaries: 18,
    status: 'RECONCILED',
    created_at: '2026-08-22T10:00:00Z',
    utr_number: 'SBIN2026082218491209',
  },
  {
    id: 'batch-02',
    project_id: '11111111-1111-1111-1111-111111111111',
    batch_reference: 'PFMS-2026-MORTH-8842',
    disbursement_source: 'PFMS',
    total_amount: 36702000,
    total_beneficiaries: 12,
    processed_beneficiaries: 7,
    status: 'TRANSMITTED',
    created_at: '2026-08-26T14:30:00Z',
    utr_number: 'PNDG-UTR-AWAITING-ESCROW',
  }
];

export interface AffectedFamilyEntity {
  id: string;
  project_id: string;
  family_head_name: string;
  aadhaar_masked: string;
  category: 'LANDOWNER' | 'AGRICULTURAL_LABOURER' | 'TENANT' | 'RURAL_ARTISAN';
  is_displaced: boolean;
  village_name: string;
  members_count: number;
  entitlements: Array<{
    type: 'HOUSE_ALLOTMENT' | 'SUBSISTENCE_ALLOWANCE' | 'ANNUITY_OR_JOB' | 'CATTLE_SHED_GRANT';
    description: string;
    amount?: number;
    status: 'ELIGIBLE' | 'SANCTIONED' | 'DISBURSED' | 'POSSESSION_GIVEN';
  }>;
}

export const MOCK_AFFECTED_FAMILIES: AffectedFamilyEntity[] = [
  {
    id: 'fam-01',
    project_id: '11111111-1111-1111-1111-111111111111',
    family_head_name: 'Shri Rameshwar Singh Yadav',
    aadhaar_masked: 'XXXX-XXXX-4812',
    category: 'LANDOWNER',
    is_displaced: true,
    village_name: 'Fazilpur',
    members_count: 5,
    entitlements: [
      {
        type: 'HOUSE_ALLOTMENT',
        description: 'Plot 44, Sector 12 R&R Resettlement Colony (PMAY Standards)',
        status: 'SANCTIONED',
      },
      {
        type: 'SUBSISTENCE_ALLOWANCE',
        description: 'RFCTLARR Schedule 2 One-Time Subsistence Grant',
        amount: 50000,
        status: 'DISBURSED',
      },
      {
        type: 'CATTLE_SHED_GRANT',
        description: 'Grant for construction of rural cattle shed / fodder store',
        amount: 25000,
        status: 'SANCTIONED',
      }
    ],
  },
  {
    id: 'fam-02',
    project_id: '11111111-1111-1111-1111-111111111111',
    family_head_name: 'Smt. Kamla Devi w/o Late Mohan Lal',
    aadhaar_masked: 'XXXX-XXXX-9281',
    category: 'AGRICULTURAL_LABOURER',
    is_displaced: false,
    village_name: 'Badshahpur',
    members_count: 3,
    entitlements: [
      {
        type: 'SUBSISTENCE_ALLOWANCE',
        description: 'Livelihood Disruption Grant for Agricultural Labourers',
        amount: 50000,
        status: 'DISBURSED',
      },
      {
        type: 'ANNUITY_OR_JOB',
        description: 'Monthly subsistence annuity assistance (₹3,000 / month for 12 months)',
        amount: 36000,
        status: 'SANCTIONED',
      }
    ],
  },
  {
    id: 'fam-03',
    project_id: '11111111-1111-1111-1111-111111111111',
    family_head_name: 'Shri Sukhdev Singh Dhillon',
    aadhaar_masked: 'XXXX-XXXX-1904',
    category: 'LANDOWNER',
    is_displaced: true,
    village_name: 'Pataudi Rural',
    members_count: 6,
    entitlements: [
      {
        type: 'HOUSE_ALLOTMENT',
        description: 'Plot 18, Sector 14 Pataudi Resettlement Scheme',
        status: 'ELIGIBLE',
      },
      {
        type: 'SUBSISTENCE_ALLOWANCE',
        description: 'Schedule 2 One-Time Resettlement Subsistence Allowance',
        amount: 50000,
        status: 'ELIGIBLE',
      }
    ],
  }
];

export interface AuditLogEntity {
  id: string;
  action: string;
  entity_type: 'PROJECT' | 'PARCEL' | 'NOTIFICATION' | 'AWARD' | 'COMPENSATION' | 'PAYMENT_BATCH' | 'RR_FAMILY';
  entity_id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  timestamp: string;
  correlation_id: string;
  sha256_hash: string;
  details: string;
}

export const MOCK_AUDIT_LOGS: AuditLogEntity[] = [
  {
    id: 'audit-01',
    action: 'AWARD_DECLARED',
    entity_type: 'AWARD',
    entity_id: 'award-01',
    actor_id: '00000000-0000-0000-0000-000000000002',
    actor_name: 'Sh. Nishant Kumar Yadav, IAS (CALA)',
    actor_role: 'DLAO',
    timestamp: '2026-08-20T14:30:12Z',
    correlation_id: 'corr-89fa-1123',
    sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    details: 'Statutory Section 23/31 Award declared for 14 Fazilpur Khasras totaling ₹ 5,21,72,000.',
  },
  {
    id: 'audit-02',
    action: 'PAYMENT_BATCH_INITIATED',
    entity_type: 'PAYMENT_BATCH',
    entity_id: 'batch-01',
    actor_id: '00000000-0000-0000-0000-000000000005',
    actor_name: 'Sunil Verma (Compensation Officer)',
    actor_role: 'COMPENSATION_OFFICER',
    timestamp: '2026-08-22T10:15:45Z',
    correlation_id: 'corr-89fa-1124',
    sha256_hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    details: 'PFMS DBT Batch 8841 transmitted to Reserve Bank of India / SBI Clearing Escrow.',
  },
  {
    id: 'audit-03',
    action: 'NOTIFICATION_ISSUED_SECTION_19',
    entity_type: 'NOTIFICATION',
    entity_id: 'notif-01',
    actor_id: '00000000-0000-0000-0000-000000000002',
    actor_name: 'Sh. Nishant Kumar Yadav, IAS (CALA)',
    actor_role: 'DLAO',
    timestamp: '2026-08-18T09:00:00Z',
    correlation_id: 'corr-71aa-4509',
    sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    details: 'Section 19 Declaration published under Extraordinary Gazette S.O. 4192(E).',
  },
  {
    id: 'audit-04',
    action: 'PARCEL_VERIFIED',
    entity_type: 'PARCEL',
    entity_id: 'kh-RO-1',
    actor_id: '00000000-0000-0000-0000-000000000004',
    actor_name: 'Sunil Kataria (Patwari Cir. 4)',
    actor_role: 'SURVEYOR',
    timestamp: '2026-08-04T11:20:00Z',
    correlation_id: 'corr-33cc-9811',
    sha256_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    details: 'Field geo-tagged boundaries and 1 tubewell asset verified on-site via mobile PWA.',
  },
  {
    id: 'audit-05',
    action: 'PROJECT_APPROVED',
    entity_type: 'PROJECT',
    entity_id: '11111111-1111-1111-1111-111111111111',
    actor_id: '00000000-0000-0000-0000-000000000001',
    actor_name: 'Joint Secretary (Land Acquisition), MoRTH',
    actor_role: 'NATIONAL_ADMIN',
    timestamp: '2026-08-15T14:30:00Z',
    correlation_id: 'corr-10bb-8822',
    sha256_hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    details: 'Statutory approval granted following Social Impact Assessment (SIA) scrutiny clearance.',
  }
];

