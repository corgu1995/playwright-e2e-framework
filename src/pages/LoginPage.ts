import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Sauce Labs login screen (the site root `/`).
 *
 * Encapsulates the username/password form and the inline error banner so that
 * tests describe intent (`login`, `getErrorMessage`) rather than selectors.
 */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.getByTestId('username');
    this.passwordInput = this.getByTestId('password');
    this.loginButton = this.getByTestId('login-button');
    this.errorMessage = this.getByTestId('error');
  }

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    await super.goto('/');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  /**
   * Fill in credentials and submit the login form.
   *
   * @param username - The account username.
   * @param password - The account password.
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Return the text of the inline error banner shown on a failed login.
   * Waits for the banner to be visible so callers get deterministic results.
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  /** Whether the error banner is currently visible. */
  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
