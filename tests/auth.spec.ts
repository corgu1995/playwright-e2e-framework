import { test, expect } from '../src/fixtures';

/**
 * Authentication scenarios for the Sauce Labs demo login.
 *
 * Covers the happy path plus the two documented failure modes: a locked-out
 * account and invalid credentials.
 */
test.describe('Authentication', () => {
  const STANDARD_USER = process.env.STANDARD_USER ?? 'standard_user';
  const STANDARD_PASSWORD = process.env.STANDARD_PASSWORD ?? 'secret_sauce';
  const LOCKED_OUT_USER = process.env.LOCKED_OUT_USER ?? 'locked_out_user';

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials land on the inventory page', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(STANDARD_USER, STANDARD_PASSWORD);

    expect(await inventoryPage.isLoaded()).toBe(true);
    expect(inventoryPage.url()).toContain('/inventory.html');
  });

  test('locked-out user sees the locked error message', async ({ loginPage }) => {
    await loginPage.login(LOCKED_OUT_USER, STANDARD_PASSWORD);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out.');
  });

  test('invalid credentials are rejected with an error', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain(
      'Username and password do not match any user in this service',
    );
  });
});
