import { APIRequestContext, expect } from '@playwright/test';

export class ToolshopApi {
  constructor(private api: APIRequestContext, private baseUrl: string) {}

  async login(email: string, password: string) {
    const res = await this.api.post(`${this.baseUrl}/users/login`, { data: { email, password } });
    expect(res.status()).toBe(200);
    const json = await res.json();
    return json.access_token as string;
  }

  async listInvoices(token: string) {
    const res = await this.api.get(`${this.baseUrl}/invoices`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    return await res.json(); // { data: [...] ... }
  }
}
