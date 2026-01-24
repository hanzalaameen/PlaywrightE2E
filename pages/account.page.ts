import { expect, type Locator, type Page } from '@playwright/test';

export class AccountPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /my account/i });
    this.homeLink = page.getByRole('link', { name: /^home$/i });
  }

  async assertLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 15000 });
  }

  async goHome() {
    await this.homeLink.click();
  }
}
