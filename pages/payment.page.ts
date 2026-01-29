import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly paymentDropdown: Locator;
  readonly confirmBtn: Locator;
  readonly successAlert: Locator;
  readonly invoiceLine: Locator;

  constructor(page: Page) {
    this.page = page;

    this.paymentDropdown = page.locator('select');
    this.confirmBtn = page.getByRole('button', { name: 'Confirm' });

    this.successAlert = page.getByText('Payment was successful', { exact: false });
    this.invoiceLine = page.getByText('Your invoice number is', { exact: false });
  }

  async selectCashOnDelivery() {
    await this.paymentDropdown.selectOption({ label: 'Cash on Delivery' });
  }

  async confirmTwiceAndGetInvoice(): Promise<string> {
    await this.confirmBtn.scrollIntoViewIfNeeded();
    await this.confirmBtn.click();
    await expect(this.successAlert).toBeVisible();

    // 2nd click -> show invoice
    await this.confirmBtn.scrollIntoViewIfNeeded();
    await this.confirmBtn.click();

    await expect(this.invoiceLine).toBeVisible();
    const txt = await this.invoiceLine.textContent();

    // Extract INV-xxxxx
    return (txt?.match(/INV-\d+/) ?? [])[0] ?? '';
  }
}
