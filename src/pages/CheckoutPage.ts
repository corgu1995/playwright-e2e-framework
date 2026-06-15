import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object spanning the two-step checkout flow and the order-complete page:
 *
 *  - `checkout-step-one.html`  — customer information form
 *  - `checkout-step-two.html`  — order overview
 *  - `checkout-complete.html`  — confirmation
 *
 * Modelling the flow in a single object keeps the end-to-end checkout test
 * linear and easy to read.
 */
export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = this.getByTestId('firstName');
    this.lastNameInput = this.getByTestId('lastName');
    this.postalCodeInput = this.getByTestId('postalCode');
    this.continueButton = this.getByTestId('continue');
    this.finishButton = this.getByTestId('finish');
    this.completeHeader = this.getByTestId('complete-header');
    this.errorMessage = this.getByTestId('error');
  }

  /**
   * Fill the customer-information form on checkout step one.
   *
   * @param firstName - Customer first name.
   * @param lastName  - Customer last name.
   * @param postalCode - Customer postal/ZIP code.
   */
  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /** Submit step one and advance to the order overview (step two). */
  async continue(): Promise<void> {
    await this.continueButton.click();
    await this.waitForUrlContains('/checkout-step-two.html');
  }

  /** Confirm the order on step two and advance to the completion page. */
  async finish(): Promise<void> {
    await this.finishButton.click();
    await this.waitForUrlContains('/checkout-complete.html');
  }

  /**
   * Text of the confirmation header on the order-complete page,
   * e.g. "Thank you for your order!".
   */
  async getCompleteHeader(): Promise<string> {
    await this.completeHeader.waitFor({ state: 'visible' });
    return (await this.completeHeader.textContent())?.trim() ?? '';
  }

  /** Text of the validation error shown when required fields are missing. */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
