import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * Default credentials for the Sauce Labs demo app. Sourced from the
 * environment when available (see `.env.example`) and falling back to the
 * well-known public demo values so the suite runs with zero configuration.
 */
const STANDARD_USER = process.env.STANDARD_USER ?? 'standard_user';
const STANDARD_PASSWORD = process.env.STANDARD_PASSWORD ?? 'secret_sauce';

/**
 * The set of Page Objects (and ready-to-use composites) made available to
 * tests through Playwright's dependency-injection fixtures.
 */
type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /**
   * An {@link InventoryPage} that has already been authenticated as
   * `standard_user` and verified to be loaded. Tests that begin "from the
   * inventory page" depend on this fixture to skip the login boilerplate.
   */
  loggedInInventoryPage: InventoryPage;
};

/**
 * Extended Playwright `test` with Page Object fixtures.
 *
 * Each Page Object is constructed per test against the active `page`, giving
 * tests typed, self-documenting handles without manual instantiation.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  loggedInInventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(STANDARD_USER, STANDARD_PASSWORD);
    await inventoryPage.isLoaded();

    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
