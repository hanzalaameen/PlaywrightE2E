import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly firstProductLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstProductLink = page.locator('a[href*="/product/"]').first();
  }

  async assertLoaded() {
    await expect(this.firstProductLink).toBeVisible({ timeout: 15000 });
  }

  async openFirstProduct() {
    await this.firstProductLink.click();
    await expect(this.page).toHaveURL(/\/product\//);
  }
}
