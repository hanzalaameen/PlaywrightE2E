import { expect, type Locator, type Page } from '@playwright/test';

export class BillingAddressPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly proceedBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /billing address/i });
    this.proceedBtn = page.getByRole('button', { name: /proceed to checkout/i });
  }

  async assertLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 15000 });
  }

  async proceed() {
    await expect(this.proceedBtn).toBeVisible({ timeout: 15000 });
    await this.proceedBtn.click();
  }
}
