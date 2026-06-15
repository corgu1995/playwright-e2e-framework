import { test, expect } from '../src/fixtures';

/**
 * Inventory page behaviour: catalogue size, sorting, and cart-badge updates.
 *
 * Every test starts from the `loggedInInventoryPage` fixture, which logs in as
 * `standard_user` and hands back a ready inventory page.
 */
test.describe('Inventory', () => {
  const EXPECTED_ITEM_COUNT = 6;
  const BACKPACK = 'Sauce Labs Backpack';
  const BIKE_LIGHT = 'Sauce Labs Bike Light';

  test('displays the full product catalogue', async ({
    loggedInInventoryPage,
  }) => {
    expect(await loggedInInventoryPage.getItemCount()).toBe(EXPECTED_ITEM_COUNT);
  });

  test('sorts by price low to high (ascending)', async ({
    loggedInInventoryPage,
  }) => {
    await loggedInInventoryPage.sortBy('lohi');

    const prices = await loggedInInventoryPage.getItemPrices();
    const ascending = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(ascending);
  });

  test('sorts by name Z to A (descending)', async ({
    loggedInInventoryPage,
  }) => {
    await loggedInInventoryPage.sortBy('za');

    const names = await loggedInInventoryPage.getItemNames();
    const descending = [...names].sort((a, b) => b.localeCompare(a));

    expect(names).toEqual(descending);
  });

  test('adding and removing items updates the cart badge', async ({
    loggedInInventoryPage,
  }) => {
    expect(await loggedInInventoryPage.getCartBadgeCount()).toBe(0);

    await loggedInInventoryPage.addItemToCartByName(BACKPACK);
    expect(await loggedInInventoryPage.getCartBadgeCount()).toBe(1);

    await loggedInInventoryPage.addItemToCartByName(BIKE_LIGHT);
    expect(await loggedInInventoryPage.getCartBadgeCount()).toBe(2);

    await loggedInInventoryPage.removeItemFromCartByName(BACKPACK);
    expect(await loggedInInventoryPage.getCartBadgeCount()).toBe(1);
  });
});
