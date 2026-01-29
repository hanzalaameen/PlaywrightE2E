import { expect, type Locator, type Page } from '@playwright/test';

export class ProductPage {
  private readonly page: Page;

  readonly addToCartBtn: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    this.cartLink = page.locator('a[href="/checkout"]');
  }

  async assertLoaded() {
    await expect(this.addToCartBtn).toBeVisible({ timeout: 15000 });
  }

  async addToCart() {
    await this.assertLoaded();
    await this.addToCartBtn.click();
  }

  async openCartFromProductPage() {
    await expect(this.cartLink).toBeVisible({ timeout: 15000 });
    await this.cartLink.click();
  }
}
