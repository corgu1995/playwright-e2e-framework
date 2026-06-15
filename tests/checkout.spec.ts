import { test, expect } from '../src/fixtures';

/**
 * Full end-to-end purchase flow:
 * login -> add items -> cart -> checkout information -> overview -> complete.
 */
test.describe('Checkout', () => {
  const BACKPACK = 'Sauce Labs Backpack';
  const BIKE_LIGHT = 'Sauce Labs Bike Light';

  test('completes a purchase end to end', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Add two products and confirm the badge reflects both.
    await loggedInInventoryPage.addItemToCartByName(BACKPACK);
    await loggedInInventoryPage.addItemToCartByName(BIKE_LIGHT);
    expect(await loggedInInventoryPage.getCartBadgeCount()).toBe(2);

    // Review the cart contents.
    await loggedInInventoryPage.openCart();
    expect(await cartPage.isLoaded()).toBe(true);

    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toHaveLength(2);
    expect(cartItems).toEqual(expect.arrayContaining([BACKPACK, BIKE_LIGHT]));

    // Drive the two-step checkout to completion.
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ada', 'Lovelace', '94016');
    await checkoutPage.continue();
    await checkoutPage.finish();

    // The order-complete page confirms success.
    expect(await checkoutPage.getCompleteHeader()).toBe(
      'Thank you for your order!',
    );
  });
});
