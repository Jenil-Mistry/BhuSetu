/**
 * BhuSetu API Client
 * Connects to FastAPI Backend at http://localhost:8000/api/v1
 * Features automatic fallback to enriched local mock data when offline.
 */

import { 
  MOCK_PROJECTS, 
  MOCK_PARCELS, 
  MOCK_NOTIFICATIONS, 
  MOCK_AWARDS, 
  MOCK_PAYMENT_BATCHES, 
  MOCK_AFFECTED_FAMILIES, 
  MOCK_AUDIT_LOGS,
  MOCK_KPI,
  ProjectEntity,
  NotificationEntity,
  AwardEntity,
  PaymentBatchEntity,
  AffectedFamilyEntity,
  AuditLogEntity
} from './mock-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

function getAuthHeader(role?: string): HeadersInit {
  const tokenMap: Record<string, string> = {
    pia: 'pia',
    dlao: 'dlao',
    cala: 'dlao',
    'revenue-officer': 'surveyor',
    surveyor: 'surveyor',
    compensation: 'compensation',
    rr: 'rr',
    central: 'admin',
    admin: 'admin',
  };

  const bearer = role && tokenMap[role.toLowerCase()] ? tokenMap[role.toLowerCase()] : 'admin';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${bearer}`,
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}, fallbackData?: T): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for local API check

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getAuthHeader(),
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    return (json.data !== undefined ? json.data : json) as T;
  } catch (err) {
    // Graceful offline fallback
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

// ============================================================================
// Projects & Proposal API
// ============================================================================
export const projectsApi = {
  async list(status?: string, districtId?: number): Promise<ProjectEntity[]> {
    let filtered = [...MOCK_PROJECTS];
    if (status) filtered = filtered.filter(p => p.status === status);
    if (districtId) filtered = filtered.filter(p => p.district_id === districtId);

    const query = new URLSearchParams();
    if (status) query.set('status', status);
    if (districtId) query.set('district_id', districtId.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';

    return request<ProjectEntity[]>(`/projects${qs}`, { method: 'GET' }, filtered);
  },

  async get(id: string): Promise<ProjectEntity> {
    const fallback = MOCK_PROJECTS.find(p => p.id === id) || MOCK_PROJECTS[0];
    return request<ProjectEntity>(`/projects/${id}`, { method: 'GET' }, fallback);
  },

  async create(payload: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const newProject: ProjectEntity = {
      id: `proj-${Date.now()}`,
      name: payload.name || 'New Acquisition Project',
      code: payload.code || `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      description: payload.description || '',
      status: 'DRAFT',
      district_id: payload.district_id || 1,
      district_name: payload.district_name || 'Gurugram',
      state_name: payload.state_name || 'Haryana',
      organization_id: payload.organization_id || 1,
      organization_name: payload.organization_name || 'National Highways Authority of India (NHAI)',
      estimated_budget: payload.estimated_budget || 500000000,
      estimated_area_hectares: payload.estimated_area_hectares || 45.0,
      requiring_body: payload.requiring_body || 'MoRTH / NHAI',
      purpose: payload.purpose || 'Highway expansion',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sla_days_left: 90,
      parcels_count: 0,
    };
    return request<ProjectEntity>(`/projects`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, newProject);
  },

  async submit(id: string, notes?: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/projects/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ submission_notes: notes || 'Submitted for statutory scrutiny' }),
    }, { success: true, message: 'Proposal submitted for statutory scrutiny.' });
  },

  async transition(id: string, action: string, comment?: string): Promise<any> {
    return request(`/projects/${id}/transition`, {
      method: 'POST',
      body: JSON.stringify({ action, comment }),
    }, { success: true, action, comment });
  },

  async getTimeline(id: string): Promise<any[]> {
    return request<any[]>(`/projects/${id}/timeline`, { method: 'GET' }, [
      {
        id: 't-1',
        action: 'PROJECT_DRAFT_CREATED',
        actor_name: 'Director (Technical), NHAI',
        actor_role: 'PIA',
        timestamp: '2026-06-12T10:00:00Z',
        comment: 'Initial acquisition corridor alignment uploaded from DPR KML.',
      },
      {
        id: 't-2',
        action: 'PROPOSAL_SUBMITTED',
        actor_name: 'Director (Technical), NHAI',
        actor_role: 'PIA',
        timestamp: '2026-06-18T14:30:00Z',
        comment: 'Formal submission under RFCTLARR Act with SIA exemption certificate.',
      },
      {
        id: 't-3',
        action: 'SCRUTINY_ASSIGNED',
        actor_name: 'District Revenue Office',
        actor_role: 'DLAO',
        timestamp: '2026-06-25T11:15:00Z',
        comment: 'Scrutiny assigned to Sub-Divisional Magistrate (SDM) Gurugram.',
      },
      {
        id: 't-4',
        action: 'PROJECT_APPROVED',
        actor_name: 'Joint Secretary (Land Acquisition), MoRTH',
        actor_role: 'NATIONAL_ADMIN',
        timestamp: '2026-08-15T14:30:00Z',
        comment: 'Statutory approval granted following Social Impact Assessment clearance.',
      }
    ]);
  }
};

