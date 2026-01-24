import { Page, Locator, expect } from '@playwright/test';

export class ProductGrid {
  readonly cards: Locator;
  readonly titles: Locator;

  constructor(page: Page) {
    this.cards = page.locator('.card');
    this.titles = page.locator('.card .card-title'); // ✅ title only
  }

  async countProducts(): Promise<number> {
    await this.cards.first().waitFor();
    return await this.cards.count();
  }

  async getProductNames(): Promise<string[]> {
    await this.titles.first().waitFor();
    const raw = await this.titles.allTextContents();

    // clean + normalize whitespace
    return raw.map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }

  async expectProductVisible(name: string) {
    await expect(this.cards.filter({ hasText: name })).toBeVisible();
  }
}
