import { Page, Locator, expect } from '@playwright/test';

export type RegisterUser = {
  firstName: string;
  lastName: string;
  dob: string;        // "1992-08-02"
  street: string;
  postalCode: string;
  city: string;
  state: string;
  countryLabel: string; // "Taiwan" etc (label visible in dropdown)
  phone: string;
  email: string;
  password: string;
};

export class RegisterPage {
  readonly page: Page;

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dob: Locator;
  readonly street: Locator;
  readonly postalCode: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly phone: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly registerBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstName = page.getByLabel(/First name/i);
    this.lastName = page.getByLabel(/Last name/i);
    this.dob = page.getByLabel(/Date of Birth/i);
    this.street = page.getByLabel(/Street/i);
    this.postalCode = page.getByLabel(/Postal code/i);
    this.city = page.getByLabel(/^City/i);
    this.state = page.getByLabel(/^State/i);
    this.country = page.getByLabel(/^Country/i);
    this.phone = page.getByLabel(/^Phone/i);
    this.email = page.getByLabel(/Email address/i);
    this.password = page.getByLabel(/^Password$/i);

    this.registerBtn = page.getByRole('button', { name: /^Register$/i });
  }

  async assertOnPage() {
    await expect(this.page.getByRole('heading', { name: /Customer registration/i })).toBeVisible();
  }

  async register(user: RegisterUser) {
    await this.assertOnPage();

    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.dob.fill(user.dob);

    await this.street.fill(user.street);
    await this.postalCode.fill(user.postalCode);
    await this.city.fill(user.city);
    await this.state.fill(user.state);

    // dropdown
    await this.country.selectOption({ label: user.countryLabel });

    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);

    await this.registerBtn.click();

    // After register, app usually redirects to login.
    await expect(this.page.getByRole('heading', { name: /Login/i })).toBeVisible();
  }
}
