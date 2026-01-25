import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { AccountPage } from '../pages/account.page';
import { HomePage } from '../pages/home.page';
import { CatalogSidebar } from '../components/CatalogSidebar';
import { ProductGrid } from '../components/ProductGrid';
import { ToolshopApi } from '../src/api/toolshopApi';

test.setTimeout(70000);

function randomEmail() {
  return `testing+${Date.now()}@mailinator.com`;
}

test('Scenario 2 - Inventory Accuracy (Category + Search) UI vs API', async ({ page, request }, testInfo) => {
  const login = new LoginPage(page);
  const register = new RegisterPage(page);
  const account = new AccountPage(page);
  const home = new HomePage(page);

  const sidebar = new CatalogSidebar(page);
  const grid = new ProductGrid(page);

  const api = new ToolshopApi(request, process.env.API_BASE_URL!);

  const email = randomEmail();
  const password = 'Start123)(*&';

  const runSummary: any = {
    ui: {
      category: {
        name: 'Hammer',
        productCount: null,
      },
      search: {
        term: 'sledge',
        productNames: [],
        productCount: null,
      },
    },
    api: {
      category: {
        productCount: null,
      },
      search: {
        productNames: [],
        productCount: null,
      },
    },
    assertion: {
      categoryCountMatch: null,
      searchResultMatch: null,
    },
  };

  try {

    await test.step('Register user via UI', async () => {
      await login.goto();
      await login.goToRegister();

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
    });

    await test.step('Login user and navigate to Home', async () => {
      await login.login(email, password);
      await account.assertLoaded();
      await account.goHome();
      await home.assertLoaded();
    });

//API AUTH
    const token = await test.step('API login (get token)', async () => {
      const t = await api.login(email, password);
      expect(t).toBeTruthy();
      return t;
    });

    // ---------------------------
    // CATEGORY: HAMMER
    // ---------------------------
    await test.step('UI: select Hammer category and capture product count', async () => {
      await sidebar.selectCategory('Hammer');
      await page.waitForTimeout(2000);
      const uiCount = await grid.countProducts();
      expect(uiCount).toBeGreaterThan(0);

      runSummary.ui.category.productCount = uiCount;

      await testInfo.attach('ui-hammer-category.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('API: validate Hammer category product count', async () => {
      const categories = await api.getCategories(token);
      const hammer = categories.find((c: any) => c.name === 'Hammer');
      expect(hammer, 'Hammer category not found in API').toBeTruthy();

      const productsRes = await api.getProductsByCategory(token, hammer.id);
      const apiCount = productsRes.data.length;

      runSummary.api.category.productCount = apiCount;

      expect(runSummary.ui.category.productCount).toBe(apiCount);
      runSummary.assertion.categoryCountMatch = true;
    });

    // ---------------------------
    // SEARCH: SLEDGE
    // ---------------------------
    await test.step('UI: search "sledge" and capture results', async () => {
      // reset state to avoid category filter interference
      await page.reload();

      await sidebar.search('sledge');
      await page.waitForTimeout(2000);
      const names = await grid.getProductNames();
      expect(names.length).toBeGreaterThan(0);
      expect(names.some(n => n.toLowerCase().includes('sledge'))).toBeTruthy();

      runSummary.ui.search.productNames = names;
      runSummary.ui.search.productCount = names.length;

      await testInfo.attach('ui-search-sledge.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('API: validate search "sledge" results', async () => {
      const res = await api.searchProducts(token, 'sledge');

      const apiNames = res.data.map((p: any) => p.name);
      expect(apiNames.some(n => n.toLowerCase().includes('sledge'))).toBeTruthy();

      runSummary.api.search.productNames = apiNames;
      runSummary.api.search.productCount = apiNames.length;

      runSummary.assertion.searchResultMatch = true;
    });

  } finally {
    // ---------------------------
    // REPORTING
    // ---------------------------
    await testInfo.attach('run-summary.json', {
      body: Buffer.from(JSON.stringify(runSummary, null, 2)),
      contentType: 'application/json',
    });
  }
});
