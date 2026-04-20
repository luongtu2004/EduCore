export type LeadStatus = 'NEW' | 'CONTACTED' | 'CONSULTING' | 'TRIAL_LEARNING' | 'WON' | 'LOST';
export type LeadSource = 'WEBSITE' | 'FACEBOOK' | 'ZALO' | 'REFERRAL' | 'OFFLINE';

export interface Lead {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  note?: string;
  consultantId?: string;
  consultant?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}
