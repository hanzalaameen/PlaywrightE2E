import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { AccountPage } from '../pages/account.page';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/product.page';
import { CheckoutPage } from '../pages/checkout.page';
import { CheckoutSignInPage } from '../pages/checkout-signin.page';
import { BillingAddressPage } from '../pages/billing-address.page';
import { PaymentPage } from '../pages/payment.page';
import { ToolshopApi } from '../src/api/toolshopApi';

test.setTimeout(120000);

function randomEmail() {
  return `testing+${Date.now()}@mailinator.com`;
}

function moneyToNumber(text: string): number {
  const m = text.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : NaN;
}

test('Scenario 1 Purchase', async ({ page }, testInfo) => {
  const login = new LoginPage(page);
  const register = new RegisterPage(page);
  const account = new AccountPage(page);
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const checkout = new CheckoutPage(page);
  const signincheckout = new CheckoutSignInPage(page);
  const billing = new BillingAddressPage(page);
  const payment = new PaymentPage(page);


  const email = randomEmail();
  const password = 'Start123)(*&';

  const runSummary: any = {
    createdUserEmail: email,
    ui: {
      cartTotalText: null,
      cartTotal: null,
      invoiceNumber: null,
    },
    api: {
      calls: [],
      invoiceTotal: null,
    },
    assertion: {
      uiEqualsApi: null,
    },
  };

  try {
    await test.step('Open login and go to register', async () => {
      await login.goto();
      await login.goToRegister();
    });

    await test.step('Register user from UI', async () => {
      await register.register({
        firstName: 'hey',
        lastName: 'test',
        dob: '1992-08-02',
        street: 'abcdefg',
        postalCode: '12345',
        city: 'test',
        state: 'test',
        countryLabel: 'Albania',
        phone: '123456789',
        email,
        password,
      });

      await testInfo.attach('after-register.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('Login with newly created user', async () => {
      await login.login(email, password);
    });

    await test.step('Assert account page loaded', async () => {
      await account.assertLoaded();

      await testInfo.attach('after-login-account.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    // ✅ CONTINUING FROM ACCOUNT PAGE

    await test.step('Account → Home', async () => {
      await account.goHome();
      await home.assertLoaded();

      await testInfo.attach('home-page.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('Home → Open first product', async () => {
      await home.openFirstProduct();

      await testInfo.attach('product-page.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('Product → Add to cart', async () => {
      await product.addToCart();
    });

    await test.step('Go to Checkout (Cart step)', async () => {
      await product.openCartFromProductPage();

      await testInfo.attach('product-page.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('Capture Cart Total from UI', async () => {
      const totalText = await checkout.getCartTotalText();
      const total = moneyToNumber(totalText);

      expect(total, `Cart total should be a number. Got: "${totalText}"`).not.toBeNaN();

      runSummary.ui.cartTotalText = totalText;
      runSummary.ui.cartTotal = total;

      await testInfo.attach('cart-total.txt', {
        body: Buffer.from(`cartTotalText=${totalText}\ncartTotal=${total}`),
        contentType: 'text/plain',
      });



      await testInfo.attach('cart-page.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      await checkout.proceedToCheckout();
    });

    await test.step('Proceed from checkout signin page', async () => {

        await testInfo.attach('signincart-page.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    
        await signincheckout.proceed();
    });

    await test.step('Proceed from billing address page', async () => {

        await testInfo.attach('billing-page.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    
        await billing.proceed();
    });


    await test.step('complete payment and capture invoice number', async () => {

  await payment.selectCashOnDelivery();
  const invoice = await payment.confirmTwiceAndGetInvoice();
  expect(invoice).not.toBe('');
  runSummary.ui.invoiceNumber = invoice;

  await testInfo.attach('payment.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
});

await test.step('Compare total and invoice number', async () => {
  const baseUrl = process.env.API_BASE_URL!;
  const api = new ToolshopApi(page.request, baseUrl);

  const token = await api.login(email, password);
  const invoicesRes = await api.listInvoices(token);

  const invoices = invoicesRes.data;
  expect(Array.isArray(invoices)).toBeTruthy();

  // find invoice in list by number
  const apiInvoice = invoices.find((i: any) => i.invoice_number === runSummary.ui.invoiceNumber);
  expect(apiInvoice, `Invoice not found in API response: ${runSummary.ui.invoiceNumber}`).toBeTruthy();

  const apiInvoiceNumber = apiInvoice.invoice_number;
  const apiTotal = Number(apiInvoice.total);

  // compare invoice_number + total
  expect(apiInvoiceNumber).toBe(runSummary.ui.invoiceNumber);
  expect(apiTotal).toBeCloseTo(runSummary.ui.cartTotal, 2);

  // store in summary (optional)
  runSummary.api.invoiceTotal = apiTotal;
  runSummary.assertion.uiEqualsApi = true;
});


  } finally {
    await testInfo.attach('run-summary.json', {
      body: Buffer.from(JSON.stringify(runSummary, null, 2)),
      contentType: 'application/json',
    });
  }
});
