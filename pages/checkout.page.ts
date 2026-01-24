import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly proceedBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceedBtn = page.getByRole('button', { name: /proceed to checkout/i });
  }

  // grabs the value next to the "Total" label on the cart step
  async getCartTotalText(): Promise<string> {
  const totalCell = this.page.locator('[data-test="cart-total"]');

  await expect(totalCell).toBeVisible({ timeout: 15000 });
  return (await totalCell.innerText()).trim();
}

  async proceedToCheckout() {
    await expect(this.proceedBtn).toBeVisible({ timeout: 15000 });
    await this.proceedBtn.click();
  }
}
