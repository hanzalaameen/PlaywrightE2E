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

  async getCategories(token: string) {
    const res = await this.api.get(`${this.baseUrl}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    });
    expect(res.status()).toBe(200);
    return await res.json(); // array
  }

  async searchProducts(token: string, q: string) {
    const res = await this.api.get(
      `${this.baseUrl}/products/search?q=${encodeURIComponent(q)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      }
    );
    expect(res.status()).toBe(200);
    return await res.json(); // { data: [...] }
  }

  async getProductsByCategory(token: string, categoryId: string) {
    const res = await this.api.get(
      `${this.baseUrl}/products?by_category=${encodeURIComponent(categoryId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      }
    );
    expect(res.status()).toBe(200);
    return await res.json(); // { data: [...] }
  }
}

