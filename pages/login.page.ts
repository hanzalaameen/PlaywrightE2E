import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByLabel(/Email address/i);
    this.passwordInput = page.getByLabel(/^Password/i);

    // ✅ stable because you shared the exact HTML
    this.loginBtn = page.locator('[data-test="login-submit"]');

    this.registerLink = page.getByRole('link', { name: /Register your account/i });
  }

  async goto() {
    // If your app uses "/#/auth/login", change ONLY here.
    await this.page.goto('/auth/login');
    await expect(this.page.getByRole('heading', { name: /Login/i })).toBeVisible();
  }

  async goToRegister() {
    await this.registerLink.click();
    await expect(this.page.getByRole('heading', { name: /Customer registration/i })).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}