// ============================================================================
// Parcels & Spatial GIS API
// ============================================================================
export const parcelsApi = {
  async list(projectId?: string, status?: string): Promise<any[]> {
    return request<any[]>(`/parcels`, { method: 'GET' }, MOCK_PARCELS);
  },

  async get(id: string): Promise<any> {
    const fallback = MOCK_PARCELS.find(p => p.id === id) || MOCK_PARCELS[0];
    return request<any>(`/parcels/${id}`, { method: 'GET' }, fallback);
  },

  async verify(parcelId: string, verificationData: any): Promise<any> {
    return request(`/parcels/${parcelId}/verify`, {
      method: 'POST',
      body: JSON.stringify(verificationData),
    }, { success: true, message: 'Parcel verification successfully logged.' });
  },

  async calculateIntersections(geojsonGeometry: any, projectId?: string): Promise<any[]> {
    return request<any[]>(`/spatial/calculate-intersections`, {
      method: 'POST',
      body: JSON.stringify({ geojson_geometry: geojsonGeometry, project_id: projectId }),
    }, [
      {
        parcel_id: 'kh-101',
        parcel_number: '188/3 (Fazilpur)',
        overlap_area_sq_meters: 8400.0,
        overlap_area_hectares: 0.84,
        total_parcel_area_hectares: 2.10,
        overlap_percentage: 40.0,
        status: 'SEC_11_NOTIFIED',
        landowner: 'Deepak Yadav & Suman Yadav',
      },
      {
        parcel_id: 'kh-102',
        parcel_number: '189/1 (Fazilpur)',
        overlap_area_sq_meters: 14500.0,
        overlap_area_hectares: 1.45,
        total_parcel_area_hectares: 1.45,
        overlap_percentage: 100.0,
        status: 'SEC_11_NOTIFIED',
        landowner: 'Mahabir Prasad & Co-sharers',
      },
      {
        parcel_id: 'kh-104',
        parcel_number: '204 (Fazilpur)',
        overlap_area_sq_meters: 11500.0,
        overlap_area_hectares: 1.15,
        total_parcel_area_hectares: 1.15,
        overlap_percentage: 100.0,
        status: 'DISPUTED',
        landowner: 'Ramesh Chandra Yadav & 3 Co-sharers',
      }
    ]);
  }
};

// ============================================================================
// Notifications & Gazette API
// ============================================================================
export const notificationsApi = {
  async list(projectId: string): Promise<NotificationEntity[]> {
    return request<NotificationEntity[]>(
      `/projects/${projectId}/notifications`, 
      { method: 'GET' }, 
      MOCK_NOTIFICATIONS
    );
  },

  async issue(projectId: string, payload: any): Promise<NotificationEntity> {
    const newNotif: NotificationEntity = {
      id: `notif-${Date.now()}`,
      project_id: projectId,
      notification_type: payload.notification_type || 'SECTION_11',
      gazette_number: payload.gazette_number || `S.O. ${Math.floor(1000 + Math.random() * 9000)}(E)`,
      publication_date: payload.publication_date || new Date().toISOString().split('T')[0],
      survey_boundaries_summary: payload.survey_boundaries_summary || 'All affected survey numbers per alignment',
      status: 'PUBLISHED',
      objections_count: 0,
      objections_disposed: 0,
      sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    };
    return request<NotificationEntity>(
      `/projects/${projectId}/notifications`,
      { method: 'POST', body: JSON.stringify(payload) },
      newNotif
    );
  }
};

