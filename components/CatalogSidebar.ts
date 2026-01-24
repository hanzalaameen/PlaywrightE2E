import { Page, Locator } from '@playwright/test';

export class CatalogSidebar {
  constructor(private page: Page) {}

  async selectCategory(label: string) {
    await this.page
      .locator('label', { hasText: label })
      .locator('input[type="checkbox"]')
      .check();
  }

  async search(term: string) {
    await this.page.locator('input[placeholder="Search"]').fill(term);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }
}
