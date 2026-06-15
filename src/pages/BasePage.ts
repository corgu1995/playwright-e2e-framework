import { Locator, Page } from '@playwright/test';

/**
 * Base class for all Page Objects.
 *
 * Holds the Playwright {@link Page} handle and exposes small, reusable helpers
 * that every page needs. Concrete pages extend this class and add their own
 * locators and behaviour. Keeping these helpers in one place avoids repeating
 * navigation and selector boilerplate across the suite.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the configured `baseURL`.
   *
   * @param path - Path beginning with `/` (defaults to the site root).
   */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait until the current URL contains the given fragment. Useful for
   * asserting navigation between flow steps without hard-coding full URLs.
   */
  async waitForUrlContains(fragment: string): Promise<void> {
    await this.page.waitForURL(new RegExp(escapeRegExp(fragment)));
  }

  /**
   * Resolve a locator by the `data-test` attribute that the Sauce Labs demo
   * app uses throughout its markup. Centralising this keeps selectors stable
   * and readable in the concrete page objects.
   */
  protected getByTestId(testId: string): Locator {
    return this.page.locator(`[data-test="${testId}"]`);
  }

  /** Return the current page URL. */
  url(): string {
    return this.page.url();
  }
}

/** Escape characters that are special inside a regular expression. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
