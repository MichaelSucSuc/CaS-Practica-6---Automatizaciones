export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.goto();
    if (username !== undefined && username !== '') {
      await this.usernameInput.fill(username);
    } else {
      await this.usernameInput.clear();
    }

    if (password !== undefined && password !== '') {
      await this.passwordInput.fill(password);
    } else {
      await this.passwordInput.clear();
    }

    await this.loginButton.click();
  }

  async isLoginFormVisible() {
    return await this.loginButton.isVisible();
  }

  async getErrorMessageText() {
    return (await this.errorMessage.textContent()) || '';
  }
}
