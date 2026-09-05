export interface User {
  id: number;
  email: string;
  full_name: string;
  cpf?: string;
  role: 'tenant' | 'landlord';
  solana_public_key?: string;
  created_at: string;
}

export interface Property {
  id: number;
  title: string;
  address: string;
  neighborhood: string;
  rent_value: number;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  description: string;
  accepts_altscore: boolean;
  image_url: string;
  landlord_name: string;
}

export interface ScoreBreakdown {
  payment: number;
  income: number;
  finance: number;
  social: number;
}

export interface Score {
  total: number;
  breakdown: ScoreBreakdown;
  level: string;
  connected_sources: string[];
}

export interface Contract {
  id: number;
  property_id: number;
  property_title: string;
  tenant_id: number;
  landlord_id: number;
  rent_value: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  solana_tx_hash?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