// ============================================================================
// Compensation, Awards & PFMS API
// ============================================================================
export const compensationApi = {
  async listAwards(projectId: string): Promise<AwardEntity[]> {
    return request<AwardEntity[]>(
      `/projects/${projectId}/awards`,
      { method: 'GET' },
      MOCK_AWARDS
    );
  },

  async declareAward(projectId: string, payload: any): Promise<AwardEntity> {
    const newAward: AwardEntity = {
      id: `award-${Date.now()}`,
      project_id: projectId,
      award_number: payload.award_number || `CALA/GGM/2026/AWD-${Math.floor(100 + Math.random() * 900)}`,
      award_date: payload.award_date || new Date().toISOString().split('T')[0],
      market_value: payload.market_value || 10000000,
      solatium_percentage: 100,
      solatium_amount: payload.market_value || 10000000,
      interest_rate_percentage: 12,
      interest_amount: (payload.market_value || 10000000) * 0.12,
      assets_value: payload.assets_value || 500000,
      total_awarded_amount: ((payload.market_value || 10000000) * 2.12) + (payload.assets_value || 500000),
      status: 'DECLARED',
      parcels_included: payload.parcels_included || 5,
      sha256_checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
    return request<AwardEntity>(
      `/projects/${projectId}/awards`,
      { method: 'POST', body: JSON.stringify(payload) },
      newAward
    );
  },

  async createPaymentBatch(projectId: string, payload: any): Promise<PaymentBatchEntity> {
    const newBatch: PaymentBatchEntity = {
      id: `batch-${Date.now()}`,
      project_id: projectId,
      batch_reference: payload.batch_reference || `PFMS-2026-MORTH-${Math.floor(1000 + Math.random() * 9000)}`,
      disbursement_source: payload.disbursement_source || 'PFMS',
      total_amount: payload.total_amount || 45000000,
      total_beneficiaries: payload.total_beneficiaries || 10,
      processed_beneficiaries: 0,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    return request<PaymentBatchEntity>(
      `/projects/${projectId}/payment-batches`,
      { method: 'POST', body: JSON.stringify(payload) },
      newBatch
    );
  },

  async reconcilePayment(itemId: string, payload: any): Promise<any> {
    return request(`/payment-items/${itemId}/reconcile`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, { success: true, item_id: itemId, status: payload.status });
  },

  async recordPossession(parcelId: string, payload: any): Promise<any> {
    return request(`/parcels/${parcelId}/possession`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, { success: true, message: `Possession recorded for parcel ${parcelId}.` });
  }
};

// ============================================================================
// Rehabilitation & Resettlement (R&R) API
// ============================================================================
export const rehabilitationApi = {
  async listFamilies(projectId: string): Promise<AffectedFamilyEntity[]> {
    return request<AffectedFamilyEntity[]>(
      `/projects/${projectId}/families`,
      { method: 'GET' },
      MOCK_AFFECTED_FAMILIES
    );
  },

  async registerFamily(projectId: string, payload: any): Promise<AffectedFamilyEntity> {
    const newFam: AffectedFamilyEntity = {
      id: `fam-${Date.now()}`,
      project_id: projectId,
      family_head_name: payload.family_head_name,
      aadhaar_masked: payload.aadhaar_masked || 'XXXX-XXXX-1234',
      category: payload.category || 'LANDOWNER',
      is_displaced: payload.is_displaced ?? true,
      village_name: payload.village_name || 'Fazilpur',
      members_count: payload.members_count || 4,
      entitlements: [
        {
          type: 'SUBSISTENCE_ALLOWANCE',
          description: 'RFCTLARR Schedule 2 One-Time Subsistence Allowance',
          amount: 50000,
          status: 'ELIGIBLE',
        }
      ],
    };
    return request<AffectedFamilyEntity>(
      `/projects/${projectId}/families`,
      { method: 'POST', body: JSON.stringify(payload) },
      newFam
    );
  }
};

// ============================================================================
// Admin, Audit & Reports API
// ============================================================================
export const adminApi = {
  async getAuditLogs(entityType?: string): Promise<AuditLogEntity[]> {
    let logs = [...MOCK_AUDIT_LOGS];
    if (entityType) {
      logs = logs.filter(l => l.entity_type === entityType);
    }
    const query = entityType ? `?entity_type=${entityType}` : '';
    return request<AuditLogEntity[]>(`/admin/audit-logs${query}`, { method: 'GET' }, logs);
  },

  async getOutboxEvents(): Promise<any[]> {
    return request<any[]>(`/admin/outbox-events`, { method: 'GET' }, [
      { id: 'ev-1', event_type: 'project.approved', status: 'DELIVERED', created_at: '2026-08-15T14:30:00Z' },
      { id: 'ev-2', event_type: 'notification.issued', status: 'DELIVERED', created_at: '2026-08-18T09:00:00Z' },
      { id: 'ev-3', event_type: 'award.declared', status: 'DELIVERED', created_at: '2026-08-20T14:30:12Z' },
      { id: 'ev-4', event_type: 'payment.batch.submitted', status: 'PROCESSING', created_at: '2026-08-22T10:15:45Z' },
    ]);
  }
};

export const reportsApi = {
  async getSummary(): Promise<any> {
    return request(`/dashboard/summary`, { method: 'GET' }, MOCK_KPI);
  },

  async triggerExport(reportType: string, format: string = 'CSV'): Promise<any> {
    return request(`/reports/exports`, {
      method: 'POST',
      body: JSON.stringify({ report_type: reportType, format }),
    }, {
      export_id: `exp-${Date.now()}`,
      report_type: reportType,
      status: 'PROCESSING',
      download_url: `/api/v1/reports/exports/exp-${Date.now()}/download`,
    });
  }
};
