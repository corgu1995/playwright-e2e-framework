# Playwright E2E Test Automation Framework

![CI](https://github.com/corgu1995/playwright-e2e-framework/actions/workflows/ci.yml/badge.svg)
[![Live Test Report](https://img.shields.io/badge/Live%20Test%20Report-View%20on%20GitHub%20Pages-2ea44f)](https://corgu1995.github.io/playwright-e2e-framework/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 📊 **[View the live test report »](https://corgu1995.github.io/playwright-e2e-framework/)** — the full interactive Playwright HTML report, auto-published to GitHub Pages on every push to `main`.
>
> _Badges and the report go live after the first CI run; the report needs GitHub Pages set to "GitHub Actions" once — see [Live test report](#live-test-report)._

A production-style end-to-end test automation framework built with **Playwright** and **TypeScript**, following the **Page Object Model** and using **custom fixtures** for dependency injection. It exercises the public [Sauce Labs demo site](https://www.saucedemo.com) across Chromium, Firefox, and WebKit.

## Overview

This framework automates the core e-commerce journey of the Sauce Labs demo app and is structured the way a real test suite at a software company would be:

- **Authentication** — valid login, locked-out user error, and invalid-credentials error.
- **Inventory** — product count, sorting (price low-to-high, name Z-to-A), and live cart-badge updates as items are added and removed.
- **Checkout** — a full end-to-end purchase: log in, add items, review the cart, complete the two-step checkout form, and assert the order-confirmation message.

## Why this design

- **Page Object Model** keeps selectors and page behaviour in one place, so tests read as intent (`login`, `addItemToCartByName`, `checkout`) and a UI change is fixed in exactly one file.
- **Custom Playwright fixtures** inject ready-to-use, typed page objects into every test and provide a `loggedInInventoryPage` fixture that removes repetitive login setup — keeping tests focused on the behaviour under test.
- **Strict TypeScript** catches selector/method drift at compile time: a test cannot reference a page method or fixture that does not exist.
- **A shared `BasePage`** centralises navigation and the `data-test` selector strategy, so all page objects stay consistent and resilient to markup churn.

## Tech stack

- [Playwright Test](https://playwright.dev/) `^1.49`
- [TypeScript](https://www.typescriptlang.org/) `^5.6` (strict mode)
- Node.js `>= 20`
- [dotenv](https://github.com/motdotla/dotenv) for environment configuration
- GitHub Actions for CI

## Project structure

```text
playwright-e2e-framework/
├── .github/
│   └── workflows/
│       ├── ci.yml               # CI gate: runs the suite, uploads report artifact
│       └── deploy-report.yml    # Publishes the HTML report to GitHub Pages
├── src/
│   ├── fixtures/
│   │   └── index.ts            # Custom test fixtures (page objects + logged-in state)
│   └── pages/
│       ├── BasePage.ts         # Shared navigation & selector helpers
│       ├── LoginPage.ts        # Login form & error banner
│       ├── InventoryPage.ts    # Product list, sorting, cart actions
│       ├── CartPage.ts         # Cart contents & checkout entry
│       └── CheckoutPage.ts     # Two-step checkout & confirmation
├── tests/
│   ├── auth.spec.ts            # Authentication scenarios
│   ├── inventory.spec.ts       # Inventory & cart-badge scenarios
│   └── checkout.spec.ts        # End-to-end purchase flow
├── .env.example                # Sample environment configuration
├── .gitignore
├── LICENSE
├── package.json
├── playwright.config.ts        # Cross-browser, parallel, retry/trace config
├── tsconfig.json
└── README.md
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright's browser binaries
npm run install:browsers

# 3. (Optional) configure environment — defaults target the public demo site
cp .env.example .env

# 4. Run the full suite (all browsers, headless)
npm test

# 5. Open the HTML report
npm run report
```

Useful scripts:

| Script | Description |
| --- | --- |
| `npm test` | Run all tests across Chromium, Firefox, and WebKit |
| `npm run test:headed` | Run with a visible browser |
| `npm run test:ui` | Launch the interactive Playwright UI mode |
| `npm run test:chromium` | Run only the Chromium project |
| `npm run report` | Open the last HTML report |
| `npm run install:browsers` | Download Playwright browser binaries |

## What this demonstrates

- **Cross-browser execution** — the same suite runs on Chromium, Firefox, and WebKit via Playwright projects.
- **Parallel by default** — `fullyParallel` execution with Playwright's automatic worker scaling.
- **Resilient debugging artifacts** — automatic retries on CI plus trace, screenshot, and video capture on failure.
- **Typed Page Object Model** — strict TypeScript guarantees tests and page objects stay in sync.
- **Custom fixtures** — dependency-injected page objects and a reusable authenticated-session fixture.
- **CI with artifacts** — GitHub Actions installs browsers, runs the suite, and always uploads the HTML report (30-day retention) for inspection.
- **Published live report** — a separate workflow deploys the interactive HTML report to GitHub Pages on every `main` build (see below).

## Live test report

Every push to `main` runs the suite in CI and publishes the **full Playwright HTML report** to GitHub Pages:

**🔗 https://corgu1995.github.io/playwright-e2e-framework/**

The report is interactive — drill into any test to see its steps, timings, and (on failure) the captured trace, screenshot, and video. It is produced by a dedicated [`deploy-report.yml`](.github/workflows/deploy-report.yml) workflow that runs **separately from the CI gate**, so publishing the report never affects the build status.

> **One-time setup:** in this repo go to **Settings → Pages → Build and deployment → Source → "GitHub Actions."** The next push to `main` publishes the report at the URL above.
