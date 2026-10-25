export class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Step One
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step Two
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Complete
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillInformation(firstName, lastName, postalCode) {
    if (firstName) await this.firstNameInput.fill(firstName);
    else await this.firstNameInput.clear();

    if (lastName) await this.lastNameInput.fill(lastName);
    else await this.lastNameInput.clear();

    if (postalCode) await this.postalCodeInput.fill(postalCode);
    else await this.postalCodeInput.clear();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async getErrorMessageText() {
    return (await this.errorMessage.textContent()) || '';
  }

  async getItemPrices() {
    await this.itemPrices.first().waitFor({ state: 'visible' });
    const texts = await this.itemPrices.allTextContents();
    return texts.map(txt => parseFloat(txt.replace('$', '').trim()));
  }

  async getSubtotal() {
    const text = (await this.subtotalLabel.textContent()) || '';
    // Formato típico: "Item total: $29.99"
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax() {
    const text = (await this.taxLabel.textContent()) || '';
    // Formato típico: "Tax: $2.40"
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal() {
    const text = (await this.totalLabel.textContent()) || '';
    // Formato típico: "Total: $32.39"
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async getCompleteHeaderText() {
    return (await this.completeHeader.textContent()) || '';
  }
}
