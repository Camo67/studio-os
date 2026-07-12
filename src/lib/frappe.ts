// Frappe/ERPNext API Client for Studio OS
// Docs: https://docs.frappe.io/framework/user/en/api/rest

export interface FrappeConfig {
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  token?: string;
}

export interface Lead {
  name?: string;
  lead_name: string;
  first_name?: string;
  last_name?: string;
  email_id?: string;
  phone?: string;
  mobile_no?: string;
  company_name?: string;
  lead_owner?: string;
  status: string;
  territory?: string;
  industry?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
  creation?: string;
  modified?: string;
}

export interface Opportunity {
  name?: string;
  opportunity_from?: string;
  party_name?: string;
  customer_name?: string;
  opportunity_type?: string;
  opportunity_owner?: string;
  status: string;
  sales_stage?: string;
  expected_closing?: string;
  probability?: number;
  opportunity_amount?: number;
  currency?: string;
  company?: string;
  territory?: string;
  contact_person?: string;
  contact_email?: string;
  creation?: string;
  modified?: string;
}

export interface Customer {
  name?: string;
  customer_name: string;
  customer_type?: string;
  customer_group?: string;
  territory?: string;
  email_id?: string;
  mobile_no?: string;
  website?: string;
  lead_name?: string;
  creation?: string;
  modified?: string;
}

export interface Contact {
  name?: string;
  first_name: string;
  last_name?: string;
  email_id?: string;
  phone?: string;
  mobile_no?: string;
  company_name?: string;
  designation?: string;
  creation?: string;
  modified?: string;
}

class FrappeClient {
  private config: FrappeConfig;

  constructor(config: FrappeConfig) {
    this.config = config;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey && this.config.apiSecret) {
      headers['Authorization'] = `token ${this.config.apiKey}:${this.config.apiSecret}`;
    } else if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }

    return headers;
  }

  private async request(method: string, path: string, body?: any): Promise<any> {
    const url = `${this.config.baseUrl}${path}`;
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Frappe API error: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(username: string, password: string): Promise<any> {
    return this.request('POST', '/api/method/login', {
      usr: username,
      pwd: password,
    });
  }

  async getLoggedUser(): Promise<any> {
    return this.request('GET', '/api/method/frappe.auth.get_logged_user');
  }

  // Generic CRUD
  async list(doctype: string, filters?: any[], fields?: string[], orderBy?: string, limit?: number): Promise<any> {
    const params = new URLSearchParams();
    if (fields) params.append('fields', JSON.stringify(fields));
    if (filters) params.append('filters', JSON.stringify(filters));
    if (orderBy) params.append('order_by', orderBy);
    if (limit) params.append('limit_page_length', limit.toString());
    
    return this.request('GET', `/api/resource/${doctype}?${params.toString()}`);
  }

  async get(doctype: string, name: string): Promise<any> {
    return this.request('GET', `/api/resource/${doctype}/${name}`);
  }

  async create(doctype: string, data: any): Promise<any> {
    return this.request('POST', `/api/resource/${doctype}`, data);
  }

  async update(doctype: string, name: string, data: any): Promise<any> {
    return this.request('PUT', `/api/resource/${doctype}/${name}`, data);
  }

  async delete(doctype: string, name: string): Promise<any> {
    return this.request('DELETE', `/api/resource/${doctype}/${name}`);
  }

  // CRM Specific Methods
  async getLeads(filters?: any[]): Promise<Lead[]> {
    const result = await this.list('Lead', filters, undefined, 'creation desc', 100);
    return result.data || [];
  }

  async getLead(name: string): Promise<Lead> {
    const result = await this.get('Lead', name);
    return result.data;
  }

  async createLead(data: Partial<Lead>): Promise<Lead> {
    const result = await this.create('Lead', data);
    return result.data;
  }

  async updateLead(name: string, data: Partial<Lead>): Promise<Lead> {
    const result = await this.update('Lead', name, data);
    return result.data;
  }

  async deleteLead(name: string): Promise<any> {
    return this.delete('Lead', name);
  }

  async getOpportunities(filters?: any[]): Promise<Opportunity[]> {
    const result = await this.list('Opportunity', filters, undefined, 'creation desc', 100);
    return result.data || [];
  }

  async getOpportunity(name: string): Promise<Opportunity> {
    const result = await this.get('Opportunity', name);
    return result.data;
  }

  async createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
    const result = await this.create('Opportunity', data);
    return result.data;
  }

  async updateOpportunity(name: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const result = await this.update('Opportunity', name, data);
    return result.data;
  }

  async deleteOpportunity(name: string): Promise<any> {
    return this.delete('Opportunity', name);
  }

  async getCustomers(filters?: any[]): Promise<Customer[]> {
    const result = await this.list('Customer', filters, undefined, 'creation desc', 100);
    return result.data || [];
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const result = await this.create('Customer', data);
    return result.data;
  }

  async getContacts(filters?: any[]): Promise<Contact[]> {
    const result = await this.list('Contact', filters, undefined, 'creation desc', 100);
    return result.data || [];
  }

  async createContact(data: Partial<Contact>): Promise<Contact> {
    const result = await this.create('Contact', data);
    return result.data;
  }

  // Utility
  async isConnected(): Promise<boolean> {
    try {
      await this.getLoggedUser();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let clientInstance: FrappeClient | null = null;

export function getFrappeClient(config?: FrappeConfig): FrappeClient {
  if (!clientInstance && config) {
    clientInstance = new FrappeClient(config);
  }
  return clientInstance!;
}

export function createFrappeClient(config: FrappeConfig): FrappeClient {
  clientInstance = new FrappeClient(config);
  return clientInstance;
}