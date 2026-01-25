# Toolshop Playwright E2E Automation

This project contains an end-to-end **Playwright + TypeScript** automation framework built using the **Page Object Model (POM)**.
It validates **UI workflows** and **backend data integrity** by cross-checking UI results against **authenticated API responses**.

---

## Tech Stack

- Playwright (UI + API testing)
- TypeScript
- Page Object Model (POM)
- Component-based UI abstractions
- API integration using Playwright request context

---

## Project Structure

```
tests/
  scenario1.purchase.spec.ts
  scenario2.search.spec.ts

pages/
  login.page.ts
  register.page.ts
  account.page.ts
  home.page.ts
  product.page.ts
  checkout.page.ts
  billing-address.page.ts
  payment.page.ts

components/
  catalogSidebar.ts
  productGrid.ts

src/api/
  toolshopApi.ts
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Install dependencies
```bash
npm install
```

### Install Playwright browsers
```bash
npx playwright install
```

### Environment Variables
Create a `.env` file in the project root:

```env
API_BASE_URL=https://api.practicesoftwaretesting.com
```

> `.env` is ignored via `.gitignore`

---

## Execution Instructions

Run all tests:
```bash
npx playwright test
```

Run specific scenarios:
```bash
npx playwright test tests/scenario1.purchase.spec.ts
npx playwright test tests/scenario2.search.spec.ts
```

Run in headed mode:
```bash
npx playwright test --headed
```

View HTML report:
```bash
npx playwright show-report
```

---
## Scenario 1: End-to-End Purchase Validation

Validates a complete purchase workflow and ensures UI invoice data matches backend records.

**Validations:**
- UI invoice number = API invoice number
- UI total = API total

Artifacts:
- UI screenshots
- run-summary.json

---

## Scenario 2: Inventory Accuracy

### Category Filter (Hammer)
- UI product count vs API product count

### Search (Partial Match - "sledge")
- UI results vs API search response

Artifacts:
- Category screenshot
- Search screenshot
- run-summary.json

---

## Reporting

All screenshots and summary files are attached to the Playwright HTML report.

```bash
npx playwright show-report
```

---

##  Assumptions
- API endpoints require authentication
- UI and API data are expected to be consistent
- Product card contains a distinct title element

---

## Design Principles
- Page Object Model (POM)
- Component-based abstractions
- Deterministic waits
- Clear UI/API separation
