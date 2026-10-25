export class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async gotoDirect() {
    await this.page.goto('/inventory.html');
  }

  async isInventoryListVisible() {
    return await this.inventoryList.isVisible();
  }

  async getAllItemPrices() {
    await this.itemPrices.first().waitFor({ state: 'visible' });
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map(txt => parseFloat(txt.replace('$', '').trim()));
  }

  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  async addProduct(productSlug) {
    const btn = this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
    await btn.click();
  }

  async removeProduct(productSlug) {
    const btn = this.page.locator(`[data-test="remove-${productSlug}"]`);
    await btn.click();
  }

  async getCartBadgeCount() {
    if (await this.cartBadge.isVisible()) {
      const count = await this.cartBadge.textContent();
      return parseInt(count || '0', 10);
    }
    return 0;
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }
}
