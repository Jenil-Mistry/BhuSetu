export type RfctlarrStatus = 
  | 'not_started' 
  | 'sec11_notified' 
  | 'award_declared' 
  | 'possession_taken' 
  | 'disputed';

export interface CadastralParcel {
  id: string;
  khasraNo: string;
  village: string;
  tehsil: string;
  district: string;
  chainage: string;
  areaHectares: number;
  landowner: string;
  status: RfctlarrStatus;
  baseRatePerHa: number;
  assetsValuation: number;
  solatium100Percent: number;
  totalCompensation: number;
  sec11Date?: string;
  sec19Date?: string;
  awardDate?: string;
  possessionDate?: string;
  disputeReason?: string;
  slaDeadlineDays?: number;
  coordinates: [number, number][]; // GeoJSON polygon exterior ring [lng, lat]
}

export interface ChainagePackage {
  id: string;
  code: string;
  title: string;
  district: string;
  chainageStart: string;
  chainageEnd: string;
  lengthKm: number;
  totalParcels: number;
  sec11Count: number;
  sec19Count: number;
  awardCount: number;
  possessionCount: number;
  possessionPercentage: number;
  criticalFlag: boolean;
  slaDaysLeft: number;
  bottleneckSummary?: string;
}

export interface KpiGlance {
  landRequiredHa: number;
  landAcquiredHa: number;
  fundsWithCalaCrores: number;
  fundsDisbursedCrores: number;
  totalFundsAllocatedCrores: number;
  bottleneckCount: number;
  totalParcelsCount: number;
  totalPafCount: number;
  disbursedPafCount: number;
}
