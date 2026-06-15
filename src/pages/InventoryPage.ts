import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Sort options offered by the inventory page's product-sort dropdown. */
export type SortOption =
  | 'az' // Name (A to Z)
  | 'za' // Name (Z to A)
  | 'lohi' // Price (low to high)
  | 'hilo'; // Price (high to low)

/**
 * Page Object for the inventory (products) page shown after a successful login.
 *
 * Exposes the product list, the add/remove-to-cart controls, the cart badge,
 * and the sort dropdown. Item-scoped actions are addressed by the product name
 * so tests stay readable and resilient to ordering changes.
 */
export class InventoryPage extends BasePage {
  private readonly inventoryContainer: Locator;
  private readonly inventoryItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = this.getByTestId('inventory-container');
    this.inventoryItems = this.getByTestId('inventory-item');
    this.itemNames = this.getByTestId('inventory-item-name');
    this.itemPrices = this.getByTestId('inventory-item-price');
    this.sortDropdown = this.getByTestId('product-sort-container');
    this.cartBadge = this.getByTestId('shopping-cart-badge');
    this.cartLink = this.getByTestId('shopping-cart-link');
  }

  /** Whether the inventory page has finished loading. */
  async isLoaded(): Promise<boolean> {
    await this.waitForUrlContains('/inventory.html');
    await this.inventoryContainer.waitFor({ state: 'visible' });
    return this.inventoryContainer.isVisible();
  }

  /** Number of product cards currently rendered. */
  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  /**
   * Add a single product to the cart by its visible name.
   *
   * @param name - Exact product name, e.g. "Sauce Labs Backpack".
   */
  async addItemToCartByName(name: string): Promise<void> {
    await this.itemCardByName(name)
      .getByRole('button', { name: /add to cart/i })
      .click();
  }

  /**
   * Remove a single product from the cart by its visible name.
   *
   * @param name - Exact product name, e.g. "Sauce Labs Backpack".
   */
  async removeItemFromCartByName(name: string): Promise<void> {
    await this.itemCardByName(name)
      .getByRole('button', { name: /remove/i })
      .click();
  }

  /**
   * Current value shown on the shopping-cart badge. Returns `0` when the badge
   * is absent, which is how the demo app represents an empty cart.
   */
  async getCartBadgeCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }
    const text = (await this.cartBadge.textContent())?.trim() ?? '0';
    return Number.parseInt(text, 10);
  }

  /**
   * Select a sort option from the product-sort dropdown.
   *
   * @param option - One of the {@link SortOption} values.
   */
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /** Product names in their current display order. */
  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  /**
   * Product prices in their current display order, parsed into numbers
   * (the leading `$` is stripped).
   */
  async getItemPrices(): Promise<number[]> {
    const raw = await this.itemPrices.allTextContents();
    return raw.map((price) => Number.parseFloat(price.replace('$', '').trim()));
  }

  /** Navigate to the cart page via the cart icon. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
    await this.waitForUrlContains('/cart.html');
  }

  /**
   * Locate the product card (`inventory-item`) that contains the given name.
   * Scoping actions to this card keeps add/remove operations unambiguous.
   */
  private itemCardByName(name: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }
}
