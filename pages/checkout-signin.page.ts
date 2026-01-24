import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutSignInPage {
  readonly page: Page;
  readonly alreadyLoggedInText: Locator;
  readonly proceedBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alreadyLoggedInText = page.getByText(/already logged in/i);
    this.proceedBtn = page.getByRole('button', { name: /proceed to checkout/i });
  }

  async assertLoaded() {
    await expect(this.alreadyLoggedInText).toBeVisible({ timeout: 15000 });
  }

  async proceed() {
    await expect(this.proceedBtn).toBeVisible({ timeout: 15000 });
    await this.proceedBtn.click();
  }
}
