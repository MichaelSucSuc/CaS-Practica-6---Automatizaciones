import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import testData from '../data/testData.json' with { type: 'json' };

test.describe('Capítulo 6: Suite de Pruebas Automatizadas SauceDemo (ISO/IEC/IEEE 29119)', () => {

  // =========================================================================
  // REQUISITO R1: Autenticar usuario válido y rechazar acceso no válido
  // =========================================================================

  test('T01 - Autenticación válida con credenciales estándar [R1]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);

    // Oráculo 1: Redirección exitosa a la URL del catálogo de inventario
    await expect(page).toHaveURL(/inventory\.html$/);

    // Oráculo 2: Despliegue visible y operativo del contenedor de productos
    await expect(inventoryPage.inventoryList).toBeVisible();
  });

  test('T02 - Rechazo de autenticación con contraseña incorrecta [R1]', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(testData.users.invalid.username, testData.users.invalid.password);

    // Oráculo 1: Mensaje de error visual descriptivo de discrepancia de credenciales
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(testData.messages.loginErrorMismatch);

    // Oráculo 2: Persistencia del formulario de login y bloqueo de acceso a inventario
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).not.toHaveURL(/inventory\.html$/);
  });

  test('T03 - Bloqueo de acceso para cuenta de usuario bloqueada [R1]', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(testData.users.locked.username, testData.users.locked.password);

    // Oráculo: Notificación específica de bloqueo de cuenta por políticas del sistema
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(testData.messages.loginErrorLocked);
    await expect(page).not.toHaveURL(/inventory\.html$/);
  });

  test('T04 - Validación de obligatoriedad con campos de credenciales vacíos [R1]', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(testData.users.empty.username, testData.users.empty.password);

    // Oráculo: Alerta que exige ingresar el nombre de usuario
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(testData.messages.loginErrorRequiredUsername);
    await expect(page).not.toHaveURL(/inventory\.html$/);
  });

  // =========================================================================
  // REQUISITO R2: Ordenar catálogo por precio ascendente
  // =========================================================================

  test('T05 - Ordenar catálogo por precio ascendente con verificación numérica completa [R2]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);
    await expect(inventoryPage.inventoryList).toBeVisible();

    // Seleccionar orden Price (low to high) -> 'lohi'
    await inventoryPage.sortBy('lohi');

    // Obtener todos los precios numéricos del catálogo visible
    const prices = await inventoryPage.getAllItemPrices();

    // Oráculo: Verificar que la lista tiene al menos 2 items y que p[i] <= p[i+1] para toda la lista
    expect(prices.length).toBeGreaterThan(1);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  // =========================================================================
  // REQUISITO R3: Agregar y retirar productos manteniendo el carrito
  // =========================================================================

  test('T06 - Agregar un único producto al carrito actualiza contador [R3]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);

    await inventoryPage.addProduct(testData.products.backpack.id);

    // Oráculo: El badge del carrito refleja exactamente 1 producto añadido
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('T07 - Retirar producto del inventario reinicia el carrito [R3]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);

    await inventoryPage.addProduct(testData.products.backpack.id);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeProduct(testData.products.backpack.id);

    // Oráculo: El badge desaparece de la vista al quedar el carrito vacío (count = 0)
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('T08 - Agregar dos productos y verificar su persistencia en la vista del carrito [R3]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);

    await inventoryPage.addProduct(testData.products.backpack.id);
    await inventoryPage.addProduct(testData.products.bikeLight.id);

    // Oráculo 1: El badge totaliza 2 productos
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // Navegar a la página del carrito
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(cartPage.cartList).toBeVisible();

    // Oráculo 2: Ambos productos están listados con sus títulos correspondientes
    const names = await cartPage.getItemNames();
    expect(names).toContain(testData.products.backpack.name);
    expect(names).toContain(testData.products.bikeLight.name);
    expect(await cartPage.getItemCount()).toBe(2);
  });

  // =========================================================================
  // REQUISITO R4: Exigir datos obligatorios antes de continuar compra
  // =========================================================================

  test('T09 - Validación de campo obligatorio Nombre (First Name) en checkout [R4]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);
    await inventoryPage.addProduct(testData.products.backpack.id);
    await inventoryPage.openCart();
    await cartPage.clickCheckout();

    await expect(page).toHaveURL(/checkout-step-one\.html$/);

    // Enviar formulario con First Name vacío
    await checkoutPage.fillInformation(
      testData.checkout.missingFirstName.firstName,
      testData.checkout.missingFirstName.lastName,
      testData.checkout.missingFirstName.postalCode
    );
    await checkoutPage.clickContinue();

    // Oráculo: Error específico exigiendo First Name y no avanza al paso dos
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText(testData.messages.checkoutErrorFirstName);
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  test('T10 - Validación de campo obligatorio Código Postal en checkout [R4]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);
    await inventoryPage.addProduct(testData.products.backpack.id);
    await inventoryPage.openCart();
    await cartPage.clickCheckout();

    // Enviar formulario con Postal Code vacío
    await checkoutPage.fillInformation(
      testData.checkout.missingPostalCode.firstName,
      testData.checkout.missingPostalCode.lastName,
      testData.checkout.missingPostalCode.postalCode
    );
    await checkoutPage.clickContinue();

    // Oráculo: Error específico exigiendo Postal Code y permanece en el paso uno
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText(testData.messages.checkoutErrorPostalCode);
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  // =========================================================================
  // REQUISITO R5: Mostrar importes consistentes y completar compra simulada
  // =========================================================================

  test('T11 - Verificación de consistencia aritmética de importes y cierre de compra [R5]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(testData.users.valid.username, testData.users.valid.password);

    // Agregar dos productos al carrito
    await inventoryPage.addProduct(testData.products.backpack.id);
    await inventoryPage.addProduct(testData.products.bikeLight.id);
    await inventoryPage.openCart();
    await cartPage.clickCheckout();

    // Completar datos de cliente válidos
    await checkoutPage.fillInformation(
      testData.checkout.valid.firstName,
      testData.checkout.valid.lastName,
      testData.checkout.valid.postalCode
    );
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL(/checkout-step-two\.html$/);

    // Obtener precios individuales de los productos en el resumen
    const itemPrices = await checkoutPage.getItemPrices();
    const sumPrices = itemPrices.reduce((acc, p) => acc + p, 0);

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // Oráculo 1: Subtotal mostrado coincide exactamente con la suma aritmética de productos
    expect(subtotal).toBeCloseTo(sumPrices, 2);

    // Oráculo 2: Total = Subtotal + Impuesto (con tolerancia estricta de 0.01)
    expect(Math.abs(total - (subtotal + tax))).toBeLessThanOrEqual(0.01);

    // Finalizar orden
    await checkoutPage.clickFinish();

    // Oráculo 3: Pantalla de confirmación con mensaje de éxito de orden completada
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(checkoutPage.completeHeader).toContainText(testData.messages.orderConfirmation);
  });

  // =========================================================================
  // REQUISITO R6: Cerrar sesión y exigir autenticación para el inventario
  // =========================================================================

  test('T12 - Cierre de sesión y bloqueo de acceso directo por URL a inventario [R6]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Iniciar sesión
    await loginPage.login(testData.users.valid.username, testData.users.valid.password);
    await expect(inventoryPage.inventoryList).toBeVisible();

    // Cerrar sesión a través del menú lateral
    await inventoryPage.logout();

    // Oráculo 1: Redirección al formulario inicial de login
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);

    // Intentar acceder directamente por URL al catálogo sin sesión activa
    await inventoryPage.gotoDirect();

    // Oráculo 2: Acceso no autorizado denegado, redirigido a login y muestra advertencia
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).not.toHaveURL(/inventory\.html$/);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(testData.messages.unauthenticatedDirectAccess);
  });

});
