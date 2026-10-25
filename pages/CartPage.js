export class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.cartList = page.locator('[data-test="cart-list"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async isCartListVisible() {
    return await this.cartList.isVisible();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async getItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async removeProduct(productSlug) {
    const btn = this.page.locator(`[data-test="remove-${productSlug}"]`);
    await btn.click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }
}
