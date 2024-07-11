
export interface ApiConfig {
  readonly USERS: string;
  readonly EMAILS: string;
  readonly TICKETS: string;
  readonly LOGIN: string;
  readonly LOGOUT: string;
  readonly TOKEN: string;
}

const API = '/api';

export const API_CONFIG: ApiConfig = {
  USERS: `${API}/users`,
  EMAILS: `${API}/emails`,
  TICKETS: `${API}/tickets`,
  LOGIN: `${API}/auth/login`,
  LOGOUT: `${API}/auth/logout`,
  TOKEN: `${API}/auth/token`
};

export interface ResponseMessage {
  message: string;
}