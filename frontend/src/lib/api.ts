const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro na requisição' }));
    throw new Error(error.detail || 'Erro na requisição');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; full_name: string; cpf: string; role: string }) =>
      request<{ access_token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<{ access_token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    loginWithWallet: (public_key: string) =>
      request<{ access_token: string; user: any }>('/auth/login-wallet', { method: 'POST', body: JSON.stringify({ public_key }) }),
    registerWithWallet: (data: { public_key: string; role: string }) =>
      request<{ access_token: string; user: any }>('/auth/register-wallet', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request<any>('/auth/me'),
  },
  score: {
    get: () => request<any>('/score'),
    calculate: () => request<any>('/score/calculate', { method: 'POST' }),
    simulate: (sources: string[]) =>
      request<any>('/score/simulate', { method: 'POST', body: JSON.stringify({ sources }) }),
  },
  properties: {
    list: () => request<any[]>('/properties'),
    get: (id: number) => request<any>(`/properties/${id}`),
  },
  contracts: {
    list: () => request<any[]>('/contracts'),
    create: (data: { property_id: number }) =>
      request<any>('/contracts', { method: 'POST', body: JSON.stringify(data) }),
  },
  landlord: {
    properties: () => request<any[]>('/landlord/properties'),
    contracts: () => request<any[]>('/landlord/contracts'),
    acceptContract: (id: number) =>
      request<any>(`/landlord/contracts/${id}/accept`, { method: 'PATCH' }),
    rejectContract: (id: number) =>
      request<any>(`/landlord/contracts/${id}/reject`, { method: 'PATCH' }),
  },
};
