
export interface ApiConfig {
  readonly USERS: string;
  readonly EMAILS: string;
  readonly TICKETS: string;
}

const API = '/api';

export const API_CONFIG: ApiConfig = {
  USERS: `${API}/users`,
  EMAILS: `${API}/emails`,
  TICKETS: `${API}/tickets`
};