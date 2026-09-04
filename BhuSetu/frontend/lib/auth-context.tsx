'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'pia' | 'cala' | 'revenue-officer' | 'citizen' | 'central';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  designation: string;
  department: string;
  identifier: string; // Gov email or Aadhaar / mobile
  jurisdiction: string;
  initials: string;
  badge: string;
  dashboardRoute: string;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  pia: {
    id: 'usr-pia-01',
    role: 'pia',
    name: 'Col. R. K. Sharma',
    designation: 'Project Director, PIA',
    department: 'National Highways Authority of India (NHAI) / MoRTH',
    identifier: 'director.nhai@nic.in',
    jurisdiction: 'NH-48 Greenfield Corridor (Ch 0+000 to 120+000)',
    initials: 'RS',
    badge: 'PIA Executive',
    dashboardRoute: '/dashboard/pia',
  },
  cala: {
    id: 'usr-cala-01',
    role: 'cala',
    name: 'Dr. S. Mukherjee, IAS',
    designation: 'District Collector & Competent Authority (CALA)',
    department: 'Revenue & Disaster Management Dept, Gurugram',
    identifier: 'cala.gurugram@gov.in',
    jurisdiction: 'District Gurugram, Haryana (Sub-division Sohna & Manesar)',
    initials: 'SM',
    badge: 'CALA / Collector',
    dashboardRoute: '/dashboard/cala',
  },
  'revenue-officer': {
    id: 'usr-ro-01',
    role: 'revenue-officer',
    name: 'Rajesh Kumar',
    designation: 'Tehsildar & Field Verification Officer',
    department: 'Revenue Department & Land Records Office',
    identifier: 'ro.fazilpur@gov.in',
    jurisdiction: 'Tehsil Pataudi • Villages Fazilpur & Kherki Daula',
    initials: 'RK',
    badge: 'Field Revenue Officer',
    dashboardRoute: '/dashboard/revenue-officer',
  },
  citizen: {
    id: 'usr-cit-01',
    role: 'citizen',
    name: 'Ramesh Chandra Yadav',
    designation: 'Project Affected Family (PAF) / Landowner',
    department: 'Public / Beneficiary Portal',
    identifier: 'Aadhaar: •••• •••• 1029',
    jurisdiction: 'Fazilpur Village, Khasra No. 204, Gurugram',
    initials: 'RY',
    badge: 'Citizen / PAF',
    dashboardRoute: '/dashboard/citizen',
  },
  central: {
    id: 'usr-central-01',
    role: 'central',
    name: 'Anurag Verma, IAS',
    designation: 'Joint Secretary (Land Acquisition & Highways)',
    department: 'Ministry of Road Transport and Highways (MoRTH), GoI',
    identifier: 'jointsec.morth@nic.in',
    jurisdiction: 'National Corridors • Apex Monitoring Console',
    initials: 'AV',
    badge: 'Central Authority',
    dashboardRoute: '/dashboard/central',
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  availableRoles: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'bhusetu_active_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem(AUTH_STORAGE_KEY) as UserRole | null;
    if (savedRole && PRESET_USERS[savedRole]) {
      setActiveRole(savedRole);
    }
  }, []);

  const login = (role: UserRole) => {
    setActiveRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, role);
    }
  };

  const logout = () => {
    setActiveRole(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const user = activeRole ? PRESET_USERS[activeRole] : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        availableRoles: Object.values(PRESET_USERS),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
