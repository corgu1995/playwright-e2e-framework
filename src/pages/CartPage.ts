import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the shopping cart (`/cart.html`).
 *
 * Lets tests read the line items currently in the cart and proceed into the
 * checkout flow.
 */
export class CartPage extends BasePage {
  private readonly cartItemNames: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItemNames = this.getByTestId('inventory-item-name');
    this.checkoutButton = this.getByTestId('checkout');
  }

  /** Whether the cart page has finished loading. */
  async isLoaded(): Promise<boolean> {
    await this.waitForUrlContains('/cart.html');
    return this.checkoutButton.isVisible();
  }

  /** Names of the items currently in the cart, in display order. */
  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  /** Number of line items in the cart. */
  async getItemCount(): Promise<number> {
    return this.cartItemNames.count();
  }

  /** Proceed to the first checkout step. */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
    await this.waitForUrlContains('/checkout-step-one.html');
  }
}
